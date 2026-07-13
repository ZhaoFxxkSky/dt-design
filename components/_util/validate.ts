export function validateValue(val: any): boolean {
  if (val == null) return false;
  if (val === '') return false;
  return true;
}

export function validNumberValue(val: any): boolean {
  if (val == null) return false;
  if (typeof val === 'number' && !Number.isNaN(val)) return true;
  return false;
}
