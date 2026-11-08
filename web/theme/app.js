(() => {
  const root = document.body.dataset.root || "";
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".menu-toggle");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    sidebar.addEventListener("click", (event) => {
      if (event.target.closest("a")) sidebar.classList.remove("open");
    });
  }

  // Copy buttons on code blocks.
  for (const pre of document.querySelectorAll("article pre")) {
    const button = document.createElement("button");
    button.className = "copy";
    button.type = "button";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      const code = pre.querySelector("code");
      try {
        await navigator.clipboard.writeText(code ? code.innerText : pre.innerText);
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy"), 1500);
      } catch {
        button.textContent = "Failed";
      }
    });
    pre.appendChild(button);
  }

  // Search.
  const modal = document.querySelector(".search-modal");
  const input = modal ? modal.querySelector("input") : null;
  const results = modal ? modal.querySelector(".search-results") : null;
  const openButton = document.querySelector(".search-button");
  const closeButton = modal ? modal.querySelector(".search-close") : null;
  let index = null;

  async function loadIndex() {
    if (index) return index;
    const response = await fetch(`${root}search-index.json`);
    index = await response.json();
    return index;
  }

  function renderResults(items, query) {
    if (!items.length) {
      results.innerHTML = "<p>No results.</p>";
      return;
    }
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(${safe})`, "ig");
    results.innerHTML = items
      .slice(0, 20)
      .map((item) => {
        const snippet = item.text.slice(0, 140).replace(pattern, "<mark>$1</mark>");
        return `<a href="${root}${item.url}"><strong>${item.title}</strong><small>${item.section ? `${item.section} · ` : ""}${snippet}…</small></a>`;
      })
      .join("");
  }

  async function search(query) {
    const items = await loadIndex();
    const lower = query.toLowerCase();
    const matches = items
      .map((item) => {
        const title = item.title.toLowerCase();
        const text = item.text.toLowerCase();
        const score = title.includes(lower) ? 2 : text.includes(lower) ? 1 : 0;
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
    renderResults(matches, query);
  }

  function openSearch() {
    if (!modal) return;
    modal.hidden = false;
    input.value = "";
    results.innerHTML = "";
    input.focus();
  }

  function closeSearch() {
    if (modal) modal.hidden = true;
  }

  if (openButton) openButton.addEventListener("click", openSearch);
  if (closeButton) closeButton.addEventListener("click", closeSearch);
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeSearch();
    });
  }
  if (input) {
    input.addEventListener("input", () => {
      const query = input.value.trim();
      if (query.length < 2) {
        results.innerHTML = "";
        return;
      }
      search(query);
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape") closeSearch();
  });
})();
