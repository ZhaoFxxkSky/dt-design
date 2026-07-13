import { createContext } from '../../../_util/context';
import type { GetComponent, TableSticky } from '../../interface';

export interface StaticContextProps {
  scrollY: number;
  listItemHeight: number;
  sticky: boolean | TableSticky;
  getComponent: GetComponent;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export const StaticContext = createContext<StaticContextProps>();

export interface GridContextProps {
  columnsOffset: number[];
}

export const GridContext = createContext<GridContextProps>();
