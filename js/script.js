(() => {
  const KEY = "ebv-data";
  const DEFAULT_CATEGORIES = ["Food", "Transport", "Fun"];
  const PALETTE = ["#0f766e", "#d97706", "#7c3aed", "#2563eb", "#db2777", "#65a30d", "#0891b2", "#e11d48"];

  const $ = (sel) => document.querySelector(sel);
  const rupiah = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  // ---------- State & storage ----------
  function load() {
    const fresh = { transactions: [], categories: [...DEFAULT_CATEGORIES], limit: 0, theme: null };
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && Array.isArray(saved.transactions)) {
        return {
          transactions: saved.transactions,
          categories: Array.isArray(saved.categories) && saved.categories.length ? saved.categories : fresh.categories,
          limit: Number(saved.limit) || 0,
          theme: saved.theme || null,
        };
      }
    } catch (e) { /* ignore corrupt data */ }
    return fresh;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  const state = load();
  let chart = null;

  // ---------- Theme ----------
  function currentTheme() {
    return state.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  function applyTheme() {
    const theme = currentTheme();
    document.documentElement.setAttribute("data-theme", theme);
    $("#theme-toggle").textContent = theme === "dark" ? "Light mode" : "Dark mode";
    renderChart();
  }

  // ---------- Rendering ----------
  function categoryColor(name) {
    return PALETTE[Math.max(0, state.categories.indexOf(name)) % PALETTE.length];
  }

  function renderCategories() {
    const select = $("#category");
    const previous = select.value;
    select.innerHTML = "";
    state.categories.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
    if (state.categories.includes(previous)) select.value = previous;
  }

  function renderTotal() {
    const total = state.transactions.reduce((sum, t) => sum + t.amount, 0);
    $("#total").textContent = rupiah(total);
    const over = state.limit > 0 ? state.transactions.filter((t) => t.amount > state.limit).length : 0;
    $("#limit-note").textContent = over
      ? `${over} transaction${over > 1 ? "s" : ""} above ${rupiah(state.limit)}`
      : "";
  }

  function renderList() {
    const list = $("#list");
    list.innerHTML = "";
    $("#list-empty").hidden = state.transactions.length > 0;

    state.transactions.forEach((t) => {
      const li = document.createElement("li");
      li.className = "item" + (state.limit > 0 && t.amount > state.limit ? " over" : "");

      const info = document.createElement("div");
      info.className = "name";
      info.textContent = t.name;
      const cat = document.createElement("span");
      cat.className = "cat";
      cat.textContent = t.category;
      info.appendChild(cat);

      const price = document.createElement("span");
      price.className = "price";
      price.textContent = rupiah(t.amount);

      const del = document.createElement("button");
      del.className = "del";
      del.type = "button";
      del.dataset.id = t.id;
      del.textContent = "Delete";
      del.setAttribute("aria-label", `Delete ${t.name}`);

      li.append(info, price, del);
      list.appendChild(li);
    });
  }

  function renderChart() {
    const totals = {};
    state.transactions.forEach((t) => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
    const labels = Object.keys(totals);
    const empty = labels.length === 0 || typeof Chart === "undefined";

    $("#chart-empty").hidden = labels.length > 0;
    $("#chart").hidden = empty;
    if (chart) { chart.destroy(); chart = null; }
    if (empty) return;

    const css = getComputedStyle(document.documentElement);
    chart = new Chart($("#chart"), {
      type: "pie",
      data: {
        labels,
        datasets: [{
          data: labels.map((l) => totals[l]),
          backgroundColor: labels.map(categoryColor),
          borderColor: css.getPropertyValue("--surface").trim(),
          borderWidth: 2,
        }],
      },
      options: {
        plugins: {
          legend: { position: "bottom", labels: { color: css.getPropertyValue("--ink").trim() } },
          tooltip: { callbacks: { label: (c) => ` ${c.label}: ${rupiah(c.parsed)}` } },
        },
      },
    });
  }

  function render() {
    renderTotal();
    renderList();
    renderChart();
  }

  // ---------- Events ----------
  $("#tx-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#item").value.trim();
    const amount = Number($("#amount").value);
    const category = $("#category").value;

    if (!name || !category || !($("#amount").value) || !(amount > 0)) {
      $("#form-error").textContent = "Fill in the item name, a valid amount, and a category.";
      return;
    }
    $("#form-error").textContent = "";

    state.transactions.unshift({ id: Date.now(), name, amount, category });
    save();
    render();
    $("#tx-form").reset();
    $("#item").focus();
  });

  $("#list").addEventListener("click", (e) => {
    const btn = e.target.closest(".del");
    if (!btn) return;
    state.transactions = state.transactions.filter((t) => String(t.id) !== btn.dataset.id);
    save();
    render();
  });

  $("#add-category").addEventListener("click", () => {
    const input = $("#new-category");
    const name = input.value.trim();
    if (!name) { $("#cat-error").textContent = "Enter a category name."; return; }
    if (state.categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      $("#cat-error").textContent = "That category already exists.";
      return;
    }
    $("#cat-error").textContent = "";
    state.categories.push(name);
    save();
    renderCategories();
    $("#category").value = name;
    input.value = "";
  });

  $("#limit").addEventListener("input", (e) => {
    state.limit = Math.max(0, Number(e.target.value) || 0);
    save();
    renderTotal();
    renderList();
  });

  $("#theme-toggle").addEventListener("click", () => {
    state.theme = currentTheme() === "dark" ? "light" : "dark";
    save();
    applyTheme();
  });

  // ---------- Init ----------
  $("#limit").value = state.limit || "";
  renderCategories();
  renderTotal();
  renderList();
  applyTheme();
})();
