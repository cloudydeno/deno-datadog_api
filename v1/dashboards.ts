type TODO = unknown;

// Common API client contract
interface ApiClient {
  fetchJson(opts: {
    path: string,
    query?: URLSearchParams,
  }): Promise<unknown>;
}

/**
 * Interact with your dashboard lists through the API to make it easier
 * to organize, find, and share all of your dashboards with your team and organization.
 *
 * Official API docs: https://docs.datadoghq.com/api/latest/dashboards/
 */
export default class DatadogDashboardsApi {
  #api: ApiClient;
  constructor(api: ApiClient) {
    this.#api = api;
  }

  /**
   * Get all dashboards.
   * Note: This query will only return custom created or cloned dashboards.
   * This query will not return preset dashboards.
   */
  async listAll(opts: {
    filter?: {
      shared?: boolean;
    };
  } = {}): Promise<Array<DatadogDashboardListEntry>> {
    const qs = new URLSearchParams();
    if (opts.filter?.shared != null) qs.set("filter[shared]", `${opts.filter?.shared}`);
    const json = await this.#api.fetchJson({
      path: `/api/v1/dashboard`,
      query: qs,
    }) as {
      dashboards: Array<DatadogDashboardListEntry>;
    };
    return json.dashboards;
  }

  /**
   * Get a dashboard using the specified ID.
   * Note: The typings
   */
  async getOne(id: string): Promise<DatadogDashboard> {
    const json = await this.#api.fetchJson({
      path: `/api/v1/dashboard/${encodeURIComponent(id)}`,
    });
    return json as DatadogDashboard;
  }
}

export interface DatadogDashboardListEntry {
  author_handle: string;
  created_at: string; // date
  description: string;
  id: string;
  is_read_only: boolean;
  layout_type: "ordered" | "free";
  modified_at: string; // date
  title: string;
  url: string;
}


// FIXME: better dashboard types
// All these types were originally generated using https://app.quicktype.io/
//   and then mangled manually into looking reasonable.
// Presumably we should use Datadog's OpenAPI spec eventually

export interface DatadogDashboard {
  notify_list:                TODO[] | null;
  description:                null | string;
  restricted_roles:           string[];
  author_name:                null | string;
  template_variables:         {
    default:           string;
    prefix:            null | string;
    name:              string;
    available_values?: TODO[];
  }[] | null;
  is_read_only:               boolean;
  id:                         string;
  title:                      string;
  url:                        string;
  created_at:                 Date;
  modified_at:                Date;
  reflow_type?:               "auto" | "fixed";
  author_handle:              string;
  widgets:                    TopLevelWidget[];
  layout_type:                "free" | "ordered";
  template_variable_presets?: {
    template_variables: {
      name:  string;
      value: string;
    }[];
    name:               string;
  }[];
}

export interface TopLevelWidget {
  definition: PurpleDefinition;
  layout?:    Layout;
  id:         string;
}

interface PurpleDefinition {
  title?:               string;
  type:                 string;
  show_title?:          boolean;
  widgets?:             DefinitionWidget[];
  layout_type?:         "free" | "ordered";
  background_color?:    string;
  title_size?:          string;
  title_align?:         TextAlign;
  has_search_bar?:      "auto" | "fixed";
  requests?:            PurpleRequest[] | HostMapRequests;
  legend_columns?:      LegendColumn[];
  yaxis?:               Axis;
  markers?:             Marker[];
  legend_layout?:       LegendLayout;
  show_legend?:         boolean;
  legend_size?:         string;
  color?:               string;
  text?:                string;
  font_size?:           string;
  text_align?:          TextAlign;
  tick_pos?:            string;
  show_tick?:           boolean;
  tick_edge?:           TickEdge;
  content?:             string;
  autoscale?:           boolean;
  custom_unit?:         string;
  precision?:           number;
  vertical_align?:      TickEdge;
  has_padding?:         boolean;
  style?:               PurpleStyle;
  node_type?:           string;
  no_metric_hosts?:     boolean;
  group?:               string[] | string;
  no_group_hosts?:      boolean;
  scope?:               string[];
  sort?:                DefinitionSort;
  show_date_column?:    boolean;
  message_display?:     string;
  indexes?:             TODO[];
  show_message_column?: boolean;
  query?:               string;
  columns?:             string[];
  time?:                Time;
  xaxis?:               Xaxis;
  tags?:                string[];
  group_by?:            GroupBy[];
  check?:               string;
  grouping?:            string;
  custom_links?:        TODO[];
  span_name?:           string;
  service?:             string;
  size_format?:         string;
  show_hits?:           boolean;
  show_latency?:        boolean;
  show_errors?:         boolean;
  show_breakdown?:      boolean;
  env?:                 string;
  show_distribution?:   boolean;
  display_format?:      string;
  show_resource_list?:  boolean;
  filters?:             string[];
  viz_type?:            string;
  alert_id?:            string;
  url?:                 string;
  sizing?:              string;
  tags_execution?:      string;
  event_size?:          string;
  events?:              Event[];
}

interface Event {
  q:              string;
  tags_execution: string;
}

type LegendColumn =
| "avg"
| "last"
| "max"
| "min"
| "sum"
| "value"
;

type LegendLayout =
| "auto"
| "horizontal"
| "vertical"
;

interface Marker {
  display_type: string;
  value:        string;
  label?:       string;
}

