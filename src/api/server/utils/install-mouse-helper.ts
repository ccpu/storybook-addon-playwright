// https://gist.github.com/aslushnikov/94108a4094532c7752135c42e12a00eb
// This injects a box into the page that moves with the mouse;
// Useful for debugging

import { Page } from 'playwright-core';

async function installMouseHelper(page: Page) {
  await page.waitForLoadState('load');
  await page.evaluate(() => {
    if (window !== window.parent) return;
    const box = document.createElement('playwright-mouse-pointer');
    const styleElement = document.createElement('style');
    function getHighestZIndex() {
      let highestZIndex = 0;
      let currentZIndex = 0;
      const nodes = document.body.getElementsByTagName('*');

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node === box) continue;
        currentZIndex = Number(window.getComputedStyle(node).zIndex);
        if (currentZIndex > highestZIndex) {
          highestZIndex = currentZIndex;
        }
      }

      return highestZIndex + 1;
    }
    styleElement.innerHTML = `
        playwright-mouse-pointer {
            position: absolute;
            top: -100px;
            z-index: 1000;
            left: -100px;
            width: 14px;
            height: 14px;
            background: rgba(0, 0, 0, 0.39);
            border: 2px solid #fbfbfb9e;
            border-radius: 14px;
            margin: -8px 0 0 -8px;
            padding: 0;
            pointer-events: none;
          }
          playwright-mouse-pointer.button-mousedown {
            background: rgba(243, 169, 4, 0.87);
          }
        `;
    document.head.appendChild(styleElement);
    document.body.appendChild(box);
    document.addEventListener(
      'mousemove',
      (event) => {
        box.style.left = event.pageX + 'px';
        box.style.top = event.pageY + 'px';
        box.style.zIndex = getHighestZIndex().toString();
      },
      true,
    );
    document.addEventListener(
      'mousedown',
      () => {
        box.classList.add('button-mousedown');
        box.style.zIndex = getHighestZIndex().toString();
      },
      true,
    );
    document.addEventListener(
      'mouseup',
      () => {
        box.classList.remove('button-mousedown');
        box.style.zIndex = getHighestZIndex().toString();
      },
      true,
    );
  }, false);
}

export { installMouseHelper };
