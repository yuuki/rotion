import type { ListBlockChildrenResponseEx } from './types.js';
export interface FetchBlocksArgs {
    block_id: string;
    last_edited_time?: string;
}
export interface FetchBlocksRes extends ListBlockChildrenResponseEx {
}
/**
 * FetchBlocks retrieves page blocks and download images in from blocks.
 * And create cache that includes filepath of downloaded images.
 * The last_edited_time of 2nd args is for ROTION_INCREMENTAL_CACHE.
 */
export declare const FetchBlocks: ({ block_id, last_edited_time }: FetchBlocksArgs) => Promise<FetchBlocksRes>;
