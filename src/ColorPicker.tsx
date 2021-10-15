import styled from 'styled-components';
import React from 'react';
import { StyledComponentProps } from './utils/types';

type ColorPickerCallback = (color: Color) => void;

export interface Color {
  mainColor: string;
  hoveredColor: string;
}

export interface ColorPickerItemProps {
  color: Color;
  onClick: ColorPickerCallback;
}

const RawColorPickerItem = ({ color, onClick, className }: ColorPickerItemProps & StyledComponentProps) => {
  return <div className={ className } onClick={ e => onClick(color) }/>;
};

export const ColorPickerItem = styled(RawColorPickerItem)`
  width: 16px;
  height: 16px;
  display: inline-block;
  background: ${ props => props.color.mainColor };
`;

export interface ColorPickerProps {
  colors: Color[];
  value: Color;
  onChange: ColorPickerCallback;
}

const RawColorPicker = ({ className, colors, onChange }: ColorPickerProps & StyledComponentProps) => {
  return <div className={ className }>
    { colors.map(color => <ColorPickerItem color={ color } onClick={ onChange }/>) }
  </div>;
};

export const ColorPicker = styled(RawColorPicker)`
  display: flex;
  width: 64px;
  flex-wrap: wrap;
`;
