/* jshint undef: true, unused: true, esversion:6, node: true */
const socketField = document.querySelector("#websocket");
const connectButton = document.querySelector("#connect");
const disconnectButton = document.querySelector("#connected");
const socketSpan = document.querySelector("#socketUrl");
const mainDiv = document.querySelector("#main");
const connectedDiv = document.querySelector("#connected");
const errorsDiv = document.querySelector("#errors");

const prop_socket = "socket";

const set = (name, val, cb) => chrome.storage.local.set({ [name]: val }, (obj) => cb ? cb(obj) : null);
const get = (name, cb) => chrome.storage.local.get(name, (obj) => cb ? cb(obj) : null);

document.querySelector("form").addEventListener("onsubmit", (e) => e.preventDefault());

get(prop_socket, (obj) => {
  socketField.value = obj[prop_socket];
  socketSpan.innerHTML = obj[prop_socket];
});

function showError(error) {
  console.log(error);
  if(!error){
    errorsDiv.innerHTML = "";
  }
  else{
    console.error(error.msg, error.e);
    errorsDiv.innerHTML = error.msg;
  }
}

chrome.extension.sendMessage({ action: "isOpen" }, (response) => {
  if(response){
    mainDiv.style.display = "none";
    connectedDiv.style.display = "block";
  }
  else{
    mainDiv.style.display = "block";
    connectedDiv.style.display = "none";
  }
}
);

connectButton.addEventListener("click", (e) => {
  console.log("clicked!");
  set(prop_socket, socketField.value);
  chrome.extension.sendMessage({ action: "start" }, (err) => err ? showError(err) : null);
});

disconnectButton.addEventListener("click", (e) => {
  console.log("clicked!");
  set(prop_socket, socketField.value);
  chrome.extension.sendMessage({ action: "stop" }, (err) => err ? showError(err) : null);
  mainDiv.style.display = "block";
  connectedDiv.style.display = "none";
});