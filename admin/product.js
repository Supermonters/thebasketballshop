(async () => {
  const auth = await fetch("/admin/checkauth");
  if (!auth.ok) { location.href = "/admin/login.html"; return; }

  // ── Tab switching ──────────────────────────────────────────
  document.querySelectorAll(".sb-link").forEach(btn => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
      if (btn.dataset.tab === "players")  loadShoeGallery();
      if (btn.dataset.tab === "upcoming") loadUpcomingReleases();
    });
  });

  function switchTab(tab) {
    document.querySelectorAll(".sb-link").forEach(b => {
      b.classList.toggle("active", b.dataset.tab === tab);
    });
    document.querySelectorAll(".tab").forEach(s => s.classList.remove("active"));
    document.getElementById("tab-" + tab).classList.add("active");
  }

  // ── Product drawer ─────────────────────────────────────────
  const drawer = document.getElementById("product-drawer");

  function openDrawer() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    resetProductForm();
  }

  document.getElementById("open-add-product").addEventListener("click", () => {
    resetProductForm();
    openDrawer();
  });

  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  document.getElementById("drawer-backdrop").addEventListener("click", closeDrawer);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });

  // ── Sign out ───────────────────────────────────────────────
  document.getElementById("signout").addEventListener("click", async () => {
    await fetch("/admin/logout", { method: "POST" });
    location.href = "/admin/login.html";
  });

  // ── Products ───────────────────────────────────────────────
  const FILTER_LABEL = {
    concert: { text: "Nike / Jordan", cls: "shoes-nike" },
    band:    { text: "Shoes — Other", cls: "shoes-other" },
    stuff:   { text: "Accessories",   cls: "accessories" },
  };
  let productsCache = [];
  let editingProductId = null;
  let selectedIds = new Set();

  function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function normalizeProductImage(src) {
    if (!src || /^(https?:)?\/\//i.test(src) || src.startsWith("/") || src.startsWith("data:")) return src;
    return "/" + src;
  }

  function getFilters() {
    return {
      search: document.getElementById("product-search").value.trim().toLowerCase(),
      category: document.getElementById("filter-category").value,
      sort: document.getElementById("filter-sort").value,
    };
  }

  function applyFilters() {
    const { search, category, sort } = getFilters();
    let list = [...productsCache];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search));
    if (category) list = list.filter(p => p.filter === category);
    list.sort((a, b) => {
      if (sort === "name-asc")        return a.name.localeCompare(b.name);
      if (sort === "name-desc")       return b.name.localeCompare(a.name);
      if (sort === "date-added-asc")  return new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0);
      if (sort === "date-added-desc") return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      if (sort === "date-mod-asc")    return new Date(a.dateModified || 0) - new Date(b.dateModified || 0);
      if (sort === "date-mod-desc")   return new Date(b.dateModified || 0) - new Date(a.dateModified || 0);
      return 0;
    });
    renderProducts(list);
  }

  function renderProducts(products) {
    const grid = document.getElementById("products-grid");
    if (!products.length) {
      grid.innerHTML = '<div class="loading-state">No products match the current filters.</div>';
      return;
    }
    grid.innerHTML = products.map(p => {
      const fl = FILTER_LABEL[p.filter] || { text: p.filter, cls: "" };
      const thumb = normalizeProductImage(p.mouseout || (Array.isArray(p.images) && p.images[0]) || p.cartpic || "");
      const fallbackThumb = normalizeProductImage(p.cartpic || (Array.isArray(p.images) && p.images[0]) || "");
      const checked = selectedIds.has(p.id) ? "checked" : "";
      const sel = selectedIds.has(p.id) ? " selected" : "";
      return `
        <div class="product-card${sel}" data-id="${p.id}">
          <label class="card-select-wrap">
            <input type="checkbox" class="card-checkbox" data-id="${p.id}" ${checked}>
            <span class="card-check-ui"></span>
          </label>
          <img class="product-thumb" src="${thumb}" alt="${p.name}" loading="lazy"
               onerror="this.onerror=null; this.src='${fallbackThumb}'; this.style.opacity='1'">
          <div class="product-body">
            <div class="product-name">${p.name}</div>
            <div class="product-meta">
              <span class="product-price">${p.price}</span>
              <span class="filter-badge ${fl.cls}">${fl.text}</span>
            </div>
            <div class="product-dates">
              <span>Added ${fmtDate(p.dateAdded)}</span>
              <span class="date-sep">·</span>
              <span>Modified ${fmtDate(p.dateModified)}</span>
            </div>
            <div class="product-actions">
              <button type="button" class="btn-edit" data-id="${p.id}">Edit</button>
              <button type="button" class="btn-delete" data-id="${p.id}">Delete</button>
            </div>
          </div>
        </div>`;
    }).join("");

    grid.querySelectorAll(".card-checkbox").forEach(cb => {
      cb.addEventListener("change", () => {
        const id = parseInt(cb.dataset.id, 10);
        if (cb.checked) selectedIds.add(id); else selectedIds.delete(id);
        cb.closest(".product-card").classList.toggle("selected", cb.checked);
        syncSelectAllCheckbox();
        updateDeleteSelectedBtn();
      });
    });
    grid.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", () => editProduct(parseInt(btn.dataset.id, 10)));
    });
    grid.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", () => deleteProduct(parseInt(btn.dataset.id, 10)));
    });

    syncSelectAllCheckbox();
    updateDeleteSelectedBtn();
  }

  async function loadProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = '<div class="loading-state">Loading products…</div>';
    const { products } = await (await fetch("/admin/products", { cache: "no-store" })).json();
    productsCache = products;
    document.getElementById("product-count").textContent = products.length;
    selectedIds.clear();
    applyFilters();
  }

  // Filter bar events
  ["product-search", "filter-category", "filter-sort"].forEach(id => {
    document.getElementById(id).addEventListener("input", applyFilters);
  });

  // Select all checkbox
  document.getElementById("select-all-checkbox").addEventListener("change", function () {
    const visible = [...document.querySelectorAll(".card-checkbox")];
    visible.forEach(cb => {
      const id = parseInt(cb.dataset.id, 10);
      cb.checked = this.checked;
      if (this.checked) selectedIds.add(id); else selectedIds.delete(id);
      cb.closest(".product-card").classList.toggle("selected", this.checked);
    });
    updateDeleteSelectedBtn();
  });

  function syncSelectAllCheckbox() {
    const all = [...document.querySelectorAll(".card-checkbox")];
    const selAll = document.getElementById("select-all-checkbox");
    if (!all.length) { selAll.checked = false; selAll.indeterminate = false; return; }
    const checkedCount = all.filter(cb => cb.checked).length;
    selAll.checked = checkedCount === all.length;
    selAll.indeterminate = checkedCount > 0 && checkedCount < all.length;
  }

  function updateDeleteSelectedBtn() {
    const btn = document.getElementById("delete-selected");
    const count = selectedIds.size;
    const countEl = document.getElementById("delete-selected-count");
    if (count > 0) {
      btn.classList.remove("hidden");
      countEl.textContent = `(${count})`;
    } else {
      btn.classList.add("hidden");
      countEl.textContent = "";
    }
  }

  // Delete selected
  document.getElementById("delete-selected").addEventListener("click", async () => {
    const ids = [...selectedIds];
    if (!ids.length) return;
    const { isConfirmed } = await Swal.fire({
      title: `Delete ${ids.length} product${ids.length > 1 ? "s" : ""}?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete All",
      confirmButtonColor: "#e53935",
      cancelButtonColor: "#333",
      background: "#141414",
      color: "#e8e8e8",
    });
    if (!isConfirmed) return;
    const r = await fetch("/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (r.ok) {
      selectedIds.clear();
      loadProducts();
    } else {
      Swal.fire({ icon: "error", title: "Failed to delete", background: "#141414", color: "#e8e8e8" });
    }
  });

  function editProduct(id) {
    const product = productsCache.find(p => p.id === id);
    if (!product) return;
    editingProductId = id;
    document.getElementById("form-title").textContent = "Edit Product";
    document.getElementById("form-subtitle").textContent = "Update product details, image paths, gallery images, and options.";
    document.getElementById("submit-product").textContent = "Save Changes";
    document.getElementById("cancel-edit").classList.remove("hidden");

    document.getElementById("proname").value = product.name || "";
    document.getElementById("alt").value = product.alt || "";
    document.getElementById("price").value = product.price || "";
    document.getElementById("filter").value = product.filter || "concert";
    document.getElementById("banner").value = product.banner || "";
    document.getElementById("cartpic").value = product.cartpic || "";
    document.getElementById("mouseoverpic").value = product.mouseover || "";
    document.getElementById("mouseoutpic").value = product.mouseout || "";
    setRows("images-list", "images", "Image URL", product.images);
    setOptionRows(product.options);
    openDrawer();
    drawer.querySelector(".drawer-body").scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id) {
    const product = productsCache.find(p => p.id === id);
    const { isConfirmed } = await Swal.fire({
      title: "Delete product?",
      text: product?.name || "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#e53935",
      cancelButtonColor: "#333",
      background: "#141414",
      color: "#e8e8e8",
    });
    if (!isConfirmed) return;
    const r = await fetch(`/admin/products/${id}`, { method: "DELETE" });
    if (r.ok) {
      selectedIds.delete(id);
      loadProducts();
    } else {
      Swal.fire({ icon: "error", title: "Failed to delete", background: "#141414", color: "#e8e8e8" });
    }
  }

  // ── Shoe Gallery ───────────────────────────────────────────
  let shoeGalleryLoaded = false;
  let shoeGalleryCache = [];
  let editingShoeRank = null;

  async function loadShoeGallery(force = false) {
    if (shoeGalleryLoaded && !force) return;
    shoeGalleryLoaded = true;

    const list = document.getElementById("shoe-gallery-list");
    list.innerHTML = '<div class="loading-state">Loading shoe gallery…</div>';
    const { players } = await (await fetch("/admin/shoe-gallery", { cache: "no-store" })).json();
    shoeGalleryCache = players;

    if (!players.length) {
      list.innerHTML = '<div class="loading-state">No shoe gallery data available.</div>';
      return;
    }

    list.innerHTML = players.map(p => {
      const avatarSrc = p.avatar || `https://cdn.nba.com/headshots/nba/latest/260x190/${p.id}.png`;
      return `
        <div class="shoe-gallery-row" data-rank="${p.rank}">
          <span class="shoe-gallery-rank">#${p.rank}</span>
          <img class="shoe-gallery-thumb shoe-gallery-avatar" src="${avatarSrc}" alt="${p.name}" onerror="this.style.opacity='0.2'">
          <div>
            <div class="shoe-gallery-name">${p.name}</div>
            <div class="shoe-gallery-detail">${p.team} · ${p.brand} · ${p.shoe} · ${p.shoeImgs?.length || 0} images</div>
          </div>
          <button type="button" class="btn-edit" data-rank="${p.rank}">Edit</button>
        </div>`;
    }).join("");

    list.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", () => editShoeGalleryItem(parseInt(btn.dataset.rank, 10)));
    });
  }

  function editShoeGalleryItem(rank) {
    const item = shoeGalleryCache.find(p => p.rank === rank);
    if (!item) return;
    editingShoeRank = rank;
    document.getElementById("shoe-rank").value = item.rank || "";
    document.getElementById("shoe-player-name").value = item.name || "";
    document.getElementById("shoe-avatar").value = item.avatar || `https://cdn.nba.com/headshots/nba/latest/260x190/${item.id}.png`;
    document.getElementById("shoe-team").value = item.team || "";
    document.getElementById("shoe-player-id").value = item.id || "";
    document.getElementById("shoe-name").value = item.shoe || "";
    document.getElementById("shoe-brand").value = item.brand || "";
    document.getElementById("shoe-free-agent").value = item.freeAgent ? "true" : "false";
    setShoeImageRows(item.shoeImgs || []);
    document.getElementById("shoe-gallery-form").classList.remove("hidden");
    document.getElementById("shoe-gallery-form").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setShoeImageRows(imgs) {
    const list = document.getElementById("shoe-images-list");
    list.innerHTML = "";
    const rows = Array.isArray(imgs) && imgs.length ? imgs : [{ name: "", url: "" }];
    rows.forEach(img => {
      const url = typeof img === "string" ? img : (img.url || "");
      const name = typeof img === "string" ? "" : (img.name || "");
      addShoeImgRow(name, url);
    });
  }

  window.addShoeImgRow = (name = "", url = "") => {
    const row = document.createElement("div");
    row.className = "multi-row shoe-img-row";
    row.innerHTML = `
      <input type="text" class="field-input shoe-img-name" placeholder="Colorway name" aria-label="Colorway name" value="${escapeAttr(name)}">
      <input type="text" class="field-input shoe-img-url" placeholder="Image URL" aria-label="Image URL" value="${escapeAttr(url)}">
      <button type="button" class="btn-remove-row" onclick="removeRow(this)" aria-label="Remove">✕</button>`;
    document.getElementById("shoe-images-list").appendChild(row);
  };

  document.getElementById("add-shoe-img-row").addEventListener("click", () => addShoeImgRow());

  document.getElementById("shoe-gallery-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (editingShoeRank === null) return;
    const shoeImgs = [...document.querySelectorAll("#shoe-images-list .shoe-img-row")].map(row => ({
      name: row.querySelector(".shoe-img-name").value.trim(),
      url:  row.querySelector(".shoe-img-url").value.trim(),
    })).filter(img => img.url);

    if (!shoeImgs.length) {
      Swal.fire({ icon: "error", title: "Add at least one image", background: "#141414", color: "#e8e8e8" });
      return;
    }
    const body = {
      rank:      parseInt(document.getElementById("shoe-rank").value, 10),
      name:      document.getElementById("shoe-player-name").value,
      avatar:    document.getElementById("shoe-avatar").value.trim(),
      team:      document.getElementById("shoe-team").value,
      id:        document.getElementById("shoe-player-id").value,
      shoe:      document.getElementById("shoe-name").value,
      brand:     document.getElementById("shoe-brand").value,
      freeAgent: document.getElementById("shoe-free-agent").value === "true",
      shoeImgs,
    };
    const r = await fetch(`/admin/shoe-gallery/${editingShoeRank}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      await Swal.fire({ icon: "success", title: "Gallery item updated!", showConfirmButton: false, timer: 1400, background: "#141414", color: "#e8e8e8" });
      resetShoeGalleryForm();
      shoeGalleryLoaded = false;
      loadShoeGallery(true);
    } else {
      Swal.fire({ icon: "error", title: "Failed to update gallery item", background: "#141414", color: "#e8e8e8" });
    }
  });

  document.getElementById("cancel-shoe-edit").addEventListener("click", resetShoeGalleryForm);

  function resetShoeGalleryForm() {
    editingShoeRank = null;
    document.getElementById("shoe-gallery-form").reset();
    document.getElementById("shoe-images-list").innerHTML = "";
    document.getElementById("shoe-gallery-form").classList.add("hidden");
  }

  // ── Add Product form ───────────────────────────────────────
  document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = getProductFormData();
    if (!body.images.length) {
      Swal.fire({ icon: "error", title: "Add at least one image", background: "#141414", color: "#e8e8e8" }); return;
    }
    if (!body.options.length) {
      Swal.fire({ icon: "error", title: "Add at least one option", background: "#141414", color: "#e8e8e8" }); return;
    }
    const isEditing = editingProductId !== null;
    const r = await fetch(isEditing ? `/admin/products/${editingProductId}` : "/admin/addproduct", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      await Swal.fire({ icon: "success", title: isEditing ? "Product updated!" : "Product added!", showConfirmButton: false, timer: 1400, background: "#141414", color: "#e8e8e8" });
      closeDrawer();
      loadProducts();
    } else {
      Swal.fire({ icon: "error", title: isEditing ? "Failed to update product" : "Failed to add product", background: "#141414", color: "#e8e8e8" });
    }
  });

  document.getElementById("cancel-edit").addEventListener("click", closeDrawer);

  function getProductFormData() {
    return {
      name:      document.getElementById("proname").value,
      alt:       document.getElementById("alt").value,
      banner:    document.getElementById("banner").value,
      price:     document.getElementById("price").value,
      filter:    document.getElementById("filter").value,
      mouseover: document.getElementById("mouseoverpic").value,
      mouseout:  document.getElementById("mouseoutpic").value,
      cartpic:   document.getElementById("cartpic").value,
      images: [...document.getElementsByClassName("images")].map(el => el.value).filter(Boolean),
      options: [...document.querySelectorAll("#options-list .option-row")].map(row => ({
        size: row.querySelector(".option-size").value.trim(),
        oos:  row.querySelector(".option-oos").checked,
      })).filter(o => o.size),
    };
  }

  function resetProductForm() {
    editingProductId = null;
    document.getElementById("form-title").textContent = "Add Product";
    document.getElementById("form-subtitle").textContent = "Fill in all fields to add a new item to the store.";
    document.getElementById("submit-product").textContent = "Add Product";
    document.getElementById("cancel-edit").classList.add("hidden");
    document.getElementById("add-form").reset();
    setRows("images-list", "images", "Image URL", [""]);
    setOptionRows([]);
  }

  // ── Option rows (size + OOS toggle) ───────────────────────
  const SHOE_SIZES = [
    'M 3.5 / W 5',  'M 4 / W 5.5',  'M 4.5 / W 6',  'M 5 / W 6.5',
    'M 5.5 / W 7',  'M 6 / W 7.5',  'M 6.5 / W 8',  'M 7 / W 8.5',
    'M 7.5 / W 9',  'M 8 / W 9.5',  'M 8.5 / W 10', 'M 9 / W 10.5',
    'M 9.5 / W 11', 'M 10 / W 11.5','M 10.5 / W 12','M 11 / W 12.5',
    'M 11.5 / W 13','M 12 / W 13.5','M 12.5 / W 14','M 13 / W 14.5',
    'M 13.5 / W 15','M 14 / W 15.5','M 15 / W 16.5','M 16 / W 17.5',
    'M 17 / W 18.5','M 18 / W 19.5',
  ];

  window.addOptionRow = (size = "", oos = false) => {
    const row = document.createElement("div");
    row.className = "multi-row option-row";
    row.innerHTML = `
      <input type="text" class="field-input option-size" placeholder="M 9 / W 10.5 or Black" aria-label="Option" value="${escapeAttr(size)}">
      <label class="oos-toggle" title="Toggle Out of Stock">
        <input type="checkbox" class="option-oos"${oos ? " checked" : ""}>
        <span class="oos-pill">OOS</span>
      </label>
      <button type="button" class="btn-remove-row" onclick="removeRow(this)" aria-label="Remove">✕</button>`;
    document.getElementById("options-list").appendChild(row);
  };

  function setOptionRows(values) {
    document.getElementById("options-list").innerHTML = "";
    const rows = Array.isArray(values) && values.length ? values : [{ size: "", oos: false }];
    rows.forEach(v => {
      const size = typeof v === "string" ? v : (v.size || "");
      const oos  = typeof v === "string" ? false : (v.oos || false);
      addOptionRow(size, oos);
    });
  }

  document.getElementById("add-option-row").addEventListener("click", () => addOptionRow());

  document.getElementById("fill-shoe-sizes").addEventListener("click", async () => {
    const existing = [...document.querySelectorAll("#options-list .option-row")];
    const hasData = existing.some(r => r.querySelector(".option-size").value.trim());
    if (hasData) {
      const { isConfirmed } = await Swal.fire({
        title: "Replace current options?",
        text: "This will overwrite all existing options with the standard M/W shoe size chart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Replace",
        confirmButtonColor: "#fd5927",
        cancelButtonColor: "#333",
        background: "#141414",
        color: "#e8e8e8",
      });
      if (!isConfirmed) return;
    }
    document.getElementById("options-list").innerHTML = "";
    SHOE_SIZES.forEach(s => addOptionRow(s, false));
  });

  // ── Multi-row helpers (global so onclick= works) ───────────
  window.addRow = (listId, cls, placeholder) => {
    const row = document.createElement("div");
    row.className = "multi-row";
    row.innerHTML = `
      <input type="text" class="field-input ${cls}" placeholder="${placeholder}" aria-label="${placeholder}">
      <button type="button" class="btn-remove-row" onclick="removeRow(this)" aria-label="Remove">✕</button>`;
    document.getElementById(listId).appendChild(row);
  };

  function setRows(listId, cls, placeholder, values = [""]) {
    const rows = Array.isArray(values) && values.length ? values : [""];
    document.getElementById(listId).innerHTML = rows.map(value => `
      <div class="multi-row">
        <input type="text" class="field-input ${cls}" placeholder="${placeholder}" aria-label="${placeholder}" value="${escapeAttr(value || "")}">
        <button type="button" class="btn-remove-row" onclick="removeRow(this)" aria-label="Remove">✕</button>
      </div>`).join("");
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  window.removeRow = (btn) => {
    const list = btn.closest(".multi-list");
    if (list.querySelectorAll(".multi-row").length > 1) btn.closest(".multi-row").remove();
  };

  // ── Upcoming Releases ──────────────────────────────────────
  let upcomingCache = [];
  let editingUpcomingId = null;

  function fmtRelDate(iso) {
    if (!iso) return { day: "—", month: "—" };
    const d = new Date(iso + "T00:00:00Z");
    return {
      day:   d.getUTCDate(),
      month: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      year:  d.getUTCFullYear(),
    };
  }

  async function loadUpcomingReleases() {
    const list = document.getElementById("upcoming-list");
    list.innerHTML = '<div class="loading-state">Loading releases…</div>';
    let releases;
    try {
      const res = await fetch("/admin/upcoming-releases", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      ({ releases } = await res.json());
    } catch (err) {
      list.innerHTML = '<div class="loading-state">Failed to load — check the server is running.</div>';
      return;
    }
    upcomingCache = releases;
    document.getElementById("upcoming-count").textContent = releases.length;

    if (!releases.length) {
      list.innerHTML = '<div class="loading-state">No releases yet — add one above.</div>';
      return;
    }

    list.innerHTML = releases.map(r => {
      const { day, month, year } = fmtRelDate(r.releaseDate);
      return `
        <div class="shoe-gallery-row" data-id="${r.id}">
          <div class="upcoming-date-badge">
            <span class="up-day">${day}</span>
            <span class="up-month">${month} ${year}</span>
          </div>
          <img class="upcoming-thumb" src="${r.imageUrl}" alt="${r.name}" onerror="this.style.opacity='0.2'">
          <div>
            <div class="shoe-gallery-name">${r.name}</div>
            <div class="shoe-gallery-detail">${r.description ? r.description.slice(0, 80) + (r.description.length > 80 ? "…" : "") : "No description"}</div>
          </div>
          <div style="display:flex;gap:8px">
            <button type="button" class="btn-edit" data-id="${r.id}">Edit</button>
            <button type="button" class="btn-delete up-delete" data-id="${r.id}">Delete</button>
          </div>
        </div>`;
    }).join("");

    list.querySelectorAll(".btn-edit").forEach(btn =>
      btn.addEventListener("click", () => editUpcoming(parseInt(btn.dataset.id, 10)))
    );
    list.querySelectorAll(".up-delete").forEach(btn =>
      btn.addEventListener("click", () => deleteUpcoming(parseInt(btn.dataset.id, 10)))
    );
  }

  function openUpcomingForm() {
    document.getElementById("upcoming-form").classList.remove("hidden");
    document.getElementById("upcoming-form").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetUpcomingForm() {
    editingUpcomingId = null;
    document.getElementById("upcoming-form").reset();
    document.getElementById("up-id").value = "";
    document.getElementById("up-submit").textContent = "Save Release";
    document.getElementById("upcoming-form").classList.add("hidden");
  }

  function editUpcoming(id) {
    const item = upcomingCache.find(r => r.id === id);
    if (!item) return;
    editingUpcomingId = id;
    document.getElementById("up-id").value = id;
    document.getElementById("up-name").value = item.name || "";
    document.getElementById("up-date").value = item.releaseDate || "";
    document.getElementById("up-link").value = item.linkUrl || "";
    document.getElementById("up-image").value = item.imageUrl || "";
    document.getElementById("up-desc").value = item.description || "";
    document.getElementById("up-submit").textContent = "Save Changes";
    openUpcomingForm();
  }

  async function deleteUpcoming(id) {
    const item = upcomingCache.find(r => r.id === id);
    const { isConfirmed } = await Swal.fire({
      title: "Delete release?",
      text: item?.name || "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#e53935",
      cancelButtonColor: "#333",
      background: "#141414",
      color: "#e8e8e8",
    });
    if (!isConfirmed) return;
    const r = await fetch(`/admin/upcoming-releases/${id}`, { method: "DELETE" });
    if (r.ok) {
      loadUpcomingReleases();
    } else {
      Swal.fire({ icon: "error", title: "Failed to delete", background: "#141414", color: "#e8e8e8" });
    }
  }

  document.getElementById("open-add-upcoming").addEventListener("click", () => {
    resetUpcomingForm();
    openUpcomingForm();
  });

  document.getElementById("up-cancel").addEventListener("click", resetUpcomingForm);

  document.getElementById("upcoming-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      name:        document.getElementById("up-name").value.trim(),
      releaseDate: document.getElementById("up-date").value,
      linkUrl:     document.getElementById("up-link").value.trim(),
      imageUrl:    document.getElementById("up-image").value.trim(),
      description: document.getElementById("up-desc").value.trim(),
    };
    const isEditing = editingUpcomingId !== null;
    const url = isEditing ? `/admin/upcoming-releases/${editingUpcomingId}` : "/admin/upcoming-releases";
    const r = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      await Swal.fire({ icon: "success", title: isEditing ? "Release updated!" : "Release added!", showConfirmButton: false, timer: 1400, background: "#141414", color: "#e8e8e8" });
      resetUpcomingForm();
      loadUpcomingReleases();
    } else {
      Swal.fire({ icon: "error", title: isEditing ? "Failed to update" : "Failed to add", background: "#141414", color: "#e8e8e8" });
    }
  });

  // ── Boot ───────────────────────────────────────────────────
  loadProducts();
})();
