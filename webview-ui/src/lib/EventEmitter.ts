interface CallbackEntry {
  callback: <T>(...args: T[]) => void;
  context: object | null;
  weight: number;
}

interface InternalStore {
  _events: Set<string>;
  _console: Console;
  _maxListeners: number | null;
}

/**
 * Private map for storing internal data of EventEmitter instances.
 */
const privateMap = new WeakMap<EventEmitter, InternalStore>();

/**
 * Provide access to the internal store of the given instance.
 */
function internal(obj: EventEmitter): InternalStore {
  if (!privateMap.has(obj)) {
    privateMap.set(obj, {
      _events: new Set<string>(),
      _console: console,
      _maxListeners: null,
    });
  }
  return privateMap.get(obj)!;
}

// Excluding callbacks from internal() for performance reasons.
let _callbacks: { [eventName: string]: CallbackEntry[] | null } = {};

/** Class EventEmitter for event-driven architecture. */
export default class EventEmitter {
  /**
   * @constructor
   * @param {number|null} maxListeners - Maximum number of listeners per event.
   * @param {Console} localConsole - Console-like object for logging warnings.
   */
  constructor(
    maxListeners: number | null = null,
    localConsole: Console = console
  ) {
    const self = internal(this);

    self._events = new Set();
    self._console = localConsole;
    self._maxListeners =
      maxListeners === null ? null : parseInt(String(maxListeners), 10);

    return this;
  }

  /**
   * Add callback to the event.
   */
  private _addCallback(
    eventName: string,
    callback: <T>(...args: T[]) => void,
    context: object | null,
    weight: number
  ): this {
    this._getCallbacks(eventName)!.push({ callback, context, weight });

    // Sort the callbacks by weight.
    this._getCallbacks(eventName)!.sort((a, b) => b.weight - a.weight);

    return this;
  }

  /**
   * Get all callbacks for the event.
   */
  private _getCallbacks(eventName: string): CallbackEntry[] | undefined {
    return _callbacks[eventName] || undefined;
  }

  /**
   * Get a callback's index for the event.
   */
  private _getCallbackIndex(
    eventName: string,
    callback: <T>(...args: T[]) => void
  ): number {
    if (!this._has(eventName)) {
      return -1;
    }

    const cbs = this._getCallbacks(eventName)!;
    return cbs.findIndex((element) => element.callback === callback);
  }

  /**
   * Check if we have reached the maximum number of listeners for the event.
   */
  private _achieveMaxListener(eventName: string): boolean {
    const self = internal(this);
    return (
      self._maxListeners !== null &&
      self._maxListeners <= this.listenersNumber(eventName)!
    );
  }

  /**
   * Check if a callback already exists for the event.
   */
  private _callbackIsExists(
    eventName: string,
    callback: <T>(...args: T[]) => void,
    context: object | null
  ): boolean {
    const callbackInd = this._getCallbackIndex(eventName, callback);
    const activeCallback =
      callbackInd !== -1
        ? this._getCallbacks(eventName)![callbackInd]
        : undefined;

    return (
      callbackInd !== -1 &&
      activeCallback !== undefined &&
      activeCallback.context === context
    );
  }

  /**
   * Check if the event exists.
   */
  private _has(eventName: string): boolean {
    return internal(this)._events.has(eventName);
  }

  /**
   * Add the listener.
   */
  on(
    eventName: string,
    callback: <T>(...args: T[]) => void,
    context: object | null = null,
    weight: number = 1
  ): this {
    const self = internal(this);

    if (typeof callback !== 'function') {
      throw new TypeError(`${callback} is not a function`);
    }

    if (!this._has(eventName)) {
      self._events.add(eventName);
      _callbacks[eventName] = [];
    } else {
      if (this._achieveMaxListener(eventName)) {
        self._console.warn(
          `Max listeners (${self._maxListeners}) for event "${eventName}" is reached!`
        );
      }

      if (this._callbackIsExists(eventName, callback, context)) {
        self._console.warn(
          `Event "${eventName}" already has the callback ${callback}.`
        );
      }
    }

    this._addCallback(eventName, callback, context, weight);
    return this;
  }

  /**
   * Add the listener which will be executed only once.
   */
  once(
    eventName: string,
    callback: <T>(...args: T[]) => void,
    context: object | null = null,
    weight: number = 1
  ): this {
    const onceCallback = <T>(...args: T[]) => {
      this.off(eventName, onceCallback);
      return callback.call(context, ...args);
    };

    return this.on(eventName, onceCallback, context, weight);
  }

  /**
   * Remove an event entirely or just a selected callback from the event.
   */
  off(eventName: string, callback?: <T>(...args: T[]) => void): this {
    const self = internal(this);

    if (this._has(eventName)) {
      if (typeof callback === 'undefined') {
        // Remove the event.
        self._events.delete(eventName);
        // Remove all listeners.
        _callbacks[eventName] = null;
      } else {
        const callbackInd = this._getCallbackIndex(eventName, callback);
        if (callbackInd !== -1) {
          this._getCallbacks(eventName)!.splice(callbackInd, 1);
          // Remove all equal callbacks.
          this.off(eventName, callback);
        }
      }
    }

    return this;
  }

  /**
   * Trigger the event.
   */
  emit<T>(eventName: string, ...args: T[]): this {
    const custom = _callbacks[eventName];
    let i = custom ? custom.length : 0;

    // Performance optimization by avoiding unnecessary array creation if no args are given
    const finalArgs = args.length > 0 ? args : undefined;

    while (i--) {
      const current = custom![i];
      if (finalArgs) {
        current.callback.call(current.context, ...finalArgs);
      } else {
        current.callback.call(current.context);
      }
    }

    return this;
  }

  /**
   * Clear all events and callback links.
   */
  clear(): this {
    internal(this)._events.clear();
    _callbacks = {};
    return this;
  }

  /**
   * Returns number of listeners for the event.
   */
  listenersNumber(eventName: string): number | null {
    return this._has(eventName) ? _callbacks[eventName]!.length : null;
  }
}
