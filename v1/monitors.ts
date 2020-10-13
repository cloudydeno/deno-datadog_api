type TODO = unknown;

interface ApiClient {
  fetchJson(url: string, data?: unknown): Promise<unknown>;
}

export default class DatadogMonitorsApi {
  #api: ApiClient;
  constructor(api: ApiClient) {
    this.#api = api;
  }

  async getAll(): Promise<Array<DatadogMonitor>> {
    const json = await this.#api.fetchJson(`/api/v1/monitor`);
    return json as Array<DatadogMonitor>;
  }

  async getOne(id: string): Promise<DatadogMonitor> {
    const json = await this.#api.fetchJson(
      `/api/v1/monitor/${encodeURIComponent(id)}`,
    );
    return json as DatadogMonitor;
  }

  async search(query: string, opts: {
    page?: number;
    per_page?: number;
    sort?: {
      field: "name" | "status" | "tags" | string;
      order: "asc" | "desc";
    };
  } = {}): Promise<DatadogMonitorSearchResult> {
    const params = new URLSearchParams([["query", query]]);
    if (opts.page != null) params.set("page", `${opts.page}`);
    if (opts.per_page != null) params.set("per_page", `${opts.per_page}`);
    if (opts.sort != null) {
      params.set("sort", `${opts.sort.field},${opts.sort.order}`);
    }
    const json = await this.#api.fetchJson(
      `/api/v1/monitor/search?` + params.toString(),
    );
    return json as DatadogMonitorSearchResult;
  }
}

interface UserRef {
  id?: string; // observed
  email?: string;
  handle: string;
  name: string;
}

type SearchCountFacet<T> = Array<{ count: number; name: T }>;

interface DatadogMonitorSearchResult {
  monitors: Array<{
    status: MonitorStatus;
    scopes: string[];
    classification: MonitorClassification;
    creator: UserRef;
    overall_state_modified: number;
    metrics: string[];
    notifications: UserRef[];
    last_triggered_ts: number | null;
    query: string;
    id: string;
    name: string;
    tags: string[];
    org_id: string;
    restricted_roles: TODO[];
    type: MonitorType;
  }>;
  counts: {
    status: SearchCountFacet<string>;
    muted: SearchCountFacet<boolean>;
    tag: SearchCountFacet<string>;
    type: SearchCountFacet<string>;
  };
  metadata: {
    page: number;
    page_count: number;
    per_page: number;
    total_count: number;
  };
}

interface DatadogMonitor {
  // observed
  created_at: number;
  restricted_roles: null;
  overall_state_modified: string; // date

  // from docs
  created: string; // date
  creator: UserRef;
  deleted: string | null; // date
  id: string;
  message: string;
  modified: string; // date
  multi: boolean;
  name: string;
  options: {
    aggregation?: {
      group_by: string;
      metric: string;
      type: string;
    };
    device_ids?: string[];
    enable_logs_sample?: boolean;
    escalation_message: string;
    evaluation_delay?: number;
    include_tags: boolean;
    locked: boolean;
    min_failure_duration?: number;
    min_location_failed?: number;
    new_host_delay: number;
    no_data_timeframe: number | null;
    notify_audit: boolean;
    notify_no_data: boolean;
    renotify_interval: number;
    require_full_window: boolean;
    silenced: { [key: string]: number };
    synthetics_check_id?: string;
    threshold_windows?: {
      recovery_window: string;
      trigger_window: string;
    };
    thresholds: {
      critical: number;
      critical_recovery?: number;
      ok?: number;
      unknown?: number;
      warning?: number;
      warning_recovery?: number;
    };
    timeout_h: number;
  };
  overall_state: MonitorStatus;
  query: string;
  state?: {
    groups: {
      [key: string]: {
        last_nodata_ts: number;
        last_notified_ts: number;
        last_resolved_ts: number;
        last_triggered_ts: number;
        name: string;
        status: MonitorStatus;
      };
    };
  };
  tags: string[];
  type: MonitorType;
}

export type MonitorClassification =
  | "anomaly"
  | "apm"
  | "custom"
  | "forecast"
  | "integration"
  | "log"
  | "metric"
  | string;

export type MonitorStatus =
  | "Alert"
  | "Ignored"
  | "No Data"
  | "OK"
  | "Skipped"
  | "Unknown"
  | "Warn";

export type MonitorType =
  | "composite"
  | "event alert"
  | "log alert"
  | "metric alert"
  | "process alert"
  | "query alert"
  | "rum alert"
  | "service check"
  | "synthetics alert"
  | "trace-analytics alert"
  | "slo alert"
  | string;
