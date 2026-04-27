import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Pabau polling — every 15 minutes per entity, staggered to spread API calls.
// Total cost: ~288 GETs/day across 3 endpoints, well under the daily budget.
crons.interval(
  "sync pabau reviews",
  { minutes: 15 },
  internal.pabauSync.syncReviewsCron,
);

crons.interval(
  "sync pabau services",
  { minutes: 15 },
  internal.pabauSync.syncServicesCron,
);

crons.interval(
  "sync pabau products",
  { minutes: 15 },
  internal.pabauSync.syncProductsCron,
);

export default crons;
