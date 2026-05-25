(async () => {
    const f = await fetch("/productlist", { cache: "no-store" });
    const allProducts = (await f.json()).products;

    function parseVnd(str) {
        return parseInt(String(str || "0").replace(/\./g, ""), 10);
    }

    function formatUsd(str) {
        const vnd = parseVnd(str);
        if (isNaN(vnd) || vnd === 0) return str;
        const usdRaw = vnd / 25000;
        const usdMarketing = Math.ceil(usdRaw / 5) * 5 - 0.01;
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(usdMarketing);
    }

    function applyFilters() {
        const search   = document.getElementById("store-search").value.trim().toLowerCase();
        const category = document.getElementById("store-category").value;
        const sort     = document.getElementById("store-sort").value;

        let list = [...allProducts];
        if (search)   list = list.filter(p => p.name.toLowerCase().includes(search));
        if (category) list = list.filter(p => p.filter === category);

        list.sort((a, b) => {
            if (sort === "name-asc")    return a.name.localeCompare(b.name);
            if (sort === "name-desc")   return b.name.localeCompare(a.name);
            if (sort === "price-asc")   return parseVnd(a.price) - parseVnd(b.price);
            if (sort === "price-desc")  return parseVnd(b.price) - parseVnd(a.price);
            if (sort === "newest")      return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
            if (sort === "oldest")      return new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0);
            return 0;
        });

        renderProducts(list);
    }

    function renderProducts(products) {
        const grid = document.getElementById("store-grid");
        if (!products.length) {
            grid.innerHTML = '<p class="store-empty">No products match your filters.</p>';
            return;
        }
        grid.innerHTML = products.map(p => `
            <div class="store-card" data-filter="${p.filter}">
                <a href="/store_item?item=${encodeURIComponent(p.name)}" class="store-card-link">
                    <figure class="store-card-fig">
                        <img src="${p.mouseout}"
                             onmouseover="this.src='${p.mouseover}'"
                             onmouseout="this.src='${p.mouseout}'"
                             alt="${p.name}" class="store-card-img" loading="lazy">
                    </figure>
                    <div class="store-card-info">
                        <p class="store-card-name">${p.name}</p>
                        <p class="store-card-price">${formatUsd(p.price)}</p>
                    </div>
                </a>
            </div>`
        ).join("");
    }

    ["store-search", "store-category", "store-sort"].forEach(id => {
        document.getElementById(id).addEventListener("input", applyFilters);
    });

    applyFilters();

    // jQuery setup — mobile menu only (Isotope removed)
    (function ($, document, window) {
        $(document).ready(function () {
            $("[data-background]").each(function () {
                var retina = window.devicePixelRatio > 1;
                var bg = $(this).data("background");
                $(this).css("background-image", "url(" + (retina ? bg.replace(".jpg", "@2x.jpg") : bg) + ")");
            });
            $("[data-bg-color]").each(function () {
                $(this).css("background-color", $(this).data("bg-color"));
            });
            $(".mobile-menu").append($(".main-navigation .menu").clone());
            $(".toggle-menu").click(function () {
                $(".mobile-menu").slideToggle();
            });
        });
    })(jQuery, document, window);
})();
