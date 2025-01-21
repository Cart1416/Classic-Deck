import os
import subprocess
import time
from flask import Flask, request, send_from_directory
from threading import Thread
import webbrowser
import argparse

parser = argparse.ArgumentParser(description="Classic Deck")
parser.add_argument("--nes", type=str, help="Start an NES game.")
parser.add_argument("--snes", type=str, help="Start an SNES game.")
parser.add_argument("--n64", type=str, help="Start an N64 game.")

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

print(rom)

from module import NonSteamGameAdder
adder = NonSteamGameAdder(
    steamgriddb_api_key="76f41a84b7a0edadc000daa8ff295908"
)
steamid = adder.get_current_steam_user()['steamid']
account_name = adder.get_current_steam_user()['account_name']

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
    else:
        retroarch_command = None
        if console == "nes":
            retroarch_command = [
                'emulators/RetroArch-Linux-x86_64/RetroArch-Linux-x86_64.AppImage',
                '-L', 'cores/nes.so', rom, '--fullscreen'
            ]
        elif console == "snes":
            retroarch_command = [
                'emulators/RetroArch-Linux-x86_64/RetroArch-Linux-x86_64.AppImage',
                '-L', 'cores/snes.so', rom, '--fullscreen'
            ]
        elif console == "n64":
            retroarch_command = [
                'emulators/RetroArch-Linux-x86_64/RetroArch-Linux-x86_64.AppImage',
                '-L', 'cores/n64.so', rom, '--fullscreen'
            ]

        if retroarch_command:
            subprocess.run(retroarch_command, shell=False)
