import ApiClient from "./client.ts";

import v1MetricsApi from "./v1/metrics.ts";
import v1MonitorsApi from "./v1/monitors.ts";
import v1ServiceChecksApi from "./v1/service_checks.ts";
export {CheckStatus} from './v1/service_checks.ts';
import v1UsageMeteringApi from "./v1/usage_metering.ts";
import v1EventsApi from "./v1/events.ts";

import v2RolesApi from "./v2/roles.ts";
import v2UsersApi from "./v2/users.ts";

// subset of Deno.env
interface EnvGetter {
  get(key: string): string | undefined;
};

export default class DatadogApi extends ApiClient {
  static fromEnvironment(env: EnvGetter): DatadogApi {
    const apiKey = env.get("DATADOG_API_KEY") || env.get("DD_API_KEY");
    const appKey = env.get("DATADOG_APP_KEY") || env.get("DD_APP_KEY");
    if (!apiKey) throw new Error(
      `Export DATADOG_API_KEY (and probably DATADOG_APP_KEY) to use Datadog`,
    );

    return new DatadogApi({
      apiKey, appKey,
      apiBase: env.get("DATADOG_HOST"),
    });
  }

  /**
   * Check if the API key (not the APP key) is valid.
   * If invalid, an error is thrown.
   */
  validateAccess(): Promise<{valid: true}> {
    return this.fetchJson({
      path: `/api/v1/validate`,
    }) as Promise<{valid: true}>;
  }

  /**
   * The metrics endpoint allows you to:
   * - Post metrics data so it can be graphed on Datadog’s dashboards
   * - Query metrics from any time period
   */
  get v1Metrics(): v1MetricsApi {
    return new v1MetricsApi(this);
  }

  /**
   * Monitors allow you to watch a metric or check that you care about,
   * notifying your team when some defined threshold is exceeded.
   */
  get v1Monitors(): v1MonitorsApi {
    return new v1MonitorsApi(this);
  }

  /**
   * The service check endpoint allows you to
   * post check statuses for use with monitors.
   * Service check messages are limited to 500 characters.
   * If a check is posted with a message containing more than 500 characters,
   * only the first 500 characters are displayed.
   */
  get v1ServiceChecks(): v1ServiceChecksApi {
    return new v1ServiceChecksApi(this);
  }

  /**
   * The events API allows you to post events to Datadog.
   * Event titles are limited to 100 characters.
   * Event text are limited to 4000 characters.
   */
  get v1Events(): v1EventsApi {
    return new v1EventsApi(this);
  }

  /**
   * The usage metering API allows you to get hourly, daily, and monthly usage
   * across multiple facets of Datadog.
   * This API is available to all Pro and Enterprise customers.
   * Usage is only accessible for parent-level organizations.
   *
   * Note: Usage data is delayed by up to 72 hours from when it was incurred.
   * It is retained for the past 15 months.
   */
  get v1UsageMetering(): v1UsageMeteringApi {
    return new v1UsageMeteringApi(this);
  }

  /**
   * The Roles API is used to create and manage Datadog roles,
   * what global permissions they grant, and which users belong to them.
   * Permissions related to specific account assets can be
   * granted to roles in the Datadog application without using this API.
   * For example, granting read access on a specific log index to a role
   * can be done in Datadog from the Pipelines page.
   */
  get v2Roles(): v2RolesApi {
    return new v2RolesApi(this);
  }

  /** Create, edit, and disable users. */
  get v2Users(): v2UsersApi {
    return new v2UsersApi(this);
  }
}
