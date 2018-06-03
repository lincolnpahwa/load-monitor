import EmberObject from '@ember/object';
import WebSocketEnabledMixin from 'load-monitor/mixins/web-socket-enabled';
import { module, test } from 'qunit';

module('Unit | Mixin | web-socket-enabled', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let WebSocketEnabledObject = EmberObject.extend(WebSocketEnabledMixin);
    let subject = WebSocketEnabledObject.create();
    assert.ok(subject);
  });
});
