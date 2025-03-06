import type { QueryDatabaseParameters, QueryDatabaseResponseEx, GetDatabaseResponseEx } from './types.js';
export interface FetchDatabaseArgs extends QueryDatabaseParameters {
}
export interface FetchDatabaseRes extends QueryDatabaseResponseEx {
}
/**
 * FetchDatabase retrieves database and download images in from blocks.
 * And create cache that includes filepath of downloaded images.
 */
export declare const FetchDatabase: (params: FetchDatabaseArgs) => Promise<FetchDatabaseRes>;
export declare function saveDatabaseCover(db: GetDatabaseResponseEx): Promise<void>;
export declare function saveDatabaseIcon(db: GetDatabaseResponseEx): Promise<void>;
