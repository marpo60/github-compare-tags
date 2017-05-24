'use strict';

document.addEventListener('DOMContentLoaded', () => {
  var tokenInput = document.getElementById("token");
  var privateInput = document.getElementById("private");

  chrome.storage.local.get(['token', 'private'], function(items) {
    if (items.token) {
      tokenInput.value = items.token;
    }
    privateInput.checked = items.private;
  });

  tokenInput.addEventListener('change', (e) => {
    chrome.storage.local.set({'token': e.target.value});
  });

  privateInput.addEventListener('change', (e) => {
    chrome.storage.local.set({'private': e.target.checked});
  });
});
