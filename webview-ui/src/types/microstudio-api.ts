/**
 * microstudio-api.d.ts
 *
 * Updated type definitions to include new requests and responses observed from the additional
 * WebSocket messages. In particular, we see a "write_project_file" request and response, and potentially
 * other unsolicited events related to achievements, user stats, etc.
 *
 * The HAR logs also show that "list_project_files" and "read_project_file" can return various file data,
 * and now we have a scenario where we upload/write a file.
 */
// -------------------------------------------------------------------------
// Request Names
// ------------------------------- ------------------------------------------
export declare type RequestName =
  | 'login'
  | 'token'
  | 'get_project_list'
  | 'get_public_plugins'
  | 'get_public_libraries'
  | 'get_build_status'
  | 'list_project_files'
  | 'read_project_file'
  | 'ping'
  | 'write_project_file'; // Newly observed request

// -------------------------------------------------------------------------
// Response Names
// -------------------------------------------------------------------------
export declare type ResponseName =
  | 'logged_in'
  | 'token_valid'
  | 'project_list'
  | 'public_plugins'
  | 'public_libraries'
  | 'build_project'
  | 'list_project_files'
  | 'read_project_file'
  | 'pong'
  | 'write_project_file' // New response for the write operation
  // Unsolicited events:
  | 'achievements'
  | 'user_stats';

export declare interface Response {
  name: ResponseName;
  request_id?: number;
  [key: string]: unknown;
}

// -------------------------------------------------------------------------
// Request Payload Interfaces
// -------------------------------------------------------------------------
export declare interface LoginRequest {
  name: 'login';
  nick: string;
  password: string;
  request_id: number;
}

export declare interface TokenRequest {
  name: 'token';
  token: string;
  request_id: number;
}

export declare interface GetProjectListRequest {
  name: 'get_project_list';
  request_id: number;
}

export declare interface GetPublicPluginsRequest {
  name: 'get_public_plugins';
  request_id: number;
}

export declare interface GetPublicLibrariesRequest {
  name: 'get_public_libraries';
  request_id: number;
}

export declare interface GetBuildStatusRequest {
  name: 'get_build_status';
  project: number;
  target: string;
  request_id: number;
}

export declare interface ListProjectFilesRequest {
  name: 'list_project_files';
  project: number;
  folder: string;
  request_id: number;
}

export declare interface ReadProjectFileRequest {
  name: 'read_project_file';
  project: number;
  file: string;
  request_id: number;
}

export declare interface PingRequest {
  name: 'ping';
  request_id: number;
}

export declare interface WriteProjectFileRequest {
  name: 'write_project_file';
  project: number;
  file: string;
  properties: Record<string, unknown>;
  content: string; // Base64 encoded content if image or binary
  request_id: number;
}

export declare type RequestPayload =
  | LoginRequest
  | TokenRequest
  | GetProjectListRequest
  | GetPublicPluginsRequest
  | GetPublicLibrariesRequest
  | GetBuildStatusRequest
  | ListProjectFilesRequest
  | ReadProjectFileRequest
  | PingRequest
  | WriteProjectFileRequest;

// -------------------------------------------------------------------------
// Common Data Structures in Responses
// -------------------------------------------------------------------------
export declare interface OwnerInfo {
  id: number;
  nick: string;
}

export declare interface Project {
  id: number;
  owner: OwnerInfo;
  title: string;
  slug: string;
  code: string;
  description: string;
  tags: string[];
  flags: Record<string, unknown>;
  poster: boolean;
  platforms: string[];
  controls: string[];
  type: string;
  orientation: string;
  aspect: string;
  graphics: string;
  language: string;
  libs: string[];
  properties: Record<string, unknown>;
  date_created: number;
  last_modified: number;
  public: boolean;
  size: number;
  users: OwnerInfo[];
}

export declare interface AchievementInfo {
  id: string;
  name: string;
  description: string;
  story: string;
  stat: string;
  value: number;
  xp: number;
}

export declare interface Achievement {
  id: string;
  date: number;
  info: AchievementInfo;
}

