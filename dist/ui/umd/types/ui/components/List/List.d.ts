import React from 'react';
import type { ListProps } from './List.types';
import '../tokens.css';
import './List.css';
export interface ListHeaderProps {
    keys: string[];
}
declare const List: ({ keys, db, options }: ListProps) => React.JSX.Element;
export default List;
