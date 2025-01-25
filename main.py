import os
import subprocess
import sys
import time
from flask import Flask, request, send_from_directory, jsonify
from threading import Thread
import webbrowser
import argparse
import tkinter as tk
from tkinter import filedialog

# Make sure savedata and savestates directories exist
os.makedirs(os.path.expanduser("~/.config/ClassicDeck/savedata"), exist_ok=True)
os.makedirs(os.path.expanduser("~/.config/ClassicDeck/savestates"), exist_ok=True)

runningInPyInstaller = False

if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    runningInPyInstaller = True
else:
    runningInPyInstaller = False

scriptpath = None
if runningInPyInstaller:
    scriptpath = sys.executable
else:
    scriptpath = os.path.abspath(__file__)
print(scriptpath)

parser = argparse.ArgumentParser(description="Classic Deck")
parser.add_argument("--nes", type=str, help="Start an NES game.")
parser.add_argument("--snes", type=str, help="Start an SNES game.")
parser.add_argument("--n64", type=str, help="Start an N64 game.")
parser.add_argument("--add-to-steam", type=str, nargs=3, metavar=("NAME", "PATH", "LAUNCHARGS"), help="Add a game to steam with its name and path and launchargs.")

# Parse the arguments
args = parser.parse_args()

startgame = False
rom = None
console = None

if args.nes:
    startgame = True
    rom = args.nes
    console = "nes"
elif args.snes:
    startgame = True
    rom = args.snes
    console = "snes"
elif args.n64:
    startgame = True
    rom = args.n64
    console = "n64"

addToSteamOnBoot = False
gamename = None
gamepath = None
gamelaunchargs = None

if args.add_to_steam:
    addToSteamOnBoot = True
    startgame = True
    gamename = args.add_to_steam[0]
    gamepath = args.add_to_steam[1]
    gamelaunchargs = args.add_to_steam[2]

from module import NonSteamGameAdder
adder = NonSteamGameAdder(
    steamgriddb_api_key="76f41a84b7a0edadc000daa8ff295908"
)
steamid64 = adder.get_current_steam_user()['steamid']
steamid = str(int(steamid64) - 76561197960265728)
account_name = adder.get_current_steam_user()['account_name']

def open_file_picker(file_types=None):
    """
    Open a file picker dialog and return the selected file path.
    
    Args:
        file_types (list): List of file type tuples for filtering, e.g., [("Text Files", "*.txt"), ("Images", "*.png")].
        
    Returns:
        str: The selected file path, or an empty string if canceled.
    """
    if file_types is None:
        file_types = [("All Files", "*.*")]  # Default to allow all files

    root = tk.Tk()
    root.withdraw()  # Hide the main Tkinter window

    file_path = filedialog.askopenfilename(
        title="Select a File",
        filetypes=file_types
    )
    return file_path

# Initialize Flask app
app = Flask(__name__)

@app.route('/')
def hello_world():
    return send_from_directory("public", "index.html")

@app.route('/<path:path>')
def send_static(path):
    return send_from_directory("public", path)

@app.route('/openurl', methods=['POST'])
def open_url():
    data = request.get_json()
    url = data.get('url')
    if url:
        webbrowser.open(url)
        return {'status': 'success', 'message': f'URL {url} opened in default browser.'}
    else:
        return {'status': 'error', 'message': 'No URL provided.'}, 400

@app.route('/console')
def consolepage():
    return send_from_directory("public", "index.html")

@app.route('/scripts')
def scriptspage():
    return send_from_directory("public", "index.html")

@app.route('/select-rom/<string:systemconsole>', methods=['GET'])
def select_file(systemconsole):
    """Endpoint to open a file picker and return the selected file path."""
    file_path = None
    if (systemconsole == "nes"):
        file_path = open_file_picker([("NES Roms", "*.nes *.fds *.unf")])
    if (systemconsole == "snes"):
        file_path = open_file_picker([("SNES Roms", "*.smc *.sfc")])
    if (systemconsole == "n64"):
        file_path = open_file_picker([("N64 Roms", "*.n64 *.z64 *.v64")])
    if file_path:
        return jsonify({"status": "success", "file_path": file_path})
    else:
        return jsonify({"status": "cancelled", "file_path": None})
    
