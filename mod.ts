import ApiClient from "./client.ts";

import v1MonitorsApi from "./v1/monitors.ts";
import v1UsageMeteringApi from "./v1/usage_metering.ts";

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

  get v1Monitors(): v1MonitorsApi {
    return new v1MonitorsApi(this);
  }

  get v1UsageMetering(): v1UsageMeteringApi {
    return new v1UsageMeteringApi(this);
  }
}
