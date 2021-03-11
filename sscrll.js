let sscrll = window.sscrll || {};

sscrll.currentScroll = 0;
sscrll.ease = 0.075;
sscrll.container = null;

sscrll.setContainer = (el) => {
  if (el instanceof HTMLElement) {
    sscrll.container = el;
  } else {
    throw Error("container should be instance of HTMLElement!");
  }
};

(function () {
  "use strict";

  let srollTargetPosition = 0;
  let rafId = undefined;
  let rafActive = false;

  let startAnimation = () => {};

  window.addEventListener("mousewheel", (e) => {
    scrollTargetPosition += e.deltaY;
  });
})();
