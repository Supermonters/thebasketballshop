(async () => {
  const auth = await fetch("/admin/checkauth");
  if (!auth.ok) { location.href = "/admin/login.html"; return; }

  // ── Tab switching ──────────────────────────────────────────
  document.querySelectorAll(".sb-link").forEach(btn => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
      if (btn.dataset.tab === "players") loadShoeGallery();
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
    setRows("options-list", "options", "e.g. Black or M 9 / W 10.5", product.options);
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
      options: [...document.getElementsByClassName("options")].map(el => el.value).filter(Boolean),
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
    setRows("options-list", "options", "e.g. Black or M 9 / W 10.5", [""]);
  }

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

  // ── Boot ───────────────────────────────────────────────────
  loadProducts();
})();
