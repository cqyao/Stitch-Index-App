/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/PatientDetails` | `/_sitemap` | `/appointment` | `/calendar` | `/courseContents` | `/courses` | `/createCourse` | `/createpost` | `/dashboard` | `/patient` | `/post` | `/research` | `/search` | `/seeall` | `/signIn` | `/signout` | `/signup`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
