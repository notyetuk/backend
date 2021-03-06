/**
 * *INSERT FLASHING WARNING LIGHTS*
 *
 * THIS FILE IS AUTOMATICALLY GENERATED
 * DO NOT EDIT IT, YOUR CHANGES WILL BE OVER-WRITTEN ON BUILD.
 */
import { ResponseContract } from "@envuso/core/Contracts/Routing/Context/Response/ResponseContract";

import { ApplicationRouteAttributeObject } from "./Meta/ApplicationRouteMeta";

import { ConfigHelperKeys } from "./Meta/Configuration";

declare module "@envuso/core/Routing" {
    declare function redirect(): RedirectResponseContract;
    declare function view(templatePath: string, data?: any): ResponseContract;
    declare interface RedirectResponseContract {
        view(templatePath: string, data?: any): ResponseContract;
        route<T extends keyof ApplicationRouteAttributeObject>(routeStr: T, attributes?: Partial<ApplicationRouteAttributeObject[T]>): RedirectResponseContract;
        route<T extends string>(routeStr: T, attributes?: any): RedirectResponseContract;
    }
}

declare module "@envuso/core/AppContainer" {
    declare interface ConfigRepositoryContract {
        get<T extends keyof ConfigHelperKeys, R extends ConfigHelperKeys[T]>(key: T, _default?: any): R;
        get<T extends string, R extends any>(key: T, _default?: any): R;
        file<T extends keyof ConfigHelperKeys, R extends ConfigHelperKeys[T]>(file: T, _default?: any): R;
        file<T extends string, R extends any>(key: T, _default?: any): R;
        set<T extends keyof ConfigHelperKeys>(key: T, value: any): void;
        set(key: string, value: any): void;
        put<T extends keyof ConfigHelperKeys>(key: T, value: any): void;
        put(key: string, value: any): void;
        has<T extends keyof ConfigHelperKeys>(key: T): boolean;
        has(key: string): boolean;
    }
    declare function config(): ConfigRepositoryContract;
    declare function config<T extends keyof ConfigHelperKeys>(key: T): ConfigHelperKeys[T];
    declare function config<T extends any>(key: string): any;
}