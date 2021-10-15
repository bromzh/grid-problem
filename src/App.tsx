import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { calculateCellSize, generateGrid } from './utils/grid';
import { CellsCount } from './CellsCount';
import { Color, ColorPicker } from './ColorPicker';
import { Grid } from './Grid';
import { GridSize } from './GridSize';
import { Cell, Row } from './utils/ui';

const COLORS: Color[] = [
  { mainColor: '#bca9e1', hoveredColor: '#8f74c4' },
  { mainColor: '#98a7f2', hoveredColor: '#4457b6' },
  { mainColor: '#a4c5ea', hoveredColor: '#5998e0' },
  { mainColor: '#9de19a', hoveredColor: '#63bb60' },
  { mainColor: '#e1e87c', hoveredColor: '#b1b66d' },
  { mainColor: '#eab625', hoveredColor: '#9d7f20' },
  { mainColor: '#ee845d', hoveredColor: '#d26841' },
  { mainColor: '#f6546a', hoveredColor: '#cb4b5c' },
];

/// App
function RawApp(props: { className?: string; }) {
  const [cellsCount, setCellsCount] = useState(12);
  const [gridSize, setGridSize] = useState(420);
  const [color, setColor] = useState(COLORS[0]);

  const size = useMemo(() => calculateCellSize(gridSize, cellsCount), [gridSize, cellsCount]);
  const grid = useMemo(() => generateGrid(cellsCount), [cellsCount]);

  const colors = useMemo(() => COLORS, []);

  return (
    <div className={ props.className }>
      <Row>
        <Cell>
          <GridSize value={ gridSize } onChange={ setGridSize }/>
        </Cell>
        <Cell>
          <CellsCount cellsCount={ cellsCount } onChange={ setCellsCount }/>
        </Cell>
        <Cell>
          <ColorPicker colors={ colors } onChange={ setColor } value={ color }/>
        </Cell>
      </Row>
      <Grid grid={ grid } cellSize={ size } color={ color }/>
    </div>
  );
}

export default styled(RawApp)`
  margin: 30px;
`;
