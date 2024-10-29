export const isEmptyString = (val: any) => {
  if (typeof val === 'string' && /^['\s]*$/.test(val)) {
    return undefined;
  }
  return val;
};
