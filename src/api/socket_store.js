/* jshint undef: true, unused: true, esversion:6, node: true */
/* globals chrome */
var socketStore = {
    set:  (val, cb) => chrome.storage.local.set({ '_socket': val }, cb),
    get:  (cb)      => chrome.storage.local.get('_socket', (obj) => cb(obj['_socket']))
};