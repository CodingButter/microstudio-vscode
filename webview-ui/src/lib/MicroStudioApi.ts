/**
 * microstudioClient.ts
 *
 * With the addition of the "write_project_file" request and response, we must:
 * - Add an entry to requestResponseMap.json: "write_project_file": "write_project_file"
 *
 * Beyond that, no changes are strictly necessary to microstudioClient.ts because it
 * already generically handles request/response pairs based on the name from requestResponseMap.json.
 *
 * However, if we want to handle unsolicited events like "achievements" and "user_stats",
 * we can listen for those events and emit them. This is optional and depends on your use case.
 */
import {
  type Project,
  type ProjectListResponse,
  type RequestName,
  type ResponseName,
  type Response,
  type TokenValidResponse,
  LoggedInResponse,
} from '../types/microstudio-api';
import EventEmitter from './EventEmitter';

const requestResponseMap = {
  login: 'logged_in',
  token: 'token_valid',
  get_project_list: 'project_list',
  get_public_plugins: 'public_plugins',
  get_public_libraries: 'public_libraries',
  get_build_status: 'build_status',
  list_project_files: 'project_files',
  read_project_file: 'read_project_file',
  ping: 'pong',
  write_project_file: 'write_project_file',
};

export default class MicroStudioClient extends EventEmitter {
  private wss_url = 'wss://microstudio.dev/ws';
  private requestIdCounter = 0;
  private ws!: WebSocket;
  private token?: string;
  private nick: string;
  private password: string;

  constructor(
    nick: string,
    password: string,
    token?: string,
    wss_url?: string
  ) {
    super();
    this.nick = nick;
    this.password = password;
    this.token = token;
    this.wss_url = wss_url || this.wss_url;
  }

  static async connect(
    nick: string,
    password: string,
    token?: string,
    wss_url?: string
  ): Promise<MicroStudioClient> {
    const client = new MicroStudioClient(nick, password, token, wss_url);
    await client.connect();
    return client;
  }

  private getExpectedResponseName(name: RequestName): ResponseName {
    const responseName: ResponseName = (
      requestResponseMap as Record<string, string>
    )[name] as ResponseName;
    if (!responseName) {
      throw new Error(`No response mapping found for request name: ${name}`);
    }
    return responseName;
  }
  private onMessage(message: { name: string; [key: string]: any }): void {
    this.emit(message.name, message);
  }

  private async begin(): Promise<void> {
    if (this.token) {
      try {
        const tokenResponse: TokenValidResponse =
          await this.call<TokenValidResponse>('token', {
            token: this.token,
          });
        if (!tokenResponse.flags?.validated) {
          await this.loginWithCredentials();
        }
        return;
      } catch {
        await this.loginWithCredentials();
      }
    } else {
      await this.loginWithCredentials();
    }
  }

  private async loginWithCredentials(): Promise<void> {
    const loggedInRes = await this.call<LoggedInResponse>('login', {
      nick: this.nick,
      password: this.password,
    }).catch((err: Error) => {
      throw new Error(`Login failed: ${err.message}`);
    });

    if (!loggedInRes.token) {
      throw new Error('Login failed: no token returned by server.');
    }

    this.token = loggedInRes.token;
  }

  public async connect(): Promise<void> {
    const headers: Record<string, string> = {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'accept-language': 'en-US,en;q=0.9',
      'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits',
      'sec-websocket-version': '13',
    };

    if (this.token) {
      headers['cookie'] = `token=${this.token}`;
    }

    this.ws = new WebSocket(this.wss_url);
    // this.ws = new WebSocket(this.wss_url, { headers });

    await new Promise<void>((resolve, reject) => {
      this.ws.addEventListener('open', () => resolve());
      this.ws.addEventListener('error', (err) =>
        reject(new Error(`WebSocket connection error: ${String(err)}`))
      );
    });

    this.ws.addEventListener('message', ({ data }) => {
      try {
        const msg = JSON.parse(data);
        this.onMessage(msg);
      } catch (parseError) {
        console.error('Received invalid JSON message from server:', parseError);
      }
    });

    await this.begin();
  }

  public call<T>(
    name: RequestName,
    data?: Record<string, unknown>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState !== WebSocket.OPEN) {
        return reject(new Error('WebSocket is not open. Cannot send request.'));
      }

      const request_id = ++this.requestIdCounter;
      const responseEventName = this.getExpectedResponseName(name);

      const timeoutHandle: number = setTimeout(() => {
        //@ts-expect-error - TS doesn't know about clearTimeout
        this.off(responseEventName, onResponse);
        reject(
          new Error(
            `Request '${name}' timed out after 30 seconds without a response.`
          )
        );
      }, 30000);
      const onResponse = <T extends Response>(response: T) => {
        const isPongForPing =
          responseEventName === 'pong' && response.name === 'pong';

        if (response.name == 'token_valid' || isPongForPing || response.token) {
          if (timeoutHandle) clearTimeout(timeoutHandle);
          //@ts-expect-error - TS doesn't know about clearTimeout
          this.off(responseEventName, onResponse);
          //@ts-expect-error - TS doesn't know about clearTimeout
          resolve(response);
        }
      };
      //@ts-expect-error - TS doesn't know about clearTimeout
      this.on(responseEventName, onResponse);

      const requestMessage = { name, ...(data || {}), request_id };

      try {
        this.ws.send(JSON.stringify(requestMessage));
      } catch (sendError) {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        //@ts-expect-error - TS doesn't know about clearTimeout
        this.off(responseEventName, onResponse);
        reject(
          new Error(`Failed to send request '${name}': ${String(sendError)}`)
        );
      }
    });
  }

  public async getProjects(): Promise<Project[]> {
    const response: ProjectListResponse = await this.call<ProjectListResponse>(
      'get_project_list'
    );
    return response.list;
  }

  public getToken(): string {
    return this.token || '';
  }
  public getNick(): string {
    return this.nick;
  }
}
