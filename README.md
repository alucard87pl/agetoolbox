# AGE Toolbox

A modern desktop application for the Modern AGE RPG system, providing dice rolling and stunt reference tools.

## Features

- 🎲 **Dice Roller**: Roll 3d6 with bonus/penalty modifiers and target numbers
- ⚔️ **Stunts Reference**: Browse and filter Modern AGE stunts by category, setting, and SP cost
- 📊 **Excel Management**: Direct editing of stunt data through the application
- 🖥️ **Cross-Platform**: Works on Windows, macOS, and Linux
- 🚀 **Standalone**: Single executable with no additional dependencies

## Quick Start

### Development

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
npm run install-frontend

# Start development server
npm run dev
```

This will:
- Start the Flask API server on port 5000
- Start the React development server on port 3000 with hot reload
- Open your browser to http://localhost:3000

### Building

```bash
# Build for current platform
npm run build
```

This creates a standalone executable in the `dist/` folder. The build script automatically:
- Builds the React frontend for production
- Creates a launcher script
- Uses PyInstaller to bundle everything into a single executable
- Cleans up temporary files

## Project Structure

```
agetoolbox/
├── src/                    # Source code
│   ├── app.py             # Flask backend
│   └── frontend/          # React frontend source
├── data/                  # Game data
│   └── stunts.xlsx        # Stunt definitions
├── scripts/               # Build scripts
│   ├── build.py          # Universal build script
│   └── dev.py            # Development script
├── .github/
│   └── workflows/
│       └── release.yml    # GitHub Actions
├── package.json           # NPM scripts and metadata
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Releases

Download the latest release from the [Releases page](https://github.com/yourusername/age-toolbox/releases):

- **Windows**: `AGE_Toolbox.exe`
- **macOS**: `AGE_Toolbox` (may need to allow in Security & Privacy)
- **Linux**: `AGE_Toolbox`

## Building from Source

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm
- Git (for cloning)

### Steps

1. Clone the repository: `git clone https://github.com/yourusername/age-toolbox.git`
2. Navigate to the project: `cd age-toolbox`
3. Install Python dependencies: `pip install -r requirements.txt`
4. Install frontend dependencies: `npm run install-frontend`
5. Build: `npm run build`

The executable will be created in the `dist/` folder.

## Automated Releases

This project uses GitHub Actions for automated cross-platform builds:

- **Trigger**: Push a git tag (e.g., `git tag v1.0.0 && git push origin v1.0.0`)
- **Platforms**: Windows, macOS, and Linux
- **Artifacts**: Standalone executables for each platform
- **Releases**: Automatically creates GitHub releases with download links

### Creating a Release

```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically:
# 1. Build for all platforms
# 2. Create a release
# 3. Upload executables
```

## Development

### Adding New Stunts

1. Run the application
2. Go to the Stunts Reference page
3. Click "Unlock" in the header
4. Click "Add Stunt" to add new entries
5. Fill in the details and save

### Modifying Stunt Data

The stunt data is stored in `data/stunts.xlsx` and can be edited:
- Directly in Excel
- Through the application interface (when unlocked)
- Using the API endpoints

## API Endpoints

- `GET /api/test` - Test API connection
- `POST /api/roll_dice` - Roll dice with bonus/target
- `GET /api/stunts` - Get all stunts
- `POST /api/stunts` - Add new stunt
- `PUT /api/stunts/{id}` - Update stunt
- `DELETE /api/stunts/{id}` - Delete stunt

## Contributing

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/age-toolbox.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Set up development environment: `npm run install-frontend && pip install -r requirements.txt`
5. Make your changes
6. Test thoroughly: `npm run dev` and `npm run build`
7. Commit your changes: `git commit -m "Add your feature"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Submit a pull request

### Development Workflow

- Use `npm run dev` for development with hot reload
- Test your changes in both browser and built executable
- Ensure the app works on your target platform
- Update documentation if needed

## Troubleshooting

### Development Issues

**React dev server won't start:**
```bash
# Make sure Node.js and npm are installed
node --version
npm --version

# Clear npm cache and reinstall
cd src/frontend
rm -rf node_modules package-lock.json
npm install
```

**Flask API connection refused:**
- Check if port 5000 is already in use
- Restart the development server: `npm run dev`

**Build fails:**
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Make sure frontend is built: `npm run install-frontend`
- Check Python version: `python --version` (should be 3.8+)

### Platform-Specific Issues

**Windows:**
- May need to allow executable through Windows Defender
- Run as administrator if permission issues occur

**macOS:**
- Executable may be blocked by Gatekeeper
- Right-click → "Open" to bypass security warning
- Or: `xattr -d com.apple.quarantine AGE_Toolbox`

**Linux:**
- May need to make executable: `chmod +x AGE_Toolbox`
- Install dependencies: `sudo apt-get install libgtk-3-0`

## License

MIT License - see LICENSE file for details

## Credits

- Built with React, Flask, and PyWebview
- Icons from RPG Awesome
- UI components from React Bootstrap
- Modern AGE RPG system by Green Ronin Publishing