import type { FieldRenderer } from './types';
import DateRenderer from './renderers/DateRenderer';
import DigitRenderer from './renderers/DigitRenderer';
import SelectRenderer from './renderers/SelectRenderer';
import SwitchRenderer from './renderers/SwitchRenderer';
import TextAreaRenderer from './renderers/TextAreaRenderer';
import TextRenderer from './renderers/TextRenderer';

export const defaultRenderers: Record<string, FieldRenderer> = {
  text: TextRenderer,
  textarea: TextAreaRenderer,
  digit: DigitRenderer,
  date: DateRenderer,
  select: SelectRenderer,
  switch: SwitchRenderer,
};
