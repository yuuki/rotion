import React from 'react';
import type { HandlerProps } from './PageHandler.types';
export declare const blockType: {
    heading_1: string;
    heading_2: string;
    heading_3: string;
    bulleted_list_item: string;
    numbered_list_item: string;
    divider: string;
    paragraph: string;
    code: string;
    quote: string;
};
export declare const PageHandler: ({ block, href, link, query, breadcrumb_hrefs }: HandlerProps) => React.JSX.Element;
export default PageHandler;
