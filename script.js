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

    const highlightTOC = () => {
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 150) {
          current = section.getAttribute("id");
        }
      });

      tocLinks.forEach((link) => {
        link.style.color = "";
        link.style.borderLeftColor = "";
        if (link.getAttribute("href") === `#${current}`) {
          link.style.color = "#e6edf3";
          link.style.borderLeftColor = "#ff6b35";
        }
      });
    };

    window.addEventListener("scroll", highlightTOC);
    highlightTOC();
  }

});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    if (e.target.classList.contains("button")) {
      e.target.click();
    }
  }
});
