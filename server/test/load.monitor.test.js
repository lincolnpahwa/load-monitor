const mockCallback = jest.fn();
const mockHighAlert = jest.fn();
const mockBelowThresholdAlert = jest.fn();
const LoadMonitor = require('../src/load-monitor');

const loadMonitor = new LoadMonitor((event, payload) => {
  if (event === 'monitor:load:alert') {
    mockCallback();

    const { type } = payload;

    if (type === 'High') {
    	mockHighAlert();
    } else {
    	mockBelowThresholdAlert();
    }
  }
}, 1);

test('Alert logic increased', async() => {
  expect.assertions(3);
  loadMonitor.processAverage(1.1);
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockHighAlert.mock.calls.length).toBe(1);
  expect(mockBelowThresholdAlert.mock.calls.length).toBe(0);
})

test('Alert logic further increased', async() => {
  expect.assertions(3);
  loadMonitor.processAverage(1.5);
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockHighAlert.mock.calls.length).toBe(1);
  expect(mockBelowThresholdAlert.mock.calls.length).toBe(0);
})

test('Alert logic decreased', async() => {
  expect.assertions(3);
  loadMonitor.processAverage(0.9);
  expect(mockCallback.mock.calls.length).toBe(2);
  expect(mockHighAlert.mock.calls.length).toBe(1);
  expect(mockBelowThresholdAlert.mock.calls.length).toBe(1);
})

test('Alert logic further decreased', async() => {
  expect.assertions(3);
  loadMonitor.processAverage(0.5);
  expect(mockCallback.mock.calls.length).toBe(2);
  expect(mockHighAlert.mock.calls.length).toBe(1);
  expect(mockBelowThresholdAlert.mock.calls.length).toBe(1);
})

test('Alert logic increased again', async() => {
  expect.assertions(3);
  loadMonitor.processAverage(1.2);
  expect(mockCallback.mock.calls.length).toBe(3);
  expect(mockHighAlert.mock.calls.length).toBe(2);
  expect(mockBelowThresholdAlert.mock.calls.length).toBe(1);
})