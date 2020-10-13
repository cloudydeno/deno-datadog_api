type TODO = unknown;

export interface ResultPage<T> {
  meta: {
    page: {
      total_filtered_count: number;
      total_count: number;
    };
  };
  data: Array<T>;
}

export interface Included {
  included: Array<Role | Permission | User | Organization>;
}

export type Ref<T extends string> = {
  id: string;
  type: T;
}


export interface Role {
  type: "roles";
  id: string;
  attributes: {
    name: string;
    created_at: string; // iso date

    modified_at: string;
    user_count?: number;
  };
  relationships: {
    permissions: {
      data: Array<Ref<"permissions">>;
    };
  };
}

export type UserStatus = "Active" | "Pending" | "Disabled";
export interface User {
  type: "users";
  id: string;
  attributes: {
    name: string;
    created_at: string; // iso date

    handle: string;
    email: string;
    icon: string;
    title: string | null;
    verified: boolean;
    disabled: boolean;
    allowed_login_methods: TODO[];
    status: UserStatus;
  };
  relationships: {
    roles: {
      data: Array<Ref<"roles">>;
    };
    org: {
      data: Ref<"orgs">;
    };
    other_orgs?: {
      data: Array<Ref<"orgs">>;
    };
    other_users?: {
      data: Array<Ref<"users">>;
    };
  };
}

export interface Permission {
  type: "permissions";
  id: string;
  attributes: {
    name: string;
    created: string; // iso date

    display_name: string;
    description: string;
    group_name: string;
    display_type: "read" | "write" | "other";
    restricted: boolean;
  };
}

export interface Organization {
  type: "orgs";
  id: string;
  attributes: {
    name: string;
    created_at: string; // iso date

    modified_at: string; // iso date
    public_id: string;
    description: string | null;
    sharing: string;
    url: string | null;
    disabled: boolean;
  };
}

export interface UserInvitation {
  type: "user_invitations";
  id: string;
  attributes: {
    created_at: string; // iso date

    expires_at: string; // iso date
    invite_type: string;
    uuid: string;
  };
}
