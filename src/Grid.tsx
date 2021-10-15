import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Row } from './utils/ui';
import { Pair, StyledComponentProps, ZOGrid } from './utils/types';
import { emptyFunc, getBoundedCells } from './utils/grid';
import { Color } from './ColorPicker';

export interface CellValue {
  filled: boolean;
  hovered?: boolean;
}

export interface CellProps {
  x: number;
  y: number;
  value: CellValue;
  size: number;
  color: Color;
  hovered?: boolean;
  onHover?: (coords?: Pair) => void;
  onClick: (coords: Pair) => void;
}

const RawGridCell = (props: PropsWithChildren<CellProps & StyledComponentProps>) => {
  const onEnter = (e: unknown) => props.onHover ? props.onHover([props.x, props.y]) : emptyFunc();
  const onLeave = (e: unknown) => props.onHover ? props.onHover(undefined) : emptyFunc();

  return <div className={ props.className } onMouseEnter={ onEnter } onMouseLeave={ onLeave }
              onClick={ _ => props.onClick([props.x, props.y]) }>{ props.children }</div>;
};

const getFontSize = (cellSize: number) => {
  if (cellSize < 15) {
    return '0.6em';
  }
  if (cellSize < 20) {
    return '0.7em';
  }
  if (cellSize < 25) {
    return '0.8em';
  }
  return '1em';
}

export const GridCell = styled(RawGridCell)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: ${ props => getFontSize(props.size) };
  font-weight: bold;
  color: #111;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: ${ props => props.size }px;
  height: ${ props => props.size }px;
  background: ${ props => props.value.hovered
  ? props.color.hoveredColor
  : (props.value.filled
    ? props.color.mainColor
    : 'white') };
`;

export interface GridProps {
  grid: ZOGrid;
  color: Color;
  cellSize: number;
}

const getFilledGrid = (grid: ZOGrid, boundedRegion: Pair[]): CellValue[][] => {
  const result: CellValue[][] = grid.map(row => row.map(cell => ({
    filled: cell === 1,
  })));
  boundedRegion.forEach(([x, y]) => {
    result[y][x].hovered = true;
  });
  return result;
};

const RawGrid = ({ cellSize, className, color, grid }: GridProps & StyledComponentProps) => {
  const [hovered, setHovered] = useState<Pair | undefined>();
  const [lastClicked, setLastClicked] = useState<Pair | undefined>();
  const [cellText, setCellText] = useState('');

  const boundedOnHover = useMemo(() => hovered ? getBoundedCells(grid, hovered[0], hovered[1]) : [], [hovered, grid]);
  const filledGrid = useMemo(() => getFilledGrid(grid, boundedOnHover), [boundedOnHover, grid]);

  const onCellClick = (p: Pair) => {
    setCellText('');
    setLastClicked(p);
  };

  useEffect(() => {
    if (!lastClicked) {
      return;
    }
    const [x, y] = lastClicked;
    if (grid[y][x] === 1) {
      const b = getBoundedCells(grid, x, y);
      const text = b.length.toString();
      setCellText(text);
    }
  }, [lastClicked, grid]);

  useEffect(() => {
    setLastClicked(undefined);
  }, [grid]);

  const isClickedCell = ([x, y]: Pair) => lastClicked ? (lastClicked[0] === x && lastClicked[1] === y) : false;

  const renderRow = (row: CellValue[], y: number) => <Row>
    { row.map((cell, x) => (
      <GridCell x={ x } y={ y } size={ cellSize } value={ cell }
                onHover={ setHovered }
                onClick={ onCellClick }
                color={ color }>{ isClickedCell([x, y]) ? cellText : '' }</GridCell>))
    }
  </Row>;

  return <div className={ className }>
    { filledGrid.map(renderRow) }
  </div>;
};

export const Grid = styled(RawGrid)`
`;
