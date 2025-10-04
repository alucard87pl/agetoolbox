#!/usr/bin/env python3
"""
AGE Toolbox - Universal Build Script
Builds the application for the current platform
"""

import os
import sys
import subprocess
import shutil
import platform
from pathlib import Path

# Add src to path so we can import the app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

def get_platform_info():
    """Get platform-specific information"""
    system = platform.system().lower()
    arch = platform.machine().lower()
    
    if system == 'windows':
        return 'windows', 'x64' if '64' in arch else 'x86'
    elif system == 'darwin':
        return 'macos', 'x64' if 'intel' in arch else 'arm64'
    elif system == 'linux':
        return 'linux', 'x64'
    else:
        return 'unknown', 'x64'

def build_frontend():
    """Build the React frontend"""
    frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'frontend')
    
    if not os.path.exists(frontend_dir):
        print(f"❌ Frontend directory not found: {frontend_dir}")
        return False
    
    print("🔨 Building React frontend...")
    try:
        # Install dependencies
        if sys.platform == "win32":
            install_cmd = f'cd "{frontend_dir}" && npm install'
            build_cmd = f'cd "{frontend_dir}" && npm run build'
        else:
            install_cmd = ["npm", "install"]
            build_cmd = ["npm", "run", "build"]
        
        print("📦 Installing npm dependencies...")
        subprocess.run(install_cmd, cwd=frontend_dir, shell=(sys.platform == "win32"), check=True)
        
        print("🏗️ Building React app...")
        subprocess.run(build_cmd, cwd=frontend_dir, shell=(sys.platform == "win32"), check=True)
        
        print("✅ Frontend built successfully")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error building frontend: {e}")
        return False
    except FileNotFoundError:
        print("❌ npm not found. Please install Node.js and npm.")
        return False

def create_launcher_script():
    """Create the launcher script for the executable"""
    launcher_content = '''#!/usr/bin/env python3
"""
AGE Toolbox - Desktop Application Launcher
"""

import webview
import threading
import time
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    from app import app
    print("✅ Flask app imported successfully")
except ImportError as e:
    print(f"❌ Failed to import Flask app: {e}")
    sys.exit(1)

def start_flask_server():
    """Start Flask server in a separate thread"""
    print("🚀 Starting Flask server...")
    app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)

def main():
    """Main function to launch the webview"""
    print("🎲 Starting AGE Toolbox...")
    
    # Check if frontend build exists
    frontend_dist = os.path.join(os.path.dirname(__file__), 'src', 'frontend', 'dist')
    if not os.path.exists(frontend_dist):
        print(f"❌ Frontend build not found: {frontend_dist}")
        sys.exit(1)
    
    # Start Flask server in background
    server_thread = threading.Thread(target=start_flask_server)
    server_thread.daemon = True
    server_thread.start()
    
    # Wait for server to start
    time.sleep(2)
    
    try:
        # Create webview window
        webview.create_window(
            title='AGE Toolbox - Modern AGE RPG Helper',
            url='http://127.0.0.1:5000',
            width=1200,
            height=800,
            resizable=True,
            shadow=True
        )
        
        # Start webview
        webview.start(debug=False)
        
    except Exception as e:
        print(f"❌ Error launching webview: {e}")
        sys.exit(1)
    
    print("👋 AGE Toolbox closed. Thanks for using it!")

if __name__ == '__main__':
    main()
'''
    
    launcher_path = os.path.join(os.path.dirname(__file__), '..', 'launcher.py')
    with open(launcher_path, 'w', encoding='utf-8') as f:
        f.write(launcher_content)
    
    print(f"✅ Created launcher script: {launcher_path}")
    return launcher_path

def build_executable():
    """Build executable using PyInstaller"""
    platform_name, arch = get_platform_info()
    
    print(f"🔨 Building executable for {platform_name} ({arch})...")
    
    # Create launcher script
    launcher_path = create_launcher_script()
    
    # PyInstaller command
    cmd = [
        sys.executable, '-m', 'PyInstaller',
        '--onefile',
        '--windowed',
        '--name', f'AGE_Toolbox_{platform_name}_{arch}',
        '--add-data', 'src/frontend/dist;frontend/dist' if sys.platform == "win32" else 'src/frontend/dist:frontend/dist',
        '--add-data', 'data;data' if sys.platform == "win32" else 'data:data',
        '--hidden-import', 'openpyxl',
        '--hidden-import', 'flask',
        '--hidden-import', 'flask_cors',
        '--hidden-import', 'pywebview',
        '--hidden-import', 'webview',
        launcher_path
    ]
    
    # Platform-specific imports
    if platform_name == 'windows':
        cmd.extend(['--hidden-import', 'webview.platforms.winforms'])
    elif platform_name == 'macos':
        cmd.extend(['--hidden-import', 'webview.platforms.cocoa'])
    elif platform_name == 'linux':
        cmd.extend(['--hidden-import', 'webview.platforms.gtk'])
    
    try:
        print("🏗️ Running PyInstaller...")
        subprocess.run(cmd, check=True)
        
        # Move executable to dist folder
        exe_name = f'AGE_Toolbox_{platform_name}_{arch}'
        if platform_name == 'windows':
            exe_name += '.exe'
        
        source_exe = os.path.join('dist', exe_name)
        target_exe = os.path.join('dist', 'AGE_Toolbox.exe' if platform_name == 'windows' else 'AGE_Toolbox')
        
        if os.path.exists(source_exe):
            if os.path.exists(target_exe):
                os.remove(target_exe)
            shutil.move(source_exe, target_exe)
            print(f"✅ Executable created: {target_exe}")
        else:
            print(f"❌ Executable not found: {source_exe}")
            return False
        
        # Clean up launcher script
        os.remove(launcher_path)
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error building executable: {e}")
        return False

def main():
    """Main build function"""
    print("🎲 AGE Toolbox - Universal Build Script")
    print("=" * 50)
    
    platform_name, arch = get_platform_info()
    print(f"🖥️ Platform: {platform_name} ({arch})")
    
    # Build frontend
    if not build_frontend():
        print("❌ Frontend build failed")
        sys.exit(1)
    
    # Build executable
    if not build_executable():
        print("❌ Executable build failed")
        sys.exit(1)
    
    print("🎉 Build completed successfully!")
    print(f"📦 Executable location: dist/AGE_Toolbox{'exe' if platform_name == 'windows' else ''}")

if __name__ == '__main__':
    main()

