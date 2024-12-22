import {
  Disposable,
  Webview,
  Uri,
  WebviewViewProvider,
  WebviewView,
  WebviewViewResolveContext,
  CancellationToken,
} from 'vscode';
import { getUri, getNonce } from '../utilities';

export class MicroStudioViewProvider implements WebviewViewProvider {
  public static readonly viewType = 'microstudio';
  private _view?: WebviewView;
  private readonly _extensionUri: Uri;
  private _disposables: Disposable[] = [];

  constructor(extensionUri: Uri) {
    this._extensionUri = extensionUri;
  }

  /**
   * Resolves the webview view when it becomes visible in the UI.
   */
  resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        Uri.joinPath(this._extensionUri, 'out'),
        Uri.joinPath(this._extensionUri, 'webview-ui/build'),
      ],
    };

    webviewView.webview.html = this._getWebviewContent(
      webviewView.webview,
      this._extensionUri
    );

    this._setWebviewListener(webviewView.webview);
  }

  /**
   * Generates the HTML content for the webview.
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri): string {
    const stylesUri = getUri(webview, extensionUri, [
      'webview-ui',
      'build',
      'assets',
      'index.css',
    ]);
    const scriptUri = getUri(webview, extensionUri, [
      'webview-ui',
      'build',
      'assets',
      'index.js',
    ]);
    const staticUri = getUri(webview, extensionUri, [
      'webview-ui',
      'build',
      'assets',
    ]);

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en" class="h-full bg-gray-900">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; script-src 'nonce-${nonce}'; style-src ${webview.cspSource};">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${stylesUri}" rel="stylesheet">
        <title>MicroStudio</title>
      </head>
      <body class="h-full">
        <div id="root" class="w-full h-full"></div>
        <script nonce="${nonce}">
          console.log('Webview loaded!');
        </script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }

  /**
   * Sets up a listener for messages from the webview.
   */
  private _setWebviewListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case 'ready':
            console.log('Webview is ready');
            break;
        }
      },
      undefined,
      this._disposables
    );
  }

  /**
   * Cleans up disposables when the view is disposed.
   */
  dispose() {
    this._disposables.forEach((d) => d.dispose());
    this._disposables = [];
  }
}
