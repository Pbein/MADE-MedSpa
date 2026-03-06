/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bookings from "../bookings.js";
import type * as cartItems from "../cartItems.js";
import type * as contactSubmissions from "../contactSubmissions.js";
import type * as faqs from "../faqs.js";
import type * as members from "../members.js";
import type * as membershipTiers from "../membershipTiers.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as siteContent from "../siteContent.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  bookings: typeof bookings;
  cartItems: typeof cartItems;
  contactSubmissions: typeof contactSubmissions;
  faqs: typeof faqs;
  members: typeof members;
  membershipTiers: typeof membershipTiers;
  newsletter: typeof newsletter;
  orders: typeof orders;
  products: typeof products;
  seed: typeof seed;
  services: typeof services;
  siteContent: typeof siteContent;
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
