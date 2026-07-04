import Panel from './Panel';
import SplitterComp from './Splitter';

export type { PanelProps, SplitterProps } from './interface';
export type { ShowCollapsibleIconMode } from './SplitBar';

type CompoundedComponent = typeof SplitterComp & {
  Panel: typeof Panel;
};

const Splitter = SplitterComp as CompoundedComponent;
Splitter.Panel = Panel;

export default Splitter;
