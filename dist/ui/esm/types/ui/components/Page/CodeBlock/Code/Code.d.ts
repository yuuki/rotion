import React from 'react';
import type { CodeProps } from './Code.types';
import './Code.css';
import 'prismjs/plugins/autoloader/prism-autoloader';
declare const Code: ({ children, language }: CodeProps) => React.JSX.Element;
export default Code;
