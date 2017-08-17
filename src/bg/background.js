/* jshint undef: true, unused: true, esversion:6, node: true */

let socket;

function refreshTabs(regex){
  chrome.tabs.query({},(tabs) => {
    tabs.forEach((tab) => {
      console.log("comparing ",tab.url);
      if(tab.url.match(regex)){
        chrome.tabs.reload(tab.id, ()=> console.log("reloaded tab!"));
      }
    });
  });
}

function startSocket(errorCb){
  // get the socket url
  get(prop_socket, (obj) => {
      const socketUrl = obj[prop_socket];
      console.log(socketUrl);
      console.log("starting socket...");
      socket = new WebSocket(socketUrl);
      socket.onopen = (e) =>  errorCb();
      socket.onerror = (e) => errorCb({msg:"Cannot start socket", e:e});
      console.log("started");
      // when this websocket recieves a message, it should be a regex string
      // if the regex matches a browser tab url, the page will be reloaded.
      socket.addEventListener('message', function (event) {
        if(!event.data) return;
        const regex = new RegExp(event.data, 'g');
        refreshTabs(regex);
      });
  });
}

function stopSocket(errorCb){
  if(socket){
    try {
      console.log("stopping socket...");
      socket.close();
    }
    catch(e){
      errorCb({msg:"Cannot stop socket", e:e});
      console.log(e);
      return;
    }
    console.log("stopped");
    errorCb();
  }
}

function isOpen(cb){
  if(!socket) cb(false);
  else{
    cb(socket.readyState === socket.OPEN)
  }
}


chrome.extension.onMessage.addListener(

  function(request, sender, sendResponse) {
    if(!request){
      sendResponse();
      return;
    }
    if (request.action === "start"){
      startSocket(sendResponse);
    }
    else if(request.action === "stop"){
      stopSocket(sendResponse);
    }
    else if(request.action === "isOpen"){
      isOpen(sendResponse);
    }
  });

  const prop_socket = "socket";
  const prop_regex = "regex";
  const set = (name, val, cb) =>  chrome.storage.local.set({[name]: val}, (obj)=> cb ? cb(obj) : null);
  const get = (name, cb) =>  chrome.storage.local.get(name, (obj)=> cb ? cb(obj) : null);