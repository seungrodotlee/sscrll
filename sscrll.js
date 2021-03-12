let sscrll = window.sscrll || {};

sscrll._currentScroll = 0;
sscrll._ease = 0.075;
sscrll._container = null;
sscrll._inner = null;

sscrll.getCurrentScroll = () => {
  return sscrll._currentScroll;
};

sscrll.setEase = (value) => {
  sscrll._ease = value;
};

sscrll.getCurrentEase = () => {
  return sscrll._ease;
};

sscrll.setContainer = (el) => {
  if (el instanceof HTMLElement) {
    sscrll._container = el;
  } else {
    throw Error("container should be instance of HTMLElement!");
  }
};

(function () {
  "use strict";

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  sscrll._container = document.querySelector(".scroll-container");
  sscrll._container.setAttribute(
    "style",
    "height: 100%; width: 100%; overflow: hidden; transform: translateY(0)"
  );
  let scrollRequested = 0;
  let rafId = undefined;
  let rafActive = false;

  let startAnimation = () => {
    if (!rafActive) {
      rafActive = true;
      rafId = requestAnimationFrame(updateAnimation);
    }
  };

  let updateAnimation = () => {
    let amount = scrollRequested - sscrll._currentScroll;

    let delta = Math.abs(amount) < 0.1 ? 0 : amount * sscrll._ease;

    if (!(sscrll._container instanceof HTMLElement)) {
      throw Error("container should be instance of HTMLElement!");
    }

    if (delta) {
      sscrll._currentScroll += delta;
      sscrll._currentScroll = parseFloat(sscrll._currentScroll.toFixed(2));
      rafId = requestAnimationFrame(updateAnimation);
    } else {
      sscrll._currentScroll = scrollRequested;
      rafActive = false;
      cancelAnimationFrame(rafId);
    }

    sscrll._container.setAttribute(
      "style",
      `transform: translateY(${-sscrll._currentScroll}px)`
    );
  };

  window.addEventListener("mousewheel", (e) => {
    scrollRequested += e.deltaY;

    if (scrollRequested <= 0) {
      scrollRequested = 0;
    }

    startAnimation();
  });
})();
