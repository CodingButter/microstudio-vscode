import type { WebviewApi } from 'vscode-webview';

const KEY = 'MicroStudio';
export interface VSCodeState {
  [key: string]: any;
}
/**
 * A utility wrapper around the acquireVsCodeApi() function, which enables
 * message passing and state management between the webview and extension
 * contexts.
 *
 * This utility also enables webview code to be run in a web browser-based
 * dev server by using native web browser features that mock the functionality
 * enabled by acquireVsCodeApi.
 */
class VSCodeAPIWrapper {
  private readonly vsCodeApi: WebviewApi<unknown> | undefined;

  constructor() {
    // Check if the acquireVsCodeApi function exists in the current development
    // context (i.e. VS Code development window or web browser)
    if (typeof acquireVsCodeApi === 'function') {
      this.vsCodeApi = acquireVsCodeApi();
    }
  }

  /**
   * Post a message (i.e. send arbitrary data) to the owner of the webview.
   *
   * @remarks When running webview code inside a web browser, postMessage will instead
   * log the given message to the console.
   *
   * @param message Abitrary data (must be JSON serializable) to send to the extension context.
   */
  public postMessage(message: unknown) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    } else {
      console.log(message);
    }
  }

  /**
   * Get the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, getState will retrieve state
   * from local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @return The current state or `undefined` if no state has been set.
   */
  public getState<T>(key: string): T {
    let state: VSCodeState;
    if (this.vsCodeApi) {
      state = (this.vsCodeApi.getState() || {}) as VSCodeState;
    } else {
      const rawState: string = localStorage.getItem(KEY) || '{}';
      state = JSON.parse(rawState) as VSCodeState;
    }
    return state[key];
  }

  /**
   * Set the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, setState will set the given
   * state using local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @param newState New persisted state. This must be a JSON serializable object. Can be retrieved
   * using {@link getState}.
   *
   * @return The new state.
   */
  public setState<T>(key: string, value: T): T {
    if (this.vsCodeApi) {
      const currentState = this.vsCodeApi.getState() || {};
      const newState = { ...currentState, [key]: value };
      this.vsCodeApi.setState({ ...currentState, ...newState });
    } else {
      const currentState = JSON.parse(localStorage.getItem(KEY) || '{}');
      const newState = { ...currentState, [key]: value };
      localStorage.setItem('vscodeState', JSON.stringify(newState));
    }
    return value;
  }
}

// Exports class singleton to prevent multiple invocations of acquireVsCodeApi.
export const vscode = new VSCodeAPIWrapper();
