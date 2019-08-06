"use strict";

(() =>{
  var tags = null;
  var token = null;
  var privateRepos = null;

  function createAnchorElement(repo, base, compare, text) {
    var innerText = `<a href="/${repo}/compare/${base}...${compare}" class="select-menu-item" aria-checked="true" role="menuitemradio" rel="nofollow">
            <div class="select-menu-item-text" data-menu-button-text="">${text}</div>
          </a>`;
    var div = document.createElement('div');
    div.innerHTML = innerText;

    return div.firstChild;
  }

  function extractInfo() {
    var [, owner, repoName] = location.pathname.split('/');
    var repo = `${owner}/${repoName}`;
    var [menuBase, menuCompare] = document.querySelectorAll(".commitish-suggester .select-menu-list > div:first-child ");

    var x = document.querySelectorAll(".commitish-suggester [data-menu-button]");
    var tagBase = x[0].innerText;
    var tagCompare = x[1].innerText;

    return {
      repo,
      menuBase,
      menuCompare,
      tagBase,
      tagCompare
    };
  }

  function getHeaders() {
    var headers = new Headers();

    if (token) {
      headers.append("Authorization", `token ${token}`);
    }

    return headers;
  }

  async function getTags() {
    var i = extractInfo();

    if (tags === null) {
      const headers = getHeaders();
      const response = await fetch(`//api.github.com/repos/${i.repo}/tags?per_page=100`, { headers });
      if (response.ok) {
        const json = await response.json();
        tags = json.map(function(item) {return item.name;});
      } else {
        // Error Handling
        const text = await response.text();
        /* eslint-disable no-console */
        console.group("Github Compare Tags extension error");
        console.log("Status: ", response.status);
        console.log("Response: ", text);
        console.log("Options page: ", `chrome://extensions/?options=${chrome.runtime.id}`);
        console.groupEnd();
        /* eslint-enable no-console */

        tags = [];
      }
    }
  }

  // Dont support cross fork...yet
  function compareCrossForkPage() {
    return document.querySelector(".range-editor.text-gray.js-range-editor.is-cross-repo");
  }

  function openPRPage() {
    var queryParams = new URLSearchParams(location.search);

    return queryParams.has("expand");
  }

  function validComparePage() {
    var comparePage = /^\/[^/]+\/[^/]+\/compare/.test(location.pathname);
    var publicComparePage = Boolean(document.querySelector(".repohead .public"));

    return comparePage && (publicComparePage || privateRepos);
  }

  function setup() {
    if (!validComparePage() || openPRPage() || compareCrossForkPage()) {
      return;
    }

    const loaders = document.querySelectorAll('.commitish-suggester include-fragment');
    const promises = Array.from(loaders).map((loader) =>
      new Promise((resolve) => {
        loader.addEventListener('load', () => resolve());
      })
    );

    // mouseover handler is not present in the DOM element the first few times this runs
    var interval = setInterval(() => {
      const mouseoverEvent = new Event('mouseover');
      document.querySelectorAll(".commitish-suggester").forEach((el) => el.dispatchEvent(mouseoverEvent));
    }, 500);

    Promise.all(promises).then(() => {
      clearInterval(interval);
      var i = extractInfo();

      getTags().then(function() {
        tags.forEach(function(tag) {
          i.menuBase.append(createAnchorElement(i.repo, tag, i.tagCompare, tag));
          i.menuCompare.append(createAnchorElement(i.repo, i.tagBase, tag, tag));
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['token', 'private'], function(items) {
      token = items.token;
      privateRepos = items.private;

      setup();
    });
  });

  document.addEventListener('pjax:success', () => {
    setup();
  });
})();

