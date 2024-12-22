import { ExtensionContext, window } from 'vscode';
import { MicroStudioViewProvider } from './providers/MicroStudioViewProvider';

export function activate(context: ExtensionContext) {
  // Register the MicroStudio WebviewViewProvider
  console.log('Registering MicroStudioViewProvider...');
  context.subscriptions.push(
    window.registerWebviewViewProvider(
      MicroStudioViewProvider.viewType,
      new MicroStudioViewProvider(context.extensionUri)
    )
  );
}

export function deactivate() {
  // Cleanup logic if needed
}
