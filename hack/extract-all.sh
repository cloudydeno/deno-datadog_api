#!/bin/sh -eux

hack_dir="$(dirname "$0")"

"$hack_dir"/extract-models.ts Dashboard DashboardSummary > v1/models/dashboards.ts
# "$hack_dir"/extract-models.ts Monitor MonitorSearchResponse > v1/models/monitors.ts
