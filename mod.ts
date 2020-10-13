import ApiClient from "./client.ts";

import v1MonitorsApi from "./v1/monitors.ts";
import v1UsageMeteringApi from "./v1/usage_metering.ts";

export default class DatadogApi extends ApiClient {
  get v1Monitors(): v1MonitorsApi {
    return new v1MonitorsApi(this);
  }

  get v1UsageMetering(): v1UsageMeteringApi {
    return new v1UsageMeteringApi(this);
  }
}
