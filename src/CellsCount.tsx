import React from 'react';
import { NumberChangeCallback } from './utils/types';
import { SliderWidget } from './utils/ui';

export interface CellsCountProps {
  cellsCount: number;
  onChange: NumberChangeCallback;
}

export const CellsCount = ({ cellsCount, onChange }: CellsCountProps) => {
  return <SliderWidget onChange={ onChange } min={ 2 } max={ 20 } step={ 1 } value={ cellsCount } label={ 'Size' }/>;
};