export declare interface UserInfo {
  size: number;
  early_access: boolean;
  max_storage: number;
  description: string;
  stats: {
    xp: number;
    level: number;
    time_drawing: number;
    time_coding: number;
    time_mapping: number;
    characters_typed: number;
    lines_of_code: number;
  };
  achievements: Achievement[];
}

// -------------------------------------------------------------------------
// Response Payload Interfaces
// -------------------------------------------------------------------------
export declare interface LoggedInResponse {
  name: 'logged_in';
  token: string;
  nick: string;
  email: string;
  flags: { validated: boolean };
  info: UserInfo;
  settings: {
    tutorial_progress: Record<string, number>;
    project_tutorial: Record<string, string>;
  };
  notifications?: any[];
  request_id: number;
}

export declare interface TokenValidResponse {
  name: 'token_valid';
  nick: string;
  email?: string;
  flags: { validated: boolean };
  info: UserInfo;
  settings: LoggedInResponse['settings'];
  notifications?: any[];
  request_id?: number;
}

export declare interface ProjectListResponse {
  name: 'project_list';
  list: Project[];
  request_id: number;
}

export declare interface PublicPlugin {
  id: number;
  title: string;
  description: string;
  poster: boolean;
  type: string;
  tags: string[];
  flags: Record<string, unknown>;
  slug: string;
  owner: string;
  owner_info?: any;
  likes: number;
  liked: boolean;
  date_published: number;
  last_modified: number;
  graphics: string;
  language: string;
  libs: any[];
  tabs?: Record<string, boolean>;
  plugins?: Record<string, unknown>;
  libraries?: Record<string, { active: boolean }>;
  networking?: boolean;
}

export declare interface PublicPluginsResponse {
  name: 'public_plugins';
  list: PublicPlugin[];
  request_id: number;
}

export declare interface PublicLibrary {
  id: number;
  title: string;
  description: string;
  poster: boolean;
  type: string;
  tags: string[];
  flags: Record<string, unknown>;
  slug: string;
  owner: string;
  owner_info?: any;
  likes: number;
  liked: boolean;
  date_published: number;
  last_modified: number;
  graphics: string;
  language: string;
  libs: any[];
  tabs?: Record<string, boolean>;
  plugins?: Record<string, unknown>;
  libraries?: Record<string, { active: boolean }>;
  networking?: boolean;
  properties?: any;
}

export declare interface PublicLibrariesResponse {
  name: 'public_libraries';
  list: PublicLibrary[];
  request_id: number;
}

export declare interface BuildProjectResponse {
  name: 'build_project';
  request_id: number;
  build: null | any;
  active_target: boolean;
}

export declare interface ListProjectFilesResponse {
  name: 'list_project_files';
  files: Array<{
    file: string;
    version: number;
    size: number;
    properties: Record<string, unknown>;
  }>;
  request_id: number;
}

export declare interface ReadProjectFileResponse {
  name: 'read_project_file';
  content: string;
  request_id: number;
}

export declare interface PongResponse {
  name: 'pong';
}

// New Response for write_project_file
export declare interface WriteProjectFileResponse {
  name: 'write_project_file';
  version: number;
  size: number;
  request_id: number;
}

// Additional Responses (unsolicited)
export declare interface AchievementsResponse {
  name: 'achievements';
  achievements: Achievement[];
}

export declare interface UserStatsResponse {
  name: 'user_stats';
  stats: {
    xp: number;
    level: number;
    time_drawing: number;
    time_coding: number;
    time_mapping: number;
    characters_typed: number;
    lines_of_code: number;
  };
}

// -------------------------------------------------------------------------
// Response Map
// -------------------------------------------------------------------------
export declare interface ResponseMap {
  login: LoggedInResponse;
  token: TokenValidResponse;
  get_project_list: ProjectListResponse;
  get_public_plugins: PublicPluginsResponse;
  get_public_libraries: PublicLibrariesResponse;
  get_build_status: BuildProjectResponse;
  list_project_files: ListProjectFilesResponse;
  read_project_file: ReadProjectFileResponse;
  ping: PongResponse;
  write_project_file: WriteProjectFileResponse;
  // Unsolicited events (not mapped to requests directly)
  achievements?: AchievementsResponse;
  user_stats?: UserStatsResponse;
}
