# `/x/datadog_api`: Deno library for Datadog

Very incomplete Typescript client
for [Datadog's API](https://docs.datadoghq.com/api/v1/).

## Purpose

My primary goal is to give the Datadog API a typed interface
for use in Deno scripts.
I'm comparing API docs with actual API payloads as much as possible.
If you just want to make calls and get JSON back,
you can use the `datadog.fetchJson(path: string, opts)` method.

PS: This library doesn't really depend on Deno APIs,
it's just targetting Deno as a runtime (Typescript, URL imports, fetch, etc).

### Implemented APIs

* `monitors`: get by id, get all, search by query
* `usageMetering`: get billable summary

If you want a different API,
please open a Github issue or PR into the `v1/` folder.

### Planned APIs

* `metrics`: Submitting data points

## Usage

Importing `mod.ts` gives you the whole implemented API surface.

```typescript
import DatadogApi from "https://deno.land/x/datadog_api/mod.ts";

// Set up an API client
const datadog = new DatadogApi({
  apiKey: Deno.env.get("DD_CLIENT_API_KEY"),
  appKey: Deno.env.get("DD_CLIENT_APP_KEY"),
  apiBase: Deno.env.get("DD_CLIENT_BASE_URL"), // defaults to US server
});

// Perform a monitor search by tag
const {monitors} = await datadog.v1Monitors.search('env:"prod"');
console.log("First monitor:", monitors[0]);
```

You could also import `client.ts` as well as a specific API from `v1/` to be more lean.

```typescript
import ApiClient from "https://deno.land/x/datadog_api/client.ts";
import V1MonitorsApi from "https://deno.land/x/datadog_api/v1/monitors.ts";

// Set up a Monitors API client
const api = new ApiClient(myCredentials);
const monitorsApi = new V1MonitorsApi(api);

// Get a monitor
console.log(await monitorsApi.getOne("234231"));

```

## License

MIT License
