!(function ($, e, t) {
  $(e).ready(function () {
    $("[data-background]").each(function () {
      var e = t.devicePixelRatio > 1,
        a = $(this).data("background");
      if (e) {
        var i = a.replace(".jpg", "@2x.jpg");
        $(this).css("background-image", "url(" + i + ")");
      } else $(this).css("background-image", "url(" + a + ")");
    }),
      $("[data-bg-color]").each(function () {
        var e = $(this).data("bg-color");
        $(this).css("background-color", e);
      }),
      $(".slider").flexslider({ directionNav: !1, controlNav: !0 }),
      $(".quote-slider").flexslider({
        directionNav: !0,
        controlNav: !1,
        prevText: "<i class='fa fa-caret-left'></i>",
        nextText: "<i class='fa fa-caret-right'></i>",
      });
    var e = $(".event-carousel");
    e.owlCarousel({
      autoPlay: 3e3,
      rewindNav: !1,
      items: 4,
      itemsDesktop: [1199, 3],
      itemsDesktopSmall: [979, 3],
    }),
      $("#event-next").click(function (t) {
        t.preventDefault(), e.trigger("owl.next");
      }),
      $("#event-prev").click(function (t) {
        t.preventDefault(), e.trigger("owl.prev");
      });
    var a = $(".filterable-items");
    a.imagesLoaded(function () {
      a.isotope({
        filter: "*",
        layoutMode: "fitRows",
        animationOptions: { duration: 750, easing: "linear", queue: !1 },
      });
    }),
      $(".filterable-nav a").click(function (e) {
        e.preventDefault(),
          $(".filterable-nav .current").removeClass("current"),
          $(this).addClass("current");
        var t = $(this).attr("data-filter");
        return (
          a.isotope({
            filter: t,
            animationOptions: { duration: 750, easing: "linear", queue: !1 },
          }),
          !1
        );
      }),
      $(".mobile-filter").change(function () {
        var e = $(this).val();
        return (
          a.isotope({
            filter: e,
            animationOptions: { duration: 750, easing: "linear", queue: !1 },
          }),
          !1
        );
      }),
      initLightbox({
        selector: ".filterable-item a",
        overlay: !0,
        closeButton: !0,
        arrow: !0,
      }),
      $(".mobile-menu").append($(".main-navigation .menu").clone()),
      $(".toggle-menu").click(function () {
        $(".mobile-menu").slideToggle();
      }),
      $(".map").length &&
        $(".map").gmap3(
          {
            map: { options: { maxZoom: 14, scrollwheel: !1 } },
            marker: { address: "40 Sibley St, Detroit" },
          },
          "autofit"
        );
  }),
    $(t).ready(function () {});
})(jQuery, document, window);
