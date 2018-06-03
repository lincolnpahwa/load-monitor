import { helper } from '@ember/component/helper';

const formatter = new Intl.NumberFormat('en-US')
export function numberFormatter(params /*, hash*/ ) {
  const [number] = params;
  if (number) {
    return formatter.format(number);
  }
  return params;
}

export default helper(numberFormatter);
