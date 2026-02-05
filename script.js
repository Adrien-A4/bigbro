(() => {
  const page = document.querySelector(".page");
  if (!page) return;

  const body = document.body;
  body.classList.remove("no-js");
  body.classList.add("js");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transitionMs = 320;

  const revealElements = Array.from(document.querySelectorAll(".reveal"));

  const showPage = () => {
    page.classList.remove("is-leaving");
    if (prefersReduced) {
      page.classList.add("is-loaded");
      revealElements.forEach((el) => el.classList.add("in"));
      return;
    }
    requestAnimationFrame(() => {
      page.classList.add("is-loaded");
    });
  };

  const revealOnScroll = () => {
    if (prefersReduced || revealElements.length === 0) {
      revealElements.forEach((el) => el.classList.add("in"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((el) => observer.observe(el));
  };

  const shouldIgnoreLink = (link) => {
    if (!link || link.target === "_blank") return true;
    if (link.hasAttribute("download")) return true;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return true;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return true;
    return false;
  };

  const handleLinkClick = (event) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a");
    if (shouldIgnoreLink(link)) return;

    const url = new URL(link.href, window.location.href);
    const sameOrigin = url.origin === window.location.origin;
    const samePage = url.pathname === window.location.pathname && url.search === window.location.search;

    if (!sameOrigin || samePage) return;

    event.preventDefault();
    if (prefersReduced) {
      window.location.href = url.href;
      return;
    }

    page.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = url.href;
    }, transitionMs);
  };

  showPage();
  revealOnScroll();

  document.addEventListener("click", handleLinkClick);
  window.addEventListener("pageshow", showPage);
})();
