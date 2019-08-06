/* global page:false it:false expect:false describe:false jest:false */

"use strict";

describe('Github Compare Tags', () => {
  it('Show tags in compare dropdown', async () => {
    jest.setTimeout(10000);

    await page.goto('https://github.com/marpo60/github-compare-tags/compare');

    const title = await page.title();

    await expect(title).toMatch('Compare · marpo60/github-compare-tags');

    await page.waitForFunction(() => {
      const checkDropdown = (index) => {
        const menu = document.querySelectorAll(".commitish-suggester")[index];
        const versions = menu.querySelectorAll(".select-menu-item-text");

        return Array.from(versions).filter((version) => version.innerText === "v0.0.5").length > 0;
      };

      // Check tag is present in base dropdown and in compare dropdown
      return checkDropdown(0) && checkDropdown(1);
    });
  });
});
