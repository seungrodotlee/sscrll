let sscrll = window.sscrll || {};

sscrll._currentScroll = 0;
sscrll._ease = 0.075;
sscrll._container = null;
sscrll._inner = null;
sscrll._height = 0;
sscrll._documentSizer = null;

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
  sscrll._documentSizer.setAttribute(
    "style",
    `visibility: hidden; width: 1px; height: ${sscrll._height}px;`
  );
};

(function () {
  "use strict";

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  sscrll._container = document.querySelector(".scroll-container");
  sscrll._container.setAttribute(
    "style",
    "position: fixed; height: 100%; width: 100%; overflow: hidden; transform: translateY(0)"
  );
  let scrollRequested = 0;
  let rafId = undefined;
  let rafActive = false;

  let lastChild = sscrll._container.lastElementChild;

  sscrll._height =
    lastChild.offsetTop + lastChild.offsetHeight - sscrll._container.offsetTop;

  sscrll._documentSizer = document.createElement("div");
  sscrll._documentSizer.setAttribute(
    "style",
    `position: absolute; top: 0; left: 0; z-index: -1; pointer-events: none; width: 1px; height: ${sscrll._height}px;`
  );
  document.body.appendChild(sscrll._documentSizer);

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

  window.addEventListener("scroll", () => {
    scrollRequested = window.scrollY || window.pageYOffset;

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
