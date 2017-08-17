/* jshint undef: true, unused: true, esversion:6, node: true */
/* globals Messenger, chrome, action, document, WebSocket, socketStore, getCloseReason */

// initialize all UI elements
const socketField =      document.querySelector("#websocket");
const connectButton =    document.querySelector("#connect");
const disconnectButton = document.querySelector("#connected");
const socketSpan =       document.querySelector("#socketUrl");
const disconnectedForm =          document.querySelector("#disconnected");
const connectedDiv =     document.querySelector("#connected");
const errorsDiv =        document.querySelector("#errors");

const messenger = new Messenger();

// init field and span with socket url;
socketStore.get(socketUrl => {
  if(!socketUrl) return;
  socketField.value = socketUrl;
  socketSpan.innerHTML = socketUrl;
});

/**
 * Shows an error in popup UI.
 * @param {*} error 
 */
function showError(error) {
  if(!error){
    console.log("called showError with empty error, clear UI.");
    errorsDiv.innerHTML = "";
  }
  else{
    console.error(error);
    errorsDiv.innerHTML = error;
  }
}

/**
 * Get the socket status and update UI accordingly
 */
function refreshUI(){
  // get the socket status and update ui accordingly
  chrome.extension.sendMessage({ action: action.STATUS }, (response) => {
    console.log("response: " +response);
    switch(response){
      case WebSocket.OPEN: {
         disconnectedForm.style.display = "none";
         connectedDiv.style.display = "block";
         console.log("status is now OPEN");
         break;
      }
      case WebSocket.CLOSED: {
        disconnectedForm.style.display = "block";
        connectedDiv.style.display = "none";
        console.log("status is now CLOSED");
        break;
      }
      case WebSocket.CONNECTING: {
        console.log("status is now CONNECTING");
        return refreshUI();
      }
      case WebSocket.CLOSING: {
        console.log("status is now CLOSING");
        return refreshUI();
      }
    }
  });
}

// click handler for connect button
connectButton.addEventListener("click", (e) => {
  console.log("UI interaction: connect button clicked");
  socketStore.set(socketField.value, () => {
    messenger.send({ action: action.OPEN }, (err) => {
      if(err) showError(err);
      refreshUI();
    });
  });
});

// click handler for disconnect button
disconnectButton.addEventListener("click", (e) => {
  console.log("UI interaction: disconnect button clicked");
   messenger.send({ action: action.CLOSE }, (err) => {
      if(err) showError(err);
      refreshUI();
    });
});

messenger.subscribe((response) => {
 if(!response || !response.event) return;

  if(response.event.type === 'close') showError(getCloseReason(response.event.code));
  if(response.event.type === 'close') showError(getCloseReason(response.event.code));
});

refreshUI();