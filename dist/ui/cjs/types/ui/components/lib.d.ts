import type { ParsedUrlQueryInput } from 'node:querystring';
import type { ListBlockChildrenResponseEx, GetPageResponse } from '../../exporter';
export declare function queryToString(q: ParsedUrlQueryInput | undefined): string;
export declare const getLinkPathAndLinkKey: (link: string) => [string, string];
export declare function getSlug(key: string, page: GetPageResponse): string;
export declare function UsePagination<T>(pages: T[], perPage: number): {
    currentData(): T[];
    next(): void;
    currentPage: number;
    maxPage: number;
};
export declare function BuildPlainTextByPage(blocks: ListBlockChildrenResponseEx): string;
export declare function pathBasename(str: string): string;
export declare function getDatetimeFormat(lang?: string): {
    dateF: string;
    timeF: string;
};
export declare function splitUrl(url: string): {
    domain: string;
    omittedPath: string;
};
