import styled from 'styled-components';
import React from 'react';
import { NumberChangeCallback, StyledComponentProps } from './types';

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const Cell = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

export interface SliderWidgetProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: NumberChangeCallback;
  label: string;
}

const RawSliderWidget = (props: SliderWidgetProps & StyledComponentProps) => {
  return <div className={ props.className }>
    <div>{ props.label }: { props.value }</div>
    <div>
      <input type={ 'range' }
             value={ props.value }
             onChange={ e => props.onChange(parseInt(e.target.value)) }
             step={ props.step }
             min={ props.min }
             max={ props.max }/>
    </div>
  </div>;
};

export const SliderWidget = styled(RawSliderWidget)`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
