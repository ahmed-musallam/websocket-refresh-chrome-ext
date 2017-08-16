/* jshint undef: true, unused: true, esversion:6, node: true */
const socketField = document.querySelector("#websocket");
const regexField = document.querySelector("#regex");
const submitButton = document.querySelector("[type=submit]");

const prop_socket = "socket";
const prop_regex = "regex";

const set = (name, val, cb) =>  chrome.storage.local.set({[name]: val}, (obj)=> cb ? cb(obj) : null);
const get = (name, cb) =>  chrome.storage.local.get(name, (obj)=> cb ? cb(obj) : null);

get(prop_socket, (obj) => socketField.value = obj[prop_socket]);
get(prop_regex, (obj) => regexField.value = obj[prop_regex]);

submitButton.addEventListener("click", (e) => {
    set(prop_socket, socketField.value);
    set(prop_regex, regexField.value);
    chrome.extension.sendMessage(
        {greeting: "greeting"},
        function (response) {
            console.log("response: ",response);
        });
});