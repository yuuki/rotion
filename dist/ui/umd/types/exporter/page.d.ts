import type { GetPageResponseEx, PageObjectResponseEx } from './types.js';
export interface FetchPageArgs {
    page_id: string;
    last_edited_time?: string;
}
export interface FetchPageRes extends GetPageResponseEx {
}
/**
 * FetchPage retrieves page properties and download images in from properties.
 * And create cache that includes filepath of downloaded images.
 * The last_edited_time of 2nd args is for ROTION_INCREMENTAL_CACHE.
 */
export declare const FetchPage: ({ page_id, last_edited_time }: FetchPageArgs) => Promise<FetchPageRes>;
export declare function savePageCover(page: GetPageResponseEx | PageObjectResponseEx): Promise<void>;
export declare function savePageIcon(page: GetPageResponseEx | PageObjectResponseEx): Promise<void>;
