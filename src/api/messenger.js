/* jshint undef: true, unused: true, esversion:6, node: true */
/* globals chrome */

function Messenger() {
  let subscribers = [];

  chrome.runtime.onMessage
  .addListener((msg, sender, sendResponse) => {
    console.log("Messenger recieved ", msg);
    subscribers.forEach(sub => sub(msg, sendResponse));
  });

  this.send = (message, callback) => {
    console.log("messenger sending: ", message);
    chrome.extension.sendMessage(message, callback);
  };

  this.subscribe = callback => subscribers.push(callback);
}