import type {
  TeamsResultPage, TeamFields, TeamsIncluded, Team
} from "./lib/identity.ts";

type TODO = unknown;

// Common API client contract
interface ApiClient {
  fetchJson(opts: {
    path: string,
    query?: URLSearchParams,
  }): Promise<unknown>;
}

export default class DatadogTeamsApi {
  #api: ApiClient;
  constructor(api: ApiClient) {
    this.#api = api;
  }

  /**
   * Get the list of all users in the organization.
   * This list includes all users even if they are deactivated or unverified.
   */
  async listTeams(opts: {
    page?: number;
    per_page?: number;
    sort?: {
      field: "name" | "user_count";
      order?: "asc" | "desc";
    };
    filterKeyword?: string;
    filterMe?: boolean;
    fieldsTeam?: Array<TeamFields>;
  } = {}): Promise<TeamsResultPage<Team> & TeamsIncluded> {
    const qs = new URLSearchParams();
    if (opts.page != null) qs.set("page[number]", `${opts.page}`);
    if (opts.per_page != null) qs.set("page[size]", `${opts.per_page}`);
    if (opts.sort != null) qs.set("sort",
      `${opts.sort.order == 'desc' ? '-' : ''}${opts.sort.field}`);
    if (opts.filterKeyword != null) qs.set("filter[keyword]", `${opts.filterKeyword}`);
    if (opts.filterMe != null) qs.set("filter[me]", `${opts.filterMe}`);
    if (opts.fieldsTeam) qs.set("fields[team]", opts.fieldsTeam.join(','));

    const json = await this.#api.fetchJson({
      path: `/api/v2/team`,
      query: qs,
    });
    return json as TeamsResultPage<Team> & TeamsIncluded;
  }

  /** Get a team in the organization specified by the team’s team_id. */
  async getTeam(teamId: string): Promise<{data: Team}> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/team/${encodeURIComponent(userId)}`,
    });
    return json as {data: Team};
  }

  /** Get a list of members for a team */
  async getTeamMemberships(teamId: string): Promise<TeamsResultPage<TeamMembership>> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/team/${encodeURIComponent(teamId)}/memberships`,
    });
    return json as TeamsResultPage<TeamMembership>;
  }

  //TODO: Get links for a team, Get a team link, Get permission settings for a team:
  //https://docs.datadoghq.com/api/latest/teams/
  /** Returns the user information and all organizations joined by this user. */
  async getUserOrgs(userId: string): Promise<{data: User} & Included> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/users/${encodeURIComponent(userId)}/orgs`,
    });
    return json as {data: User} & Included;
  }

  /** Returns a list of the user’s permissions granted by the associated user’s roles. */
  async getUserPermissions(userId: string): Promise<{data: Array<Permission>}> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/users/${encodeURIComponent(userId)}/permissions`,
    });
    return json as {data: Array<Permission>};
  }

  /** Returns a single user invitation by its UUID. */
  async getUserInvitation(uuid: string): Promise<{data: UserInvitation}> {
    const json = await this.#api.fetchJson({
      path: `/api/v2/user_invitations/${encodeURIComponent(uuid)}`,
    });
    return json as {data: UserInvitation};
  }

}
