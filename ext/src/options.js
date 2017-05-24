'use strict';

document.addEventListener('DOMContentLoaded', () => {
  var tokenInput = document.getElementById("token");
  var privateInput = document.getElementById("private");

  chrome.storage.local.get(['token', 'private'], function(items) {
    tokenInput.value = items.token;
    privateInput.checked = items.private;
  });

  chrome.storage.local.get('token', function(items) {
    var token = items.token;
    tokenInput.value = token;
  });

  tokenInput.addEventListener('change', (e) => {
    chrome.storage.local.set({'token': e.target.value});
  });

  privateInput.addEventListener('change', (e) => {
    chrome.storage.local.set({'private': e.target.checked});
  });
});
