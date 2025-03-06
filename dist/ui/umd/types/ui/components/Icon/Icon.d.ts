import React from 'react';
import './Icon.css';
export interface IconProps {
    name: 'figma' | 'slack' | 'github' | 'file' | 'link' | 'codemerge' | 'circlecheck' | 'circledot' | 'downloadfile';
    width?: string;
    height?: string;
    className?: string;
}
declare const Icon: ({ name, width, height, className }: IconProps) => React.JSX.Element;
export default Icon;
