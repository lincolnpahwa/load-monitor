import Ember from 'ember';
import { helper } from '@ember/component/helper';

const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
  timeZone: 'America/New_York'
};

const formatter = new Intl.DateTimeFormat('en-US', options);

export function dateFormatter(params /*, hash*/ ) {
  try {
      const [timestamp] = params;
      if (timestamp) {
        const date = new Date(timestamp);

        return formatter.format(date);
      }
    return params;
  } catch (e) {
    Ember.Logger.error('Error formatting date for: ', params);
    Ember.Logger.error(e);
    return params;
  }
}

export default helper(dateFormatter);
