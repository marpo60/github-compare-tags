"use strict";

(() =>{
  var tags = null;

  function createAnchorElement(repo, base, compare, text) {
    var innerText = `<a href="/${repo}/compare/${base}...${compare}" class="select-menu-item js-navigation-item js-navigation-open navigation-focus" role="menuitem" rel="nofollow">
            <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>
            <div class="select-menu-item-text js-select-button-text">${text}</div>
          </a>`;
    var div = document.createElement('div');
    div.innerHTML = innerText;

    return div.firstChild;
  }

  function extractInfo() {
    var repo = document.querySelector(".public").innerText;
    var [menuBase, menuCompare] = document.querySelectorAll(".commitish-suggester .select-menu-list > div:first-child ");

    var x = document.querySelectorAll(".commitish-suggester .js-select-button");
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

  async function getTags() {
    var i = extractInfo();

    if (tags === null) {
      const response = await fetch(`//api.github.com/repos/${i.repo}/tags?per_page=100`);
      const json = await response.json();
      tags = json.map(function(item) {return item.name;});
    }
  }

  function comparePage() {
    return /^\/[^/]+\/[^/]+\/compare/.test(location.pathname);
  }

  function setup() {
    if (!comparePage()) {
      return;
    }

    // Dont support cross fork...yet
    if (document.querySelector(".range-editor.text-gray.js-range-editor.is-cross-repo")) {
      return;
    }

    var i = extractInfo();

    getTags().then(function() {
      tags.forEach(function(tag) {
        i.menuBase.append(createAnchorElement(i.repo, tag, i.tagCompare, tag));
        i.menuCompare.append(createAnchorElement(i.repo, i.tagBase, tag, tag));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setup();
  });

  document.addEventListener('pjax:success', () => {
    setup();
  });
})();

