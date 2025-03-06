import React from 'react';
import type { TextLinkProps, LinkIfLinkedProps } from './LinkIfLinked.types';
import '../../tokens.css';
import './LinkIfLinked.css';
export declare const TextLink: ({ textObject, children }: TextLinkProps) => React.JSX.Element;
declare const LinkIfLinked: ({ condition, textObject, children }: LinkIfLinkedProps) => React.JSX.Element;
export default LinkIfLinked;
