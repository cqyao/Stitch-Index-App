/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/..\components\AppointmentCard` | `/..\components\CoursesPagination` | `/..\components\PatientInfo` | `/..\components\Slider` | `/..\components\SliderData` | `/..\components\SliderItem` | `/..\components\data` | `/PatientDetails` | `/_sitemap` | `/appointment` | `/calendar` | `/courseContents` | `/courses` | `/createCourse` | `/createpost` | `/dashboard` | `/patient` | `/post` | `/research` | `/search` | `/seeall` | `/signIn` | `/signup`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
