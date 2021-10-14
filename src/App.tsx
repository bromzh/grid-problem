import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

/// Utils/types
type ZO = 0 | 1;
type ZORow = ZO[];
type ZOGrid = ZORow[];
type Pair = [number, number];
type NumberChangeCallback = (x: number) => void;

type StyledComponentProps = { className?: string; }

/// Utils/misc
const emptyFunc = () => {
};
const generateRow = (n: number): ZORow => Array.from({ length: n }, () => Math.round(Math.random())) as ZORow;
const generateGrid = (n: number) => Array.from({ length: n }, () => generateRow(n));

const calculateCellSize = (gridSize: number, cellsCount: number): number => Math.ceil(gridSize / cellsCount);


const getBoundedCells = (grid: ZOGrid, x0: number, y0: number) => {
  const stack: Pair[] = [];
  const result: Pair[] = [];

  const checkCell = (p: Pair) => {
    const [xx, yy] = p;
    if (xx < 0 || yy < 0 || xx >= grid.length || yy >= grid.length) {
      return false;
    }
    if (result.find(([x, y]) => xx === x && yy === y)) {
      return false;
    }
    return grid[yy][xx] !== 0;

  };

  const tryToPushCell = (p: Pair) => {
    if (checkCell(p)) {
      stack.push(p);
    }
  };

  if (grid[y0][x0] === 1) {
    stack.push([x0, y0]);
    while (stack.length > 0) {
      const cur = stack.pop();
      if (cur) {
        const [x, y] = cur;
        result.push(cur);
        tryToPushCell([x - 1, y]); // leftCell
        tryToPushCell([x + 1, y]); // rightCell
        tryToPushCell([x, y - 1]); // topCell
        tryToPushCell([x, y + 1]); // botCell
      }
    }
  }
  return result;
};

/// Utils/ui
const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Cell = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

interface SliderWidgetProps {
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

const SliderWidget = styled(RawSliderWidget)`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

/// Utils/color picker
type ColorPickerCallback = (color: Color) => void;

interface Color {
  mainColor: string;
  hoveredColor: string;
}

interface ColorPickerItemProps {
  color: Color;
  onClick: ColorPickerCallback;
}

const RawColorPickerItem = ({ color, onClick, className }: ColorPickerItemProps & StyledComponentProps) => {
  return <div className={ className } onClick={ e => onClick(color) }/>;
};

const ColorPickerItem = styled(RawColorPickerItem)`
  width: 16px;
  height: 16px;
  display: inline-block;
  background: ${ props => props.color.mainColor };
`;

interface ColorPickerProps {
  colors: Color[];
  value: Color;
  onChange: ColorPickerCallback;
}

const RawColorPicker = ({ className, colors, onChange }: ColorPickerProps & StyledComponentProps) => {
  return <div className={ className }>
    { colors.map(color => <ColorPickerItem color={ color } onClick={ onChange }/>) }
  </div>;
};

const ColorPicker = styled(RawColorPicker)`
  display: flex;
  width: 64px;
  flex-wrap: wrap;
`;

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

/// Grid

interface CellValue {
  filled: boolean;
  hovered?: boolean;
}

interface CellProps {
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

const GridCell = styled(RawGridCell)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: ${ props => props.size }px;
  height: ${ props => props.size }px;
  background: ${ props => props.value.hovered
          ? props.color.hoveredColor
          : (props.value.filled
                  ? props.color.mainColor
                  : 'white') };
`;

interface GridProps {
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

const Grid = styled(RawGrid)`
  //margin: 30px;
`;

/// Ui
interface CellsCountProps {
  cellsCount: number;
  onChange: NumberChangeCallback;
}

const CellsCount = ({ cellsCount, onChange }: CellsCountProps) => {
  return <SliderWidget onChange={ onChange } min={ 2 } max={ 20 } step={ 1 } value={ cellsCount } label={ 'Size' }/>;
};

interface GridSizeProps {
  onChange: NumberChangeCallback;
  value: number;
}

const GridSize = ({ onChange, value }: GridSizeProps) => {
  return <SliderWidget onChange={ onChange } value={ value } min={ 200 } max={ 800 } step={ 20 }
                       label={ 'Grid size' }/>;
};

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
