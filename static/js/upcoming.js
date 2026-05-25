(async () => {
    const grid = document.getElementById("upcoming-grid");
    try {
        const { releases } = await (await fetch("/upcoming-releases", { cache: "no-store" })).json();
        if (!releases.length) {
            grid.innerHTML = '<p class="upcoming-empty">No upcoming releases at the moment — check back soon.</p>';
            return;
        }
        grid.innerHTML = releases.map(function (r) {
            var d = new Date(r.releaseDate + "T00:00:00Z");
            var day   = d.getUTCDate();
            var month = d.toLocaleString("en-US", { month: "long",  timeZone: "UTC" });
            var year  = d.getUTCFullYear();
            var href   = r.linkUrl || "#";
            var target = r.linkUrl ? ' target="_blank" rel="noopener"' : "";
            return (
                '<div class="upcoming-card">' +
                    '<a href="' + href + '"' + target + ' class="event-img-link">' +
                        '<img src="' + r.imageUrl + '" alt="' + r.name.replace(/"/g, "&quot;") + '" class="event-img">' +
                    '</a>' +
                    '<div class="entry-date">' +
                        '<div class="date">' + day + '</div>' +
                        '<span class="month">' + month + ' ' + year + '</span>' +
                    '</div>' +
                    '<h2 class="entry-title">' +
                        '<a href="' + href + '"' + target + '>' + r.name + '</a>' +
                    '</h2>' +
                    '<p>' + (r.description || "") + '</p>' +
                '</div>'
            );
        }).join("");
    } catch (e) {
        grid.innerHTML = '<p class="upcoming-empty">Failed to load releases.</p>';
    }

    // Mobile menu
    (function ($) {
        $(document).ready(function () {
            $(".mobile-menu").append($(".main-navigation .menu").clone());
            $(".toggle-menu").click(function () { $(".mobile-menu").slideToggle(); });
        });
    })(jQuery);
})();
