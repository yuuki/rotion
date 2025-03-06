import type { Breadcrumb } from './types.js';
export interface FetchBreadcrumbsProps {
    type: 'page_id' | 'database_id' | 'block_id' | 'workspace';
    id: string;
    limit?: number;
}
export declare const FetchBreadcrumbs: ({ type, id, limit }: FetchBreadcrumbsProps) => Promise<Breadcrumb[]>;
