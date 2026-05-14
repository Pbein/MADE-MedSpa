/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as beforeAfter from "../beforeAfter.js";
import type * as contactSubmissions from "../contactSubmissions.js";
import type * as crons from "../crons.js";
import type * as data_nonBookableServices from "../data/nonBookableServices.js";
import type * as faqs from "../faqs.js";
import type * as lib_auth from "../lib/auth.js";
import type * as memberships from "../memberships.js";
import type * as pabauActivityLog from "../pabauActivityLog.js";
import type * as pabauApiUsage from "../pabauApiUsage.js";
import type * as pabauReviews from "../pabauReviews.js";
import type * as pabauSync from "../pabauSync.js";
import type * as pabauWebhookEvents from "../pabauWebhookEvents.js";
import type * as seed from "../seed.js";
import type * as serviceCategories from "../serviceCategories.js";
import type * as services from "../services.js";
import type * as shopProducts from "../shopProducts.js";
import type * as siteContent from "../siteContent.js";
import type * as teamMembers from "../teamMembers.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  beforeAfter: typeof beforeAfter;
  contactSubmissions: typeof contactSubmissions;
  crons: typeof crons;
  "data/nonBookableServices": typeof data_nonBookableServices;
  faqs: typeof faqs;
  "lib/auth": typeof lib_auth;
  memberships: typeof memberships;
  pabauActivityLog: typeof pabauActivityLog;
  pabauApiUsage: typeof pabauApiUsage;
  pabauReviews: typeof pabauReviews;
  pabauSync: typeof pabauSync;
  pabauWebhookEvents: typeof pabauWebhookEvents;
  seed: typeof seed;
  serviceCategories: typeof serviceCategories;
  services: typeof services;
  shopProducts: typeof shopProducts;
  siteContent: typeof siteContent;
  teamMembers: typeof teamMembers;
  testimonials: typeof testimonials;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