@app.route('/add-to-steam/<systemconsole>', methods=['GET'])
def add_to_steam(systemconsole):
    """Endpoint to open a file picker and return the selected file path."""
    cmdlinearguments = None
    rom = request.args.get('rom')
    gamename = request.args.get('gamename')
    if runningInPyInstaller:
        cmdlinearguments = f"--{systemconsole} '{rom}'"
        adder.add_non_steam_game(scriptpath, gamename, steamid, cmdlinearguments)
    else:
        cmdlinearguments = f"{scriptpath} --{systemconsole} '{rom}'"
        adder.add_non_steam_game("/usr/bin/python3", gamename, steamid, cmdlinearguments)
    return jsonify({"status": "success"})

@app.route('/executeonlinescript', methods=['POST', 'GET'])
def execute_online_script():
    script_url = request.args.get('url')
    if script_url:
        command = f'wget -qO- {script_url} | konsole --notransparency -e bash -c "$(cat)"'
        subprocess.run(command, shell=True)
        return {'status': 'success', 'message': 'Script downloaded and executed.'}
    else:
        return {'status': 'error', 'message': 'No URL provided.'}, 400

@app.route('/api/steamid')
def get_steamid():
    return steamid

@app.route('/api/accountname')
def get_account_name():
    return {'account_name': account_name}

@app.route('/exit')
def exit_app():
    shutdown()
    return 'Shutting down...'

# Function to shutdown Flask app
def shutdown():
    """Shut down the Flask application."""
    os._exit(0)

# Function to monitor Chromium process and shut down Flask when Chromium closes
def monitor_chromium(chromium_process):
    """Monitor the Chromium process and shut down Flask when Chromium closes."""
    while True:
        if chromium_process.poll() is not None:  # Check if the process is terminated
            shutdown()
            break
        time.sleep(1)

def run_chromium():
    """Run the Chromium AppImage."""
    # Get the absolute path of the directory where this script is located
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Change the current working directory to where the Python script is located
    os.chdir(current_dir)

    # Path to Chromium AppImage
    chromium_command = './chromium/chromium.AppImage --app=http://localhost:5000 --disable-infobars --disable-dev-tools --window-size=1280,800'
    
    # Run Chromium command using subprocess.Popen
    process = subprocess.Popen(chromium_command, shell=True)
    return process

if __name__ == '__main__':
    if not startgame:
        # Start Flask app in a separate thread
        flask_thread = Thread(target=app.run, kwargs={'port': 5000, 'use_reloader': False})
        flask_thread.start()

        # Start Chromium and monitor it
        chromium_process = run_chromium()

        # Monitor Chromium in a separate thread
        monitor_thread = Thread(target=monitor_chromium, args=(chromium_process,))
        monitor_thread.start()

        # Wait for both threads to finish
        flask_thread.join()
        monitor_thread.join()
    elif addToSteamOnBoot:
        adder.add_non_steam_game(gamepath, gamename, steamid, gamelaunchargs)
    else:
        savefilepath = os.path.expanduser("~/.config/ClassicDeck/savedata")
        savestatepath = os.path.expanduser("~/.config/ClassicDeck/savestates")
        config_text = f"savefile_directory = {savefilepath}\nsavestate_directory = {savestatepath}"
        with open('saveconfig.cfg', 'w') as file:
            file.write(config_text)
        retroarch_command = None
        if console == "nes":
            retroarch_command = [
                f'{os.path.dirname(os.path.abspath(__file__))}/emulators/RetroArch-Linux-x86_64/RetroArch-Linux-x86_64.AppImage',
                '--appendconfig', 'saveconfig.cfg', '-L', f'{os.path.dirname(os.path.abspath(__file__))}/cores/nes.so', rom, '--fullscreen'
            ]
        elif console == "snes":
            retroarch_command = [
                f'{os.path.dirname(os.path.abspath(__file__))}/emulators/RetroArch-Linux-x86_64/RetroArch-Linux-x86_64.AppImage',
                '--appendconfig', 'saveconfig.cfg', '-L', f'{os.path.dirname(os.path.abspath(__file__))}/cores/snes.so', rom, '--fullscreen'
            ]
        elif console == "n64":
            retroarch_command = [
                f'{os.path.dirname(os.path.abspath(__file__))}/emulators/RetroArch-Linux-x86_64/RetroArch-Linux-x86_64.AppImage',
                '--appendconfig', 'saveconfig.cfg', '-L', f'{os.path.dirname(os.path.abspath(__file__))}/cores/n64.so', rom, '--fullscreen'
            ]

        if retroarch_command:
            print(retroarch_command)
            subprocess.run(retroarch_command, shell=False) # TODO: make sure savedata works maybe recompile to fix it
