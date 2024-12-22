# MicroStudio Extension for VS Code

The **MicroStudio Extension** for Visual Studio Code is a custom extension that integrates the [MicroStudio](https://microstudio.dev) game engine with the power of VS Code. This extension allows you to manage and edit your MicroStudio projects directly from the VS Code editor, leveraging the MicroStudio API to interact with your projects seamlessly.

## Features

### Project Management

- **View Projects**: Log in to your MicroStudio account and browse your available projects.
- **Select a Project**: Pick a project to view its folders and assets.

### File Operations

- **File Viewing and Editing**: Load files from your MicroStudio projects directly into VS Code for editing.
- **Live Sync**: Changes made in VS Code are automatically pushed to the MicroStudio API, keeping your project up to date without needing to save manually.

### Integration

- **Custom Sidebar View**: Adds a dedicated MicroStudio view in the Activity Bar for managing your projects.
- **Webview for Rich Interactions**: The extension provides a web-based panel for enhanced functionality, powered by React and TailwindCSS.

## Installation

### Prerequisites

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Ensure you have a MicroStudio account.
3. Node.js and npm installed on your system.

### Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/CodingButter/microstudio-vscode
   ```
2. Install dependencies:
   ```bash
   cd microstudio-vscode
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Open the project in VS Code:
   ```bash
   code .
   ```
5. Run the extension:
   - Press `F5` to open a new VS Code window with the extension loaded.

## Usage

1. Open the MicroStudio panel from the Activity Bar.
2. Log in using your MicroStudio account.
3. Browse your projects and select one to manage.
4. Open files for editing; your changes are synced back to MicroStudio automatically.

## Development

This project is built with:

- **TypeScript**: For type-safe development.
- **React**: For the webview UI.
- **TailwindCSS**: For styling the webview.
- **Vite**: For building the webview assets.

### Project Structure

- `src/`: Main source code for the VS Code extension.
  - `extension.ts`: Entry point for the extension.
  - `providers/`: Contains the `WebviewViewProvider` implementation.
  - `utilities.ts`: Helper functions for resource management.
- `webview-ui/`: React-based UI for the webview.
  - `src/`: React components and application logic.
  - `build/`: Compiled assets for the webview.

### Commands

- `npm run build`: Builds the TypeScript code and webview assets.
- `npm run watch`: Watches for file changes and rebuilds automatically.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Known Issues

- **Webview Loading**: Ensure the `webview-ui/build` directory contains the compiled assets (`index.js`, `index.css`). If missing, run `npm run build`.
- **View Not Showing**: Verify that the `viewType` in `package.json` matches the `WebviewViewProvider` ID.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

For more details on MicroStudio, visit the [official website](https://microstudio.dev).
