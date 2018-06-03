# load-monitor

This application reports machine load data obtained via `uptime` and alerts if 2 min. average load exceeds defined threshold. 

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Yarn](https://yarnpkg.com/)

## Installation

* `git clone <repository-url>` this repository
* `cd load-monitor`
* `yarn install`

## Running / Development

* `yarn start`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `yarn test`


### File descriptions

* `server/src/load-monitor` Responsible for running `uptime Task` and reporting results (Test file: `server/test/load.monitor.test.js`)
* `server/lib/cmds/uptime` Executes `uptime` on the machine
* `app/components/load-monitor-component` Component responsible for rendering the updates for load.
* `app/mixins/web-socket-enabled` Mixin to enable web socket updates
* `app/util/line-chart` d3 line chart implementation