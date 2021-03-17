let sscrll = window.sscrll || {};

sscrll._currentScroll = 0;
sscrll._ease = 0.075;
sscrll._container = null;
sscrll._inner = null;
sscrll._height = 0;

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

sscrll.getHeight = () => {
  return sscrll._height;
};

sscrll.setHeight = (value) => {
  sscrll._height = value;
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

  let lastChild = sscrll._container.lastElementChild;

  sscrll._height =
    lastChild.offsetTop + lastChild.offsetHeight - sscrll._container.offsetTop;

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

    if (scrollRequested >= sscrll._height - window.innerHeight) {
      scrollRequested = sscrll._height - window.innerHeight;
    }

    startAnimation();
  });
})();

window.sscrll = sscrll;
