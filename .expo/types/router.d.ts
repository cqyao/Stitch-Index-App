/* eslint-disable */
import * as Router from 'expo-router';

export namespace ExpoRouter {
  type StaticRoutes = `/` | `/_sitemap` | `/dashboard` | `/signup`;
  type DynamicRoutes<T extends string> = never;
  type DynamicRouteTemplate = never;

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/calendar` | `/dashboard` | `/signup`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
