A simple and lightweight HTTP Logger for an Express.js application.

> NOTE: This package is still in development and has a number of upcoming features. You can read more about the features which will be added in the future in the **Features** chapter at the bottom of the page

## Installation

In a NodeJS project using Express, run `npm install http-track` to install the package.

## How to setup

The package is created so that it can run out of the box simply by letting the application use it. Example shown below:

```
const express = require("express")
const { httpLogger } = require('./dist/index.js');

const app = express();

app.use(httpLogger());
```

The logger has default settings which make it incredibly simple to setup. All that is left to do is create some endpoint with Express.

```
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
```

Upon performing a GET request to `http://localhost:3000` a message will be displayed in the console.
![Example GET request](./assets/example_request.png)
## Customization

### Formatting the logs
The logger has some simple parameters which can be shown or reordered:

* timestamp - the time when the request was made
* method - the type of method called (GET, POST, PUT, etc)
* url - the endpoint which was called
* status - the response status of the server
* response-time - the time taken for the response to be made (in ms)

By default the structure of the logs is the following:
 ':timestamp :method :url :status - :response-time ms'

You can change this by modifying the `format` parameter when creating the logger. The parameters can be removed or reordered.

```
app.use(httpLogger({ format: ':timestamp :method' }));
```