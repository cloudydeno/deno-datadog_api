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

// Set up an API client using DATADOG_API_KEY and such
const datadog = DatadogApi.fromEnvironment(Deno.env);

// Perform a monitor search by tag
const {monitors} = await datadog.v1Monitors.search('env:"prod"');
console.log("First monitor:", monitors[0]);

// Or, directly fetch JSON (for using APIs that don't have functions yet)
const dashboardLists = await datadog.fetchJson({
  path: '/api/v2/dashboard/lists/manual',
});
```

You can also import specific parts of this module by
starting with `client.ts` and adding specific APIs from `v1/`.
This lets you skip downloading APIs you don't use.

```typescript
// Assemble an API client manually
import ApiClient from "https://deno.land/x/datadog_api/client.ts";
const datadog = new ApiClient({
  apiKey: Deno.env.get("DATADOG_API_KEY"),
  appKey: Deno.env.get("DATADOG_APP_KEY"),
  apiBase: Deno.env.get("DATADOG_HOST"), // defaults to US server
});

// Set up a Monitors API client
import V1MonitorsApi from "https://deno.land/x/datadog_api/v1/monitors.ts";
const monitorsApi = new V1MonitorsApi(datadog);

// Get a monitor
console.log(await monitorsApi.getOne("234231"));
```

## License

MIT License
