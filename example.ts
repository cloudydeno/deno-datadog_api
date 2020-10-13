import DatadogApi from "./mod.ts";

// Set up an API client
const datadog = new DatadogApi({
  apiKey: Deno.env.get("DD_CLIENT_API_KEY") ?? "",
  appKey: Deno.env.get("DD_CLIENT_APP_KEY"),
  apiBase: Deno.env.get("DD_CLIENT_BASE_URL"),
});

// Perform a monitor search by tag
const results = await datadog.v1Monitors
  .search('NOT tag:"terraformed"', {
    per_page: 1,
  });
console.log("First monitor:", results.monitors[0]);
console.log("Monitor facets:", results.counts);

// Pull billing summary for a given month
const { usage: [usage] } = await datadog.v1UsageMetering
  .getBillableSummary("2020-09");
console.log(usage);
