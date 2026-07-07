import type { FieldDisplayRenderer } from './types';
import DateDisplay from './renderers/DateDisplay';
import DigitDisplay from './renderers/DigitDisplay';
import SelectDisplay from './renderers/SelectDisplay';
import SwitchDisplay from './renderers/SwitchDisplay';
import TextAreaDisplay from './renderers/TextAreaDisplay';
import TextDisplay from './renderers/TextDisplay';

export const defaultDisplayRenderers: Record<string, FieldDisplayRenderer> = {
  text: TextDisplay,
  textarea: TextAreaDisplay,
  digit: DigitDisplay,
  date: DateDisplay,
  select: SelectDisplay,
  switch: SwitchDisplay,
};
