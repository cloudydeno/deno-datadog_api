type TODO = unknown;

interface ApiClient {
  fetchJson(url: string, data?: unknown): Promise<unknown>;
}

export default class DatadogUsageMeteringApi {
  #api: ApiClient;
  constructor(api: ApiClient) {
    this.#api = api;
  }

  async getSummary(opts: {
    startMonth: string;
    endMonth?: string;
    includeOrgDetails?: boolean;
  }): Promise<TODO> {
    const params = new URLSearchParams([["start_month", opts.startMonth]]);
    if (opts.endMonth != null) params.set("end_month", `${opts.endMonth}`);
    if (opts.includeOrgDetails != null) {
      params.set("include_org_details", `${opts.includeOrgDetails}`);
    }
    return await this.#api.fetchJson(
      `/api/v1/usage/summary?` + params.toString(),
    );
  }

  async getBillableSummary(month: string): Promise<BillableSummaryList> {
    const params = new URLSearchParams([["month", month]]);
    const json = await this.#api.fetchJson(
      `/api/v1/usage/billable-summary?` + params.toString(),
    );
    return json as BillableSummaryList;
  }
}

export type BillableSummaryList = {
  usage: BillableSummary[];
};

export interface BillableSummary {
  org_name: string;
  billing_plan: "Pro" | string;
  public_id: string;
  end_date: string;
  ratio_in_month: number;
  num_orgs: number;
  calc_date: string;
  usage: Record<BillableSummaryCategories, BillableSummaryUsage>;
  start_date: string;
}

export interface BillableSummaryUsage {
  org_billable_usage: number;
  usage_unit: UsageUnit;
  account_billable_usage: number;
  first_billable_usage_hour: string;
  elapsed_usage_hours: number;
  last_billable_usage_hour: string;
  percentage_in_account: number;
}

export type BillableSummaryCategories =
  | "infra_host_top99p"
  | "lambda_function_average"
  | "timeseries_average"
  | "logs_ingested_sum"
  | "apm_trace_search_sum"
  | "infra_container_sum"
  | "apm_host_top99p"
  | "logs_indexed_sum"
  | "siem_sum"
  | string;

export type UsageUnit =
  | "gib"
  | "hosts"
  | "functions"
  | "timeseries"
  | "traces"
  | "container_hours"
  | "logs"
  | string;
