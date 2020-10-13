import type {
  ResultPage, Included,
  Role, User, Permission,
} from "./lib/identity.ts";

type TODO = unknown;

// Common API client contract
interface ApiClient {
  fetchJson(opts: {
    path: string,
    query?: URLSearchParams,
  }): Promise<unknown>;
}

export default class DatadogRolesApi {
  #api: ApiClient;
  constructor(api: ApiClient) {
    this.#api = api;
  }

  /** Returns all roles, including their names and IDs. */
  async listRoles(): Promise<ResultPage<Role>> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/roles`,
    });
    return json as ResultPage<Role>;
  }

  /** Get a role in the organization specified by the role’s role_id. */
  async getRole(roleId: string): Promise<{data: Role}> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/roles/${encodeURIComponent(roleId)}`,
    });
    return json as {data: Role};
  }

  /** Gets all users of a role. */
  async getRoleUsers(roleId: string): Promise<ResultPage<User> & Included> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/roles/${encodeURIComponent(roleId)}/users`,
    });
    return json as ResultPage<User> & Included;
  }

  /** Returns a list of all permissions for a single role. */
  async getRolePermissions(roleId: string): Promise<{data: Array<Permission>}> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/roles/${encodeURIComponent(roleId)}/permissions`,
    });
    return json as {data: Array<Permission>};
  }

  /** Returns a list of all permissions, including name, description, and ID.  */
  async listAllPermissions(roleId: string): Promise<{data: Array<Permission>}> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/permissions`,
    });
    return json as {data: Array<Permission>};
  }

}
