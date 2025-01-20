import os
import subprocess
import time
from flask import Flask, request, send_from_directory
from threading import Thread
import webbrowser

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
    chromium_command = './chromium/chromium.AppImage --no-sandbox --app=http://localhost:5000 --disable-infobars --disable-dev-tools --start-maximized'
    
    # Run Chromium command using subprocess.Popen
    process = subprocess.Popen(chromium_command, shell=True)
    return process

if __name__ == '__main__':
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
