import { helper } from '@ember/component/helper';

import { dateFormatter } from './date-formatter';
import { numberFormatter } from './number-formatter';

export function alertDetails(params /*, hash*/ ) {
  const [alert] = params;
  const { type, load, timestamp } = alert;
  if (type === 'High') {
    return `HIGH LOAD: ${type} load generated an alert - load: ${numberFormatter([load])}, 
    		triggered at ${dateFormatter([timestamp])}`;
  } else {
    return `SYSTEM RECOVERED: ${type} load generated an alert - load: ${numberFormatter([load])}, 
    		triggered at ${dateFormatter([timestamp])}`;
  }
}

export default helper(alertDetails);
