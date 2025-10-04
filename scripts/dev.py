#!/usr/bin/env python3
"""
AGE Toolbox - Development Script
Launches the app in development mode with hot reload
"""

import webbrowser
import threading
import time
import sys
import os
import subprocess
import signal

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

try:
    from app import app
    print("Flask app imported successfully")
except ImportError as e:
    print(f"ERROR: Failed to import Flask app: {e}")
    sys.exit(1)

# Global variable to track processes
react_process = None

def start_flask_api():
    """Start Flask API server"""
    print("Starting Flask API server on port 5000...")
    app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)

def start_react_dev():
    """Start React development server"""
    global react_process
    frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'frontend')
    
    if not os.path.exists(frontend_dir):
        print(f"ERROR: Frontend directory not found: {frontend_dir}")
        return
    
    print("Starting React development server on port 3000...")
    try:
        if sys.platform == "win32":
            cmd = f'cd "{frontend_dir}" && npm run dev'
            react_process = subprocess.Popen(cmd, shell=True)
        else:
            react_process = subprocess.Popen(["npm", "run", "dev"], cwd=frontend_dir)
        
        # Wait for the process
        react_process.wait()
    except Exception as e:
        print(f"ERROR: Error starting React dev server: {e}")
        print("Make sure npm dependencies are installed: cd src/frontend && npm install")

def open_browser():
    """Open browser to React dev server"""
    time.sleep(6)  # Give servers time to start
    print("Opening browser to React development server...")
    webbrowser.open('http://localhost:3000')

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    global react_process
    print("\nShutting down development servers...")
    if react_process:
        print("Terminating React dev server...")
        react_process.terminate()
    print("Thanks for using AGE Toolbox!")
    sys.exit(0)

def main():
    """Main function for development mode"""
    global react_process
    
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    print("AGE Toolbox - Development Mode")
    print("=" * 40)
    print("React Dev Server: http://localhost:3000")
    print("Flask API: http://127.0.0.1:5000")
    print("Press Ctrl+C to stop")
    print("-" * 40)
    
    # Start Flask API in background thread
    flask_thread = threading.Thread(target=start_flask_api)
    flask_thread.daemon = True
    flask_thread.start()
    
    # Give Flask a moment to start
    time.sleep(1)
    
    # Open browser in separate thread
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    try:
        # Start React dev server (this will block until stopped)
        start_react_dev()
    except KeyboardInterrupt:
        signal_handler(None, None)
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

