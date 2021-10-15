import React from 'react';
import { NumberChangeCallback } from './utils/types';
import { SliderWidget } from './utils/ui';

export interface GridSizeProps {
  onChange: NumberChangeCallback;
  value: number;
}

export const GridSize = ({ onChange, value }: GridSizeProps) => {
  return <SliderWidget onChange={ onChange } value={ value } min={ 200 } max={ 800 } step={ 20 }
                       label={ 'Grid size' }/>;
};
