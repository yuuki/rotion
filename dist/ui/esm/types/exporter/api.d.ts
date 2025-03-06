import { Client } from '@notionhq/client';
export declare const notion: Client;
export interface reqAPIWithBackoffArgs {
    func: Function;
    args: unknown;
    count: number;
}
export declare function reqAPIWithBackoff<T>({ func, args, count }: reqAPIWithBackoffArgs): Promise<T>;
export interface reqAPIWithBackoffAndCacheArgs {
    name: string;
    func: Function;
    args: unknown;
    count: number;
}
export declare function reqAPIWithBackoffAndCache<T>({ name, func, args, count }: reqAPIWithBackoffAndCacheArgs): Promise<T>;
export interface FetchOptions extends RequestInit {
    timeout?: number;
}
export declare function fetchWithTimeout(url: string | URL | Request, options?: FetchOptions): Promise<Response>;