interface PurpleRequest {
  aggregator?:          LegendColumn;
  cell_display_mode?:   string[];
  q?:                   string;
  alias?:               string;
  limit?:               number;
  order?:               string;
  formulas?:            Formula[];
  style?:               RequestStyle;
  display_type?:        string;
  response_format?:     string;
  queries?:             PurpleQuery[];
  on_right_yaxis?:      boolean;
  metadata?:            Metadatum[];
  conditional_formats?: ConditionalFormat[];
  log_query?:           LogQuery;
  apm_query?:           ApmQuery;
  query?:               FluffyQuery;
  request_type?:        string;
  order_by?:            string;
  order_dir?:           string;
  compare_to?:          string;
  increase_good?:       boolean;
  change_type?:         string;
}

interface ApmQuery {
  index:    string;
  search:   Search;
  group_by: GroupBy[];
  compute:  Compute;
}

interface Search {
  query: string;
}

interface ConditionalFormat {
  palette:          string;
  value:            number;
  comparator:       string;
  custom_fg_color?: string;
  custom_bg_color?: string;
}

interface Formula {
  formula: string;
  alias?:  string;
  limit?:  Limit;
}

interface Limit {
  count: number;
  order: string;
}

interface LogQuery {
  index:    string;
  search:   Search;
  group_by: GroupBy[];
  compute:  Compute;
}

interface GroupBy {
  facet: string;
  sort:  AggregatedSort;
  limit: number;
}

interface AggregatedSort {
  facet?:      string;
  order:       string;
  aggregation: string;
}

interface Metadatum {
  alias_name: string;
  expression: string;
}

interface PurpleQuery {
  query?:      string;
  data_source: string;
  name:        string;
  aggregator?: LegendColumn;
  search?:     Search;
  compute?:    Compute;
  indexes?:    string[];
  group_by?:   GroupBy[];
}

interface FluffyQuery {
  query_string: string;
  data_source:  string;
  steps:        Step[];
}

interface Step {
  facet: string;
  value: string;
}

interface RequestStyle {
  line_width?: LineWidth;
  palette:     StylePalette;
  line_type?:  LineType;
}

type LineType =
| "dashed"
| "dotted"
| "solid"
;

type LineWidth =
| "normal"
| "thick"
| "thin"
;

type StylePalette =
| "blue"
| "cool"
| "dog_classic"
| "green"
| "grey"
| "orange"
| "purple"
| "red"
| "warm"
;

interface HostMapRequests {
  size?: Fill;
  fill?:  Fill;
}

interface Fill {
  q: string;
}

interface DefinitionSort {
  column: string;
  order:  string;
}

interface PurpleStyle {
  palette:      string;
  palette_flip: boolean;
}

type TextAlign =
| "center"
| "left"
| "right"
;

type TickEdge =
| "bottom"
| "left"
| "right"
| "top"
;

interface Time {
  live_span?: string;
}

interface DefinitionWidget {
  definition: FluffyDefinition;
  layout?:    Layout;
  id:         string;
}

interface FluffyDefinition {
  title_size?:          string;
  title?:               string;
  title_align?:         TextAlign;
  custom_unit?:         string;
  precision?:           number;
  requests?:            FluffyRequest[] | FluffyRequests;
  type:                 string;
  legend_columns?:      LegendColumn[];
  yaxis?:               Axis;
  markers?:             Marker[];
  legend_layout?:       LegendLayout;
  show_legend?:         boolean;
  time?:                Time;
  style?:               FluffyStyle;
  group?:               string[];
  node_type?:           string;
  no_metric_hosts?:     boolean;
  scope?:               string[];
  no_group_hosts?:      boolean;
  color_by_groups?:     string[];
  xaxis?:               Axis;
  legend_size?:         string;
  autoscale?:           boolean;
  group_by?:            GroupBy[];
  check?:               string;
  tags?:                string[];
  grouping?:            string;
  sort?:                DefinitionSort;
  show_date_column?:    boolean;
  message_display?:     string;
  indexes?:             TODO[];
  show_message_column?: boolean;
  query?:               string;
  columns?:             string[];
  time_windows?:        string[];
  show_error_budget?:   boolean;
  view_type?:           string;
  slo_id?:              string;
  view_mode?:           string;
  global_time_target?:  string;
  tick_pos?:            string;
  show_tick?:           boolean;
  tick_edge?:           TextAlign;
  text_align?:          TextAlign;
  content?:             string;
  font_size?:           string;
  background_color?:    string;
}

interface FluffyRequest {
  formulas?:            Formula[];
  response_format?:     string;
  queries?:             TentacledQuery[];
  conditional_formats?: ConditionalFormat[];
  style?:               RequestStyle;
  on_right_yaxis?:      boolean;
  display_type?:        string;
  q?:                   string;
  metadata?:            Metadatum[];
  aggregator?:          LegendColumn;
  alias?:               string;
  limit?:               number;
  order?:               string;
  rum_query?:           RumQuery;
  log_query?:           LogQuery;
}

interface TentacledQuery {
  query?:      string;
  data_source: string;
  name:        string;
  aggregator?: LegendColumn;
  search?:     Search;
  compute?:    Compute;
  indexes?:    string[];
  group_by?:   GroupBy[];
}

interface Compute {
  facet?:      string;
  aggregation: string;
  metric?:     string;
  interval?:   number;
}

interface RumQuery {
  search:   Search;
  group_by: GroupBy[];
  compute:  Compute;
}

interface FluffyRequests {
  fill?: Fill;
  y?:    X;
  x?:    X;
}

interface X {
  q:          string;
  aggregator: LegendColumn;
}

interface FluffyStyle {
  palette:      string;
  palette_flip: boolean;
  fill_max?:    string;
}

interface Axis {
  include_zero?: boolean;
  max?:          string;
  scale?:        Scale;
  min?:          string;
  label?:        string;
}

type Scale =
| "linear"
| "log"
| "sqrt"
;

interface Layout {
  y:                number;
  x:                number;
  height:           number;
  width:            number;
  is_column_break?: boolean;
}

interface Xaxis {
  max: string;
}
