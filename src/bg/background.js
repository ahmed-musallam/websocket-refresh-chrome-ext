/* jshint undef: true, unused: true, esversion:6, node: true */

let socket;
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	get(prop_socket, (obj) => {
      const socketUrl = obj[prop_socket];
      if(socket) socket.close();
      console.log(socketUrl)
      socket = new WebSocket(socketUrl);
      socket.addEventListener('message', function (event) {
        console.log("message ",event.data );
        if(!event.data) return;
        const regex = new RegExp(event.data, 'g');
        chrome.tabs.query({}, (tabs) => {
          console.log(tabs);
          tabs.forEach((tab) => {
            console.log("comparing ",tab.url);
            if(tab.url.match(regex)){
              chrome.tabs.reload(tab.id, ()=> console.log("reloaded tab!"));
            }
          });
        });
      });
    });
    sendResponse();
  });

  const prop_socket = "socket";
  const prop_regex = "regex";
  const set = (name, val, cb) =>  chrome.storage.local.set({[name]: val}, (obj)=> cb ? cb(obj) : null);
  const get = (name, cb) =>  chrome.storage.local.get(name, (obj)=> cb ? cb(obj) : null);