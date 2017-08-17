# websocket-refresh-chrome-ext
A chrome extension that will refresh tabs based on messages sent from a websocket server

I found myself needing somethign like this for a project I'm working on where I cannot use any of the available servers like webpackdevserver or express because I needed to refresh a tab on a content management system.

> this extension is based on a starter from the good folks at: https://extensionizr.com


## Use case
You want to automatically tell chrom to refresh a certain tab(s).

### Example (why I created this)
Custom build proccess that watches a directory, then posts the resulting JS/CSS to a content management system (CMS) that you run locally. You dont want to write websocket code on the CMS itself and would rather an extension do that for you.

The setup:

```js
// nodejs script
const fs = require('fs');
const WebSocket = require('ws'); // requires "npm install ws"

// start a websocket server
function startWebSocket(){
  const wss = new WebSocket.Server({ port: 8081 });
  console.log("websocket server running!");
  const connections = [];
  wss.on('connection', function connection(ws) {
    // keep track of clients
    connections.push(ws);
    // send any new messages to all clients
    ws.on('message', (d) => connections.forEach(connection => connection.send(d)));
  });

  const ws = new WebSocket('ws://localhost:8081');
  ws.on('message', console.log);
  return ws;
}
// websocket server instance
const ws = startWebSocket();

// watch changes to a directory
fs.watch('dist', (eventType, filename) => {
  console.log(filename);
  ws.send('(.*)localhost(.*)'); // a regex that matches all tabs that contain the string "localhost"
  
});

```

the extension:
1. Install the extension
2. While the websocket server is running, click the extension icon
3. add the websocket url for the server we started above: "ws://localhost:8081"
4. click connect!

Now, everytime the websocket client (in the chrome extension) recieves a new regex message, it will iterate over all open tabs, if a match to the regex is found, that tab is reloaded!

viola!
