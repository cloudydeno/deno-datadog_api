#!/usr/bin/env -S deno run --allow-env --allow-net

import DatadogApi from "../mod.ts";
const datadogApi = DatadogApi.fromEnvironment(Deno.env);

// This example looks at all monitors using any APM trace metrics,
// and prints links to those which are not scoped to an APM environment.

let count = 0;
// Search for relevant monitors via a metric filter
for await (const monitor of datadogApi.v1Monitors.searchToEnd("metric:trace*")) {

  // Skip monitors that have a scoped environment set
  if (!monitor.query.includes('env:production')) continue;
  if (!monitor.query.includes('env:sandbox')) continue;

  // Print the monitor URL for further manual inspection
  console.log(`https://app.datadoghq.eu/monitors/${monitor.id}`);
  count++;
}
// Print number of matched monitors as a summary
console.log({count})
