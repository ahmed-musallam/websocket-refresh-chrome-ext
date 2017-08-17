/* jshint undef: true, unused: true, esversion:6, node: true */
/* globals Messenger, chrome, action, socketStore, WebSocket */

let socket;
let messenger = new Messenger();
// get from storage

/**
 * refresh tabs that match the regex
 * @param {*} regex 
 */
function refreshTabs(regex) {
  chrome.tabs.query({}, (tabs) => {
    tabs
    .filter(tab => tab.url.match(regex))
    .map(tab => tab.id)
    .forEach(tabId => chrome.tabs.reload(tabId, () => console.log("tab reloaded!")));
  });
}

/**
 * Open a websocket connection to the websocket server
 * the url is optained from storage
 * @param {*} errorCb 
 */
function openSocket(errorCb) {
  // get the socket url
  socketStore.get((socketUrl) => {
    console.log(`starting socket at url ${socketUrl}...`);
    socket = new WebSocket(socketUrl);
    socket.onopen  = (e) =>  messenger.send({event:{type:e.type, code:e.code}}, () => {});
    socket.onclose  = (e) =>  messenger.send({event:{type:e.type, code:e.code}}, () => {});
    socket.onerror = (e) => messenger.send({event:{type:e.type, code:e.code}}, () => {});
    // when this websocket recieves a message, it should be a regex string
    // if the regex matches a browser tab url, the page will be reloaded.
    socket.addEventListener('message', function (event) {
      if (!event.data) return;
      console.log(`socket recieved a regex: ${event.data}`);
      const regex = new RegExp(event.data, 'g');
      refreshTabs(regex);
    });
    console.log("end openSocket method");
    return true;
  });
  return true;
}

/**
 * Close the websocket server
 * @param {*} errorCb 
 */
function closeSocket(errorCb) {
  if (socket) {
    socket.addEventListener('onclose', (e) => {
      console.log("socket closed");
      errorCb(); // empty, no errors
    });
    socket.addEventListener('onerror', (e) => errorCb({ msg: "Cannot stop socket", e: e }));

    console.log("attempting to close socket...");
    socket.close();
  }
}

/**
 * Convert numeric status to string
 */
function toStringStatus(status){
   switch(status){
      case WebSocket.OPEN: return "OPEN";
      case WebSocket.CLOSED: return "CLOSED";
      case WebSocket.CONNECTING: return "CONNECTING";
      case WebSocket.CLOSING: return "CLOSING";
    }
};

/**
 * Check if the websocket server is open
 * @param {*} cb 
 */
function socketStatus(cb) {
  console.log("getting socket status");
  let status;
  if (socket){
    status = socket.readyState;
  }
  else status = WebSocket.CLOSED;

  console.log(`The socket status is ${toStringStatus(status)}`);
  cb(status);
}

/**
 * Subscribe to chrome extension messages
 */
messenger.subscribe((message, sendResponse) => {
  console.log(`background recieved a message: ${JSON.stringify(message)}`);
  if (!message) {
    sendResponse();
    return;
  }
  if (message.action === action.OPEN) {
    openSocket(sendResponse);
  }
  else if (message.action === action.CLOSE) {
    closeSocket(sendResponse);
  }
  else if (message.action === action.STATUS) {
    socketStatus(sendResponse);
  }
  return true; // indicates that response will be sent asyncronously

});