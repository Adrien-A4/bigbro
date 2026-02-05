document.body.classList.remove("no-js");
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    } else {
      entry.target.classList.remove("is-visible");
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".page");
  if (page) {
    requestAnimationFrame(() => {
      page.classList.add("is-ready");
    });
  }

  window.addEventListener("pageshow", () => {
    if (!page) return;
    page.classList.remove("is-exiting");
    page.classList.add("is-ready");
  });

  const themeToggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    if (icon) {
      icon.className =
        theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    }
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  };

  const storedTheme = localStorage.getItem("theme");
  setTheme(storedTheme || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      themeToggle.classList.add("is-animating");
      setTheme(nextTheme);
      window.setTimeout(() => {
        themeToggle.classList.remove("is-animating");
      }, 360);
    });
  }

  if (window.hljs) {
    window.hljs.highlightAll();
  }

  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    observer.observe(el);
  });

  const navigateWithFade = (url) => {
    if (!page) {
      window.location.href = url;
      return;
    }
    page.classList.add("is-exiting");
    window.setTimeout(() => {
      window.location.href = url;
    }, 200);
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (link.target && link.target !== "_self") return;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;

    event.preventDefault();
    navigateWithFade(url.href);
  });

  const header = document.querySelector(".site-header");

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.5)";
    } else {
      header.style.boxShadow = "none";
    }
  });

  const codeBlocks = document.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    const pre = block.parentElement;
    const wrapper = document.createElement("div");
    wrapper.className = "code-wrap";

    const toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-button";
    button.textContent = "Copy";

    button.addEventListener("click", async () => {
      const text = block.textContent;
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000);
    });

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(toolbar);
    toolbar.appendChild(button);
    wrapper.appendChild(pre);
  });

  if (document.querySelector(".toc")) {
    const sections = document.querySelectorAll(".doc-section[id]");
    const tocLinks = document.querySelectorAll(".toc a");

    const setActive = (id) => {
      tocLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    };

    const tocObserver = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .forEach((entry, index) => {
            if (index === 0) {
              setActive(entry.target.getAttribute("id"));
            }
          });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((section) => tocObserver.observe(section));

    const activateFromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id) {
        setActive(id);
      }
    };

    window.addEventListener("hashchange", activateFromHash);
    activateFromHash();
  }

});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    if (e.target.classList.contains("button")) {
      e.target.click();
    }
  }
});
