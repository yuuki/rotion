import React, { ReactNode } from 'react';
import { QueryDatabaseResponse, PageObjectResponse, GetPagePropertyResponse, DatabaseObjectResponse, TextRichTextItemResponse, MentionRichTextItemResponse, GetSelfResponse, EquationRichTextItemResponse, ListBlockChildrenResponse, ParagraphBlockObjectResponse, Heading1BlockObjectResponse, Heading2BlockObjectResponse, Heading3BlockObjectResponse, BulletedListItemBlockObjectResponse, NumberedListItemBlockObjectResponse, QuoteBlockObjectResponse, ToDoBlockObjectResponse, ToggleBlockObjectResponse, TemplateBlockObjectResponse, SyncedBlockBlockObjectResponse, ChildPageBlockObjectResponse, ChildDatabaseBlockObjectResponse, EquationBlockObjectResponse, CodeBlockObjectResponse, CalloutBlockObjectResponse, RichTextItemResponse, DividerBlockObjectResponse, BreadcrumbBlockObjectResponse, TableOfContentsBlockObjectResponse, ColumnListBlockObjectResponse, ColumnBlockObjectResponse, LinkToPageBlockObjectResponse, TableBlockObjectResponse, TableRowBlockObjectResponse, EmbedBlockObjectResponse, BookmarkBlockObjectResponse, ImageBlockObjectResponse, VideoBlockObjectResponse, PdfBlockObjectResponse, FileBlockObjectResponse, AudioBlockObjectResponse, LinkPreviewBlockObjectResponse, UnsupportedBlockObjectResponse, GetPageResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { ParsedUrlQueryInput } from 'node:querystring';
import { UrlObject } from 'node:url';

interface LinkPreviewGithubRepo {
    name: string;
    login: string;
    avatar_url: string;
    avatar_src: string;
    updated_at: string;
}
interface LinkPreviewGithubIssue {
    title: string;
    login: string;
    avatar_url: string;
    avatar_src: string;
    created_at: string;
    closed_at: string | null;
    merged_at: string | null;
    state: 'open' | 'closed' | 'merged';
    number: number;
}

type IdRequest = string | string;
type TextRequest = string;
type StringRequest = string;
type EmojiRequest = string;
type TimeZoneRequest = string;
type DateResponse = {
    start: string;
    end: string | null;
    time_zone: TimeZoneRequest | null;
};
type SelectColor = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
type SelectColorWithBG = SelectColor | 'gray_background' | 'brown_background' | 'orange_background' | 'yellow_background' | 'green_background' | 'blue_background' | 'purple_background' | 'pink_background' | 'red_background';
type SelectPropertyResponse = {
    id: StringRequest;
    name: StringRequest;
    color: SelectColor;
};
type UserObjectResponse = GetSelfResponse;
type PartialUserObjectResponse = {
    id: IdRequest;
    object: 'user';
} | UserObjectResponse;
type BulletedListItemBlockObjectResponseEx = BulletedListItemBlockObjectResponse & {
    children?: ListBlockChildrenResponseEx;
};
type NumberedListItemBlockObjectResponseEx = NumberedListItemBlockObjectResponse & {
    children?: ListBlockChildrenResponseEx;
};
type TableBlockObjectResponseEx = TableBlockObjectResponse & {
    children: ListBlockChildrenResponseEx;
};
type ToggleBlockObjectResponseEx = ToggleBlockObjectResponse & {
    children: ListBlockChildrenResponseEx;
};
type ColumnListBlockObjectResponseEx = ColumnListBlockObjectResponse & {
    children: ListBlockChildrenResponseEx;
    columns: Array<ListBlockChildrenResponseEx>;
};
type ChildPageBlockObjectResponseEx = ChildPageBlockObjectResponse & {
    children: ListBlockChildrenResponseEx;
    page: GetPageResponseEx;
};
type ChildDatabaseBlockObjectResponseEx = ChildDatabaseBlockObjectResponse & {
    database: GetDatabaseResponseEx;
};
type BookmarkBlockObjectResponseEx = BookmarkBlockObjectResponse & {
    bookmark: {
        url: string;
        caption: Array<RichTextItemResponse>;
        site: HtmlMetadata;
    };
};
type CalloutBlockObjectResponseEx = CalloutBlockObjectResponse & {
    callout: {
        rich_text: Array<RichTextItemResponse>;
        color: SelectColorWithBG;
        icon: {
            type: 'emoji';
            emoji: EmojiRequest;
        } | {
            src: string;
            type: 'external';
            external: {
                url: TextRequest;
            };
        } | {
            src: string;
            type: 'file';
            file: {
                url: string;
                expiry_time: string;
            };
        };
    };
    children?: ListBlockChildrenResponseEx;
};
type ImageBlockObjectResponseEx = ImageBlockObjectResponse & {
    image: {
        type: 'external';
        external: {
            url: TextRequest;
        };
        caption: Array<RichTextItemResponse>;
        src: string;
        width?: number;
        height?: number;
    } | {
        type: 'file';
        file: {
            url: string;
            expiry_time: string;
        };
        caption: Array<RichTextItemResponse>;
        src: string;
        width?: number;
        height?: number;
    };
};
type VideoExternal = {
    type: 'external';
    external: {
        url: TextRequest;
    };
    caption: Array<RichTextItemResponse>;
    html: string;
};
type VideoFile = {
    type: 'file';
    file: {
        url: string;
        expiry_time: string;
    };
    caption: Array<RichTextItemResponse>;
    src: string;
    videoType: 'video/mp4' | 'video/webm' | 'video/ogg' | 'video/ogv' | '';
};
type VideoBlockObjectResponseEx = VideoBlockObjectResponse & {
    video: VideoExternal | VideoFile;
};
type EmbedBlockObjectResponseEx = EmbedBlockObjectResponse & {
    embed: {
        url: string;
        caption: Array<RichTextItemResponse>;
        html: string;
    };
};
type TemplateMentionDateTemplateMentionResponse = {
    type: "template_mention_date";
    template_mention_date: "today" | "now";
};
type TemplateMentionUserTemplateMentionResponse = {
    type: "template_mention_user";
    template_mention_user: "me";
};
type TemplateMentionResponse = TemplateMentionDateTemplateMentionResponse | TemplateMentionUserTemplateMentionResponse;
type LinkPreviewMentionResponse = {
    url: TextRequest;
};
type MentionEmoji = {
    type: 'emoji';
    emoji: string;
};
type MentionExternalOrFile = {
    type: 'external' | 'file';
    src: string;
    url: string;
};
type MentionIcon = MentionEmoji | MentionExternalOrFile;
type PageOrDatabaseMention = {
    id: IdRequest;
    name: string;
    icon: MentionIcon;
};
type MentionRichTextItemResponseEx = MentionRichTextItemResponse & {
    mention: {
        type: "user";
        user: PartialUserObjectResponse | UserObjectResponse;
    } | {
        type: "date";
        date: DateResponse;
    } | {
        type: "link_preview";
        link_preview: LinkPreviewMentionResponse;
    } | {
        type: "template_mention";
        template_mention: TemplateMentionResponse;
    } | {
        type: "page";
        page: PageOrDatabaseMention;
    } | {
        type: "database";
        database: PageOrDatabaseMention;
    };
};
type RichTextItemResponseEx = TextRichTextItemResponse | MentionRichTextItemResponseEx | EquationRichTextItemResponse;
type ParagraphBlockObjectResponseEx = ParagraphBlockObjectResponse & {
    paragraph: {
        rich_text: Array<RichTextItemResponseEx>;
        color: SelectColor;
    };
};
type Breadcrumb = {
    id: string;
    name: string;
    icon: MentionIcon;
};
type BreadcrumbBlockObjectResponseEx = BreadcrumbBlockObjectResponse & {
    list: Breadcrumb[];
};
type FileBlockObjectResponseEx = FileBlockObjectResponse & {
    file: {
        type: "external";
        external: {
            url: TextRequest;
        };
        caption: Array<RichTextItemResponse>;
        src: string;
        size: number;
    } | {
        type: 'file';
        file: {
            url: string;
            expiry_time: string;
        };
        caption: Array<RichTextItemResponse>;
        src: string;
        size: number;
    };
};
type PdfBlockObjectResponseEx = PdfBlockObjectResponse & {
    pdf: {
        type: "external";
        external: {
            url: TextRequest;
        };
        caption: Array<RichTextItemResponse>;
        src: string;
        size: number;
    } | {
        type: 'file';
        file: {
            url: string;
            expiry_time: string;
        };
        caption: Array<RichTextItemResponse>;
        src: string;
        size: number;
    };
};
type SyncedBlockBlockObjectResponseEx = SyncedBlockBlockObjectResponse & {
    children?: ListBlockChildrenResponseEx;
};
type BlockObjectResponse = ParagraphBlockObjectResponseEx | Heading1BlockObjectResponse | Heading2BlockObjectResponse | Heading3BlockObjectResponse | BulletedListItemBlockObjectResponseEx | NumberedListItemBlockObjectResponseEx | QuoteBlockObjectResponse | ToDoBlockObjectResponse | ToggleBlockObjectResponseEx | TemplateBlockObjectResponse | SyncedBlockBlockObjectResponseEx | ChildPageBlockObjectResponseEx | ChildDatabaseBlockObjectResponseEx | EquationBlockObjectResponse | CodeBlockObjectResponse | CalloutBlockObjectResponseEx | DividerBlockObjectResponse | BreadcrumbBlockObjectResponseEx | TableOfContentsBlockObjectResponse | ColumnListBlockObjectResponseEx | ColumnBlockObjectResponse | LinkToPageBlockObjectResponse | TableBlockObjectResponseEx | TableRowBlockObjectResponse | EmbedBlockObjectResponseEx | BookmarkBlockObjectResponseEx | ImageBlockObjectResponseEx | VideoBlockObjectResponseEx | PdfBlockObjectResponseEx | FileBlockObjectResponseEx | AudioBlockObjectResponse | LinkPreviewBlockObjectResponseEx | UnsupportedBlockObjectResponse;
type ListBlockChildrenResponseEx = ListBlockChildrenResponse & {
    results: Array<BlockObjectResponse>;
    children?: ListBlockChildrenResponse;
    last_edited_time?: string;
};
type LinkPreviewBlockObjectResponseEx = LinkPreviewBlockObjectResponse & {
    link_preview: {
        url: string;
        github?: {
            type: 'issue';
            issue: LinkPreviewGithubIssue;
        } | {
            type: 'repo';
            repo: LinkPreviewGithubRepo;
        };
        figma?: {
            html: string;
        };
    };
};
type GetPageResponseEx = PageObjectResponse & {
    cover: {
        src: string;
        type: 'external';
        external: {
            url: string;
            expiry_time: string;
        };
    } | {
        src: string;
        type: 'file';
        file: {
            url: string;
            expiry_time: string;
        };
    } | null;
    icon: {
        src: string;
        type: 'emoji';
        emoji: EmojiRequest;
    } | {
        src: string;
        type: 'external';
        external: {
            url: string;
            expiry_time: string;
        };
    } | {
        src: string;
        type: 'file';
        file: {
            url: string;
            expiry_time: string;
        };
    } | null;
    meta?: GetPagePropertyResponse;
};
type PageObjectResponseEx = PageObjectResponse & {
    property_items: Array<GetPagePropertyResponse>;
    cover: {
        src: string;
        type: 'external';
        external: {
            url: TextRequest;
        };
    } | {
        src: string;
        type: 'file';
        file: {
            url: string;
            expiry_time: string;
        };
    } | null;
    icon: {
        type: 'emoji';
        emoji: EmojiRequest;
    } | {
        src: string;
        type: 'external';
        external: {
            url: TextRequest;
        };
    } | {
        src: string;
        type: 'file';
        file: {
            url: string;
            expiry_time: string;
        };
    } | null;
};
type GetDatabaseResponseEx = DatabaseObjectResponse & {
    icon: {
        type: 'emoji';
        emoji: EmojiRequest;
    } | {
        src: string;
        type: 'external';
        external: {
            url: TextRequest;
        };
    } | {
        src: string;
        type: 'file';
        file: {
            url: string;
            expiry_time: string;
        };
    } | null;
    cover: {
        src: string;
        type: 'external';
        external: {
            url: TextRequest;
        };
    } | {
        src: string;
        type: 'file';
        file: {
            url: string;
            expiry_time: string;
        };
    } | null;
};
type QueryDatabaseResponseEx = QueryDatabaseResponse & {
    results: Array<PageObjectResponseEx>;
    meta: GetDatabaseResponseEx;
};
type HtmlMetadata = {
    title: string;
    desc: string;
    image: string;
    icon: string;
};

interface FetchDatabaseRes extends QueryDatabaseResponseEx {
}

interface Link extends React.FC<{
    children: string | React.ReactNode;
    className?: string;
    href: string | UrlObject;
}> {
}

interface GalleryPreviewOptions {
    preview?: 'cover' | 'content';
    size?: 'small' | 'medium' | 'large';
    fit?: boolean;
    height?: {
        small: string;
        medium: string;
        large: string;
    } | string;
}

interface GalleryProps {
    keys: string[];
    db: FetchDatabaseRes;
    options?: GalleryOptions;
}
interface GalleryOptions {
    href?: {
        [key: string]: string;
    };
    link?: Link;
    query?: ParsedUrlQueryInput;
    image?: GalleryPreviewOptions;
    prefix?: {
        [key: string]: string;
    };
    suffix?: {
        [key: string]: string;
    };
}

declare const Gallery: ({ keys, db, options }: GalleryProps) => React.JSX.Element;

interface GalleryCardProps {
    keys: string[];
    page: PageObjectResponseEx;
    options?: GalleryOptions;
}

declare const GalleryCard: ({ keys, page, options }: GalleryCardProps) => React.JSX.Element;

interface GalleryPropertyOptions {
    pathname?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
    prefix?: string;
    suffix?: string;
}

interface GalleryCheckboxFieldProps {
    checked: boolean;
    options?: GalleryPropertyOptions;
}

declare const GalleryCheckboxField: ({ checked, options }: GalleryCheckboxFieldProps) => React.JSX.Element;

interface GalleryDateFieldProps {
    date: DateResponse | null;
}

declare const GalleryDateField: ({ date }: GalleryDateFieldProps) => React.JSX.Element;

interface GalleryMultiSelectFieldProps {
    multiSelect: SelectPropertyResponse[];
    options?: GalleryPropertyOptions;
}

declare const GalleryMultiSelectField$1: ({ multiSelect, options }: GalleryMultiSelectFieldProps) => React.JSX.Element;

interface GallerySelectFieldProps {
    select: SelectPropertyResponse;
    options?: GalleryPropertyOptions;
}

declare const GalleryMultiSelectField: ({ select, options }: GallerySelectFieldProps) => React.JSX.Element;

interface GalleryNumberFieldProps {
    number: number | null;
    options?: GalleryPropertyOptions;
}

declare const GalleryNumberField: ({ number, options }: GalleryNumberFieldProps) => React.JSX.Element;

interface GalleryRichTextFieldProps {
    textObjects: RichTextItemResponseEx[] | RichTextItemResponse[];
    size?: 'small' | 'medium' | 'large';
}

declare const GalleryRichTextField: ({ textObjects, size }: GalleryRichTextFieldProps) => React.JSX.Element;

interface GalleryTitleFieldProps {
    textObjects: RichTextItemResponseEx[] | RichTextItemResponse[];
}

declare const GalleryTitleField: ({ textObjects }: GalleryTitleFieldProps) => React.JSX.Element;

interface GalleryUrlFieldProps {
    url: string | null;
}

declare const GalleryUrlField: ({ url }: GalleryUrlFieldProps) => React.JSX.Element;

interface GalleryFormulaFieldProps {
    number: number | null;
    options?: GalleryPropertyOptions;
}

declare const GalleryFormulaField: ({ number, options }: GalleryFormulaFieldProps) => React.JSX.Element;

interface ListProps {
    keys: string[];
    db: QueryDatabaseResponseEx;
    children?: ReactNode;
    options?: ListOptions;
}
interface ListOptions {
    href?: {
        [key: string]: string;
    };
    link?: Link;
    query?: ParsedUrlQueryInput;
    suffix?: {
        [key: string]: string;
    };
    prefix?: {
        [key: string]: string;
    };
}

declare const List: ({ keys, db, options }: ListProps) => React.JSX.Element;

interface ListPropertyOptions {
    pathname?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
    suffix?: string;
    prefix?: string;
}

interface ListCheckboxFieldProps {
    checked: boolean;
    options?: ListPropertyOptions;
}

declare const ListCheckboxField: ({ checked, options }: ListCheckboxFieldProps) => React.JSX.Element;

interface ListDateFieldProps {
    date: DateResponse | null;
}

declare const ListDateField: ({ date }: ListDateFieldProps) => React.JSX.Element;

interface ListMultiSelectFieldProps {
    multiSelect: SelectPropertyResponse[];
    options?: ListPropertyOptions;
}

declare const ListMultiSelectField: ({ multiSelect, options }: ListMultiSelectFieldProps) => React.JSX.Element;

interface ListSelectFieldProps {
    select: SelectPropertyResponse;
    options?: ListPropertyOptions;
}

declare const ListSelectField: ({ select, options }: ListSelectFieldProps) => React.JSX.Element;

interface ListNumberFieldProps {
    number: number | null;
    options?: ListPropertyOptions;
}

declare const ListNumberField: ({ number, options }: ListNumberFieldProps) => React.JSX.Element;

interface ListRichTextFieldProps {
    textObjects: RichTextItemResponseEx[] | RichTextItemResponse[];
}

declare const ListRichTextField: ({ textObjects }: ListRichTextFieldProps) => React.JSX.Element;

interface ListTitleFieldProps {
    textObjects: RichTextItemResponseEx[] | RichTextItemResponse[];
    options?: ListPropertyOptions;
}

declare const ListTitleField: ({ textObjects, options }: ListTitleFieldProps) => React.JSX.Element;

interface ListUrlFieldProps {
    url: string | null;
}

declare const ListUrlField: ({ url }: ListUrlFieldProps) => React.JSX.Element;

interface ListFormulaFieldProps {
    number: number | null;
    options?: ListPropertyOptions;
}

declare const ListFormulaField: ({ number, options }: ListFormulaFieldProps) => React.JSX.Element;

interface TableProps {
    keys: string[];
    db: QueryDatabaseResponseEx;
    children?: ReactNode;
    options?: TableOptions;
}
interface TableOptions {
    href?: {
        [key: string]: string;
    };
    link?: Link;
    query?: ParsedUrlQueryInput;
    prefix?: {
        [key: string]: string;
    };
    suffix?: {
        [key: string]: string;
    };
    verticalLines?: boolean;
}

declare const Table: ({ keys, db, options }: TableProps) => React.JSX.Element;

interface TablePropertyOptions {
    pathname?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
    suffix?: string;
    prefix?: string;
}

interface TableCheckboxFieldProps {
    checked: boolean;
    options?: TablePropertyOptions;
}

declare const TableCheckboxField: ({ checked, options }: TableCheckboxFieldProps) => React.JSX.Element;

interface TableDateFieldProps {
    date: DateResponse | null;
}

declare const TableDateField: ({ date }: TableDateFieldProps) => React.JSX.Element;

interface TableIconProps {
    type: string;
    className?: string;
}

declare const TableIcon: ({ type, className }: TableIconProps) => React.JSX.Element;

interface TableMultiSelectFieldProps {
    multiSelect: SelectPropertyResponse[];
    options?: TablePropertyOptions;
}

declare const TableMultiSelectField: ({ multiSelect, options }: TableMultiSelectFieldProps) => React.JSX.Element;

interface TableNumberFieldProps {
    number: number | null;
    options?: TablePropertyOptions;
}

declare const TableNumberField: ({ number, options }: TableNumberFieldProps) => React.JSX.Element;

interface TableRichTextFieldProps {
    textObjects: RichTextItemResponseEx[] | RichTextItemResponse[];
}

declare const TableRichTextField: ({ textObjects }: TableRichTextFieldProps) => React.JSX.Element;

interface TableSelectFieldProps {
    select: SelectPropertyResponse;
    options?: TablePropertyOptions;
}

declare const TableSelectField: ({ select, options }: TableSelectFieldProps) => React.JSX.Element;

interface TableTitleFieldProps {
    textObjects: RichTextItemResponseEx[] | RichTextItemResponse[];
    options?: TablePropertyOptions;
}

declare const TableTitleField: ({ textObjects, options }: TableTitleFieldProps) => React.JSX.Element;

interface TableUrlFieldProps {
    url: string | null;
}

declare const TableUrlField: ({ url }: TableUrlFieldProps) => React.JSX.Element;

interface TableFormulaFieldProps {
    number: number | null;
    options?: TablePropertyOptions;
}

declare const TableFormulaField: ({ number, options }: TableFormulaFieldProps) => React.JSX.Element;

interface PageProps {
    blocks: ListBlockChildrenResponseEx;
    href?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
    breadcrumb_hrefs?: string[];
}

declare const Page: ({ blocks, href, link, query, breadcrumb_hrefs }: PageProps) => React.JSX.Element;

interface BookmarkBlockProps {
    block: BookmarkBlockObjectResponseEx;
}

declare const BookmarkBlock: ({ block }: BookmarkBlockProps) => React.JSX.Element;

interface BreadcrumbBlockProps {
    block: BreadcrumbBlockObjectResponseEx;
    link?: Link;
    hrefs?: string[];
    query?: ParsedUrlQueryInput;
}

declare const BreadcrumbBlock: ({ block, link, hrefs, query }: BreadcrumbBlockProps) => React.JSX.Element;

interface BreadcrumbsProps {
    list: Breadcrumb[];
    link?: Link;
    hrefs?: string[];
    query?: ParsedUrlQueryInput;
}

declare const Breadcrumbs: ({ list, link, hrefs, query }: BreadcrumbsProps) => React.JSX.Element;

interface BulletedListBlockProps {
    block: BulletedListItemBlockObjectResponseEx;
    href?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
}

declare const BulletedListBlock: ({ block, href, link, query }: BulletedListBlockProps) => React.JSX.Element;

interface CalloutBlockProps {
    block: CalloutBlockObjectResponseEx;
    href?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
}

declare const CalloutBlock: ({ block, href, link, query }: CalloutBlockProps) => React.JSX.Element;

interface ChildDatabaseBlockProps {
    block: ChildDatabaseBlockObjectResponseEx;
    href?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
}

declare const ChildDatabaseBlock: ({ block, href, link, query }: ChildDatabaseBlockProps) => React.JSX.Element;

interface ChildPageBlockProps {
    block: ChildPageBlockObjectResponseEx;
    href?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
}

declare const ChildPageBlock: ({ block, href, link, query }: ChildPageBlockProps) => React.JSX.Element;

interface CodeBlockProps {
    block: CodeBlockObjectResponse;
}

declare const CodeBlock: ({ block }: CodeBlockProps) => React.JSX.Element;

interface ColumnListBlockProps {
    block: ColumnListBlockObjectResponseEx;
    href?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
}

declare const ColumnListBlock: ({ block, href, link, query }: ColumnListBlockProps) => React.JSX.Element;

interface EmbedBlockProps {
    block: EmbedBlockObjectResponseEx;
}

declare const EmbedBlock: ({ block }: EmbedBlockProps) => React.JSX.Element;

interface EquationBlockProps {
    block: EquationBlockObjectResponse;
}

declare const EquationBlock: ({ block }: EquationBlockProps) => React.JSX.Element;

interface FileBlockProps {
    block: FileBlockObjectResponseEx;
}

declare const FileBlock: ({ block }: FileBlockProps) => React.JSX.Element;

interface ImageBlockProps {
    block: ImageBlockObjectResponseEx;
}

declare const ImageBlock: ({ block }: ImageBlockProps) => React.JSX.Element;

type LinkPreviewBlockProps = {
    block: LinkPreviewBlockObjectResponseEx;
};

declare const LinkPreviewBlock: ({ block }: LinkPreviewBlockProps) => React.JSX.Element;

interface NumberedListBlockProps {
    block: NumberedListItemBlockObjectResponseEx;
    href?: string;
    link?: Link;
    query?: ParsedUrlQueryInput;
}

declare const NumberedListBlock: ({ block, href, link, query }: NumberedListBlockProps) => React.JSX.Element;

interface PdfBlockProps {
    block: PdfBlockObjectResponseEx;
}

declare const PdfBlock: ({ block }: PdfBlockProps) => React.JSX.Element;

interface SyncedBlockProps {
    block: SyncedBlockBlockObjectResponseEx;
}

declare const SyncedBlock: ({ block }: SyncedBlockProps) => React.JSX.Element;

interface TableBlockProps {
    block: TableBlockObjectResponseEx;
}

declare const TableBlock: React.FC<TableBlockProps>;

interface TableOfContentsBlockProps {
    block: TableOfContentsBlockObjectResponse;
}

declare const TableOfContentsBlock: ({ block }: TableOfContentsBlockProps) => React.JSX.Element;

interface TextBlockProps {
    tag: keyof JSX.IntrinsicElements;
    block: ParagraphBlockObjectResponseEx | Heading1BlockObjectResponse | Heading2BlockObjectResponse | Heading3BlockObjectResponse | QuoteBlockObjectResponse | DividerBlockObjectResponse;
}

declare const TextBlock: ({ tag, block }: TextBlockProps) => React.JSX.Element;

type ToDoBlockProps = {
    block: ToDoBlockObjectResponse;
};

declare const ToDoBlock: ({ block }: ToDoBlockProps) => React.JSX.Element;

interface ToggleBlockProps {
    block: ToggleBlockObjectResponseEx;
}

declare const ToggleBlock: ({ block }: ToggleBlockProps) => React.JSX.Element;

interface VideoBlockProps {
    block: VideoBlockObjectResponseEx;
}

declare const VideoBlock: ({ block }: VideoBlockProps) => React.JSX.Element;

interface IconProps {
    name: 'figma' | 'slack' | 'github' | 'file' | 'link' | 'codemerge' | 'circlecheck' | 'circledot' | 'downloadfile';
    width?: string;
    height?: string;
    className?: string;
}
declare const Icon: ({ name, width, height, className }: IconProps) => React.JSX.Element;

interface RichTextProps {
    textObject?: RichTextItemResponseEx | RichTextItemResponse;
    key?: string;
    children?: ReactNode;
}

declare const RichText: ({ textObject }: RichTextProps) => React.JSX.Element;

interface PrefixSuffixProps {
    prefix?: string;
    suffix?: string;
    children?: ReactNode;
}

declare const PrefixSuffix: ({ prefix, suffix, children }: PrefixSuffixProps) => React.JSX.Element;

declare const Checkbox: ({ bool }: {
    bool: boolean;
}) => React.JSX.Element;

declare function queryToString(q: ParsedUrlQueryInput | undefined): string;
declare const getLinkPathAndLinkKey: (link: string) => [string, string];
declare function getSlug(key: string, page: GetPageResponse): string;
declare function UsePagination<T>(pages: T[], perPage: number): {
    currentData(): T[];
    next(): void;
    currentPage: number;
    maxPage: number;
};
declare function BuildPlainTextByPage(blocks: ListBlockChildrenResponseEx): string;
declare function pathBasename(str: string): string;
declare function getDatetimeFormat(lang?: string): {
    dateF: string;
    timeF: string;
};
declare function splitUrl(url: string): {
    domain: string;
    omittedPath: string;
};

export { BookmarkBlock, BreadcrumbBlock, Breadcrumbs, BuildPlainTextByPage, BulletedListBlock, CalloutBlock, Checkbox, ChildDatabaseBlock, ChildPageBlock, CodeBlock, ColumnListBlock, EmbedBlock, EquationBlock, FileBlock, Gallery, GalleryCard, GalleryCheckboxField, GalleryDateField, GalleryFormulaField, GalleryMultiSelectField$1 as GalleryMultiSelectField, GalleryNumberField, GalleryRichTextField, GalleryMultiSelectField as GallerySelectField, GalleryTitleField, GalleryUrlField, Icon, ImageBlock, type Link, LinkPreviewBlock, List, ListCheckboxField, ListDateField, ListFormulaField, ListMultiSelectField, ListNumberField, ListRichTextField, ListSelectField, ListTitleField, ListUrlField, NumberedListBlock, Page, PdfBlock, PrefixSuffix, RichText, SyncedBlock, Table, TableBlock, TableCheckboxField, TableDateField, TableFormulaField, TableIcon, TableMultiSelectField, TableNumberField, TableOfContentsBlock, TableRichTextField, TableSelectField, TableTitleField, TableUrlField, TextBlock, ToDoBlock, ToggleBlock, UsePagination, VideoBlock, getDatetimeFormat, getLinkPathAndLinkKey, getSlug, pathBasename, queryToString, splitUrl };
