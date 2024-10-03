/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/CreatePost` | `/_sitemap` | `/appointment` | `/calendar` | `/courses` | `/createpost` | `/dashboard` | `/patient` | `/post` | `/research` | `/search` | `/signIn` | `/signup`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
