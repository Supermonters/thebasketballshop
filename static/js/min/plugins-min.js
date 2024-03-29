function initLightbox(t) {
  var e = function () {
    $('<div id="imagelightbox-loading"><div></div></div>').appendTo("body");
  },
    n = function () {
      $("#imagelightbox-loading").remove();
    },
    i = function () {
      $('<div id="imagelightbox-overlay"></div>').appendTo("body");
    },
    o = function () {
      $("#imagelightbox-overlay").remove();
    },
    s = function (t) {
      $(
        '<button type="button" id="imagelightbox-close" title="Close"></button>'
      )
        .appendTo("body")
        .on("click touchend", function () {
          return $(this).remove(), t.quitImageLightbox(), !1;
        });
    },
    a = function () {
      $("#imagelightbox-close").remove();
    },
    r = function () {
      var t = $('a[href="' + $("#imagelightbox").attr("src") + '"] img').attr(
        "alt"
      );
      t.length > 0 &&
        $('<div id="imagelightbox-caption">' + t + "</div>").appendTo("body");
    },
    l = function () {
      $("#imagelightbox-caption").remove();
    },
    u = function (t, e) {
      var n = $(e);
      if (n.length) {
        for (
          var i = $('<div id="imagelightbox-nav"></div>'), o = 0;
          o < n.length;
          o++
        )
          i.append('<button type="button"></button>');
        i.appendTo("body"),
          i.on("click touchend", function () {
            return !1;
          });
        var s = i.find("button");
        s.on("click touchend", function () {
          var e = $(this);
          return (
            n.eq(e.index()).attr("href") !== $("#imagelightbox").attr("src") &&
            t.switchImageLightbox(e.index()),
            s.removeClass("active"),
            s.eq(e.index()).addClass("active"),
            !1
          );
        }).on("touchend", function () {
          return !1;
        });
      }
    },
    c = function (t) {
      var e = $("#imagelightbox-nav button");
      e.removeClass("active"),
        e
          .eq(
            $(t)
              .filter('[href="' + $("#imagelightbox").attr("src") + '"]')
              .index(t)
          )
          .addClass("active");
    },
    d = function () {
      $("#imagelightbox-nav").remove();
    },
    p = function (t, e) {
      var n = $(
        '<button type="button" class="imagelightbox-arrow imagelightbox-arrow-left"></button><button type="button" class="imagelightbox-arrow imagelightbox-arrow-right"></button>'
      );
      n.appendTo("body"),
        n.on("click touchend", function (n) {
          n.preventDefault();
          var i = $(this),
            o = $(e + '[href="' + $("#imagelightbox").attr("src") + '"]'),
            s = o.index(e);
          return (
            i.hasClass("imagelightbox-arrow-left")
              ? ((s -= 1), $(e).eq(s).length || (s = $(e).length))
              : ((s += 1), $(e).eq(s).length || (s = 0)),
            t.switchImageLightbox(s),
            !1
          );
        });
    },
    h = function () {
      $(".imagelightbox-arrow").remove();
    },
    f = { overlay: !0, closeButton: !0, arrow: !0, selector: "" },
    m = $.extend({}, f, t || {}),
    v = $(m.selector).imageLightbox({
      onStart: function () {
        m.overlay && i(), m.closeButton && s(v), m.arrow && p(v, m.selector);
      },
      onEnd: function () {
        m.overlay && o(), m.closeButton && a(), m.arrow && h(), l(), n();
      },
      onLoadStart: function () {
        l(), e();
      },
      onLoadEnd: function () {
        r(), n(), $(".imagelightbox-arrow").css("display", "block");
      },
    });
}
!(function (t) {
  (t.flexslider = function (e, n) {
    var i = t(e);
    i.vars = t.extend({}, t.flexslider.defaults, n);
    var o,
      s = i.vars.namespace,
      a =
        window.navigator &&
        window.navigator.msPointerEnabled &&
        window.MSGesture,
      r =
        ("ontouchstart" in window ||
          a ||
          (window.DocumentTouch && document instanceof DocumentTouch)) &&
        i.vars.touch,
      l = "click touchend MSPointerUp",
      u = "",
      c = "vertical" === i.vars.direction,
      d = i.vars.reverse,
      p = i.vars.itemWidth > 0,
      h = "fade" === i.vars.animation,
      f = "" !== i.vars.asNavFor,
      m = {},
      v = !0;
    t.data(e, "flexslider", i),
      (m = {
        init: function () {
          (i.animating = !1),
            (i.currentSlide = parseInt(
              i.vars.startAt ? i.vars.startAt : 0,
              10
            )),
            isNaN(i.currentSlide) && (i.currentSlide = 0),
            (i.animatingTo = i.currentSlide),
            (i.atEnd = 0 === i.currentSlide || i.currentSlide === i.last),
            (i.containerSelector = i.vars.selector.substr(
              0,
              i.vars.selector.search(" ")
            )),
            (i.slides = t(i.vars.selector, i)),
            (i.container = t(i.containerSelector, i)),
            (i.count = i.slides.length),
            (i.syncExists = t(i.vars.sync).length > 0),
            "slide" === i.vars.animation && (i.vars.animation = "swing"),
            (i.prop = c ? "top" : "marginLeft"),
            (i.args = {}),
            (i.manualPause = !1),
            (i.stopped = !1),
            (i.started = !1),
            (i.startTimeout = null),
            (i.transitions =
              !i.vars.video &&
              !h &&
              i.vars.useCSS &&
              (function () {
                var t = document.createElement("div"),
                  e = [
                    "perspectiveProperty",
                    "WebkitPerspective",
                    "MozPerspective",
                    "OPerspective",
                    "msPerspective",
                  ];
                for (var n in e)
                  if (void 0 !== t.style[e[n]])
                    return (
                      (i.pfx = e[n].replace("Perspective", "").toLowerCase()),
                      (i.prop = "-" + i.pfx + "-transform"),
                      !0
                    );
                return !1;
              })()),
            (i.ensureAnimationEnd = ""),
            "" !== i.vars.controlsContainer &&
            (i.controlsContainer =
              t(i.vars.controlsContainer).length > 0 &&
              t(i.vars.controlsContainer)),
            "" !== i.vars.manualControls &&
            (i.manualControls =
              t(i.vars.manualControls).length > 0 &&
              t(i.vars.manualControls)),
            i.vars.randomize &&
            (i.slides.sort(function () {
              return Math.round(Math.random()) - 0.5;
            }),
              i.container.empty().append(i.slides)),
            i.doMath(),
            i.setup("init"),
            i.vars.controlNav && m.controlNav.setup(),
            i.vars.directionNav && m.directionNav.setup(),
            i.vars.keyboard &&
            (1 === t(i.containerSelector).length ||
              i.vars.multipleKeyboard) &&
            t(document).bind("keyup", function (t) {
              var e = t.keyCode;
              if (!i.animating && (39 === e || 37 === e)) {
                var n =
                  39 === e
                    ? i.getTarget("next")
                    : 37 === e
                      ? i.getTarget("prev")
                      : !1;
                i.flexAnimate(n, i.vars.pauseOnAction);
              }
            }),
            i.vars.mousewheel &&
            i.bind("mousewheel", function (t, e) {
              t.preventDefault();
              var n = i.getTarget(0 > e ? "next" : "prev");
              i.flexAnimate(n, i.vars.pauseOnAction);
            }),
            i.vars.pausePlay && m.pausePlay.setup(),
            i.vars.slideshow &&
            i.vars.pauseInvisible &&
            m.pauseInvisible.init(),
            i.vars.slideshow &&
            (i.vars.pauseOnHover &&
              i.hover(
                function () {
                  i.manualPlay || i.manualPause || i.pause();
                },
                function () {
                  i.manualPause || i.manualPlay || i.stopped || i.play();
                }
              ),
              (i.vars.pauseInvisible && m.pauseInvisible.isHidden()) ||
              (i.vars.initDelay > 0
                ? (i.startTimeout = setTimeout(i.play, i.vars.initDelay))
                : i.play())),
            f && m.asNav.setup(),
            r && i.vars.touch && m.touch(),
            (!h || (h && i.vars.smoothHeight)) &&
            t(window).bind("resize orientationchange focus", m.resize),
            i.find("img").attr("draggable", "false"),
            setTimeout(function () {
              i.vars.start(i);
            }, 200);
        },
        asNav: {
          setup: function () {
            (i.asNav = !0),
              (i.animatingTo = Math.floor(i.currentSlide / i.move)),
              (i.currentItem = i.currentSlide),
              i.slides
                .removeClass(s + "active-slide")
                .eq(i.currentItem)
                .addClass(s + "active-slide"),
              a
                ? ((e._slider = i),
                  i.slides.each(function () {
                    var e = this;
                    (e._gesture = new MSGesture()),
                      (e._gesture.target = e),
                      e.addEventListener(
                        "MSPointerDown",
                        function (t) {
                          t.preventDefault(),
                            t.currentTarget._gesture &&
                            t.currentTarget._gesture.addPointer(t.pointerId);
                        },
                        !1
                      ),
                      e.addEventListener("MSGestureTap", function (e) {
                        e.preventDefault();
                        var n = t(this),
                          o = n.index();
                        t(i.vars.asNavFor).data("flexslider").animating ||
                          n.hasClass("active") ||
                          ((i.direction = i.currentItem < o ? "next" : "prev"),
                            i.flexAnimate(o, i.vars.pauseOnAction, !1, !0, !0));
                      });
                  }))
                : i.slides.on(l, function (e) {
                  e.preventDefault();
                  var n = t(this),
                    o = n.index(),
                    a = n.offset().left - t(i).scrollLeft();
                  0 >= a && n.hasClass(s + "active-slide")
                    ? i.flexAnimate(i.getTarget("prev"), !0)
                    : t(i.vars.asNavFor).data("flexslider").animating ||
                    n.hasClass(s + "active-slide") ||
                    ((i.direction = i.currentItem < o ? "next" : "prev"),
                      i.flexAnimate(o, i.vars.pauseOnAction, !1, !0, !0));
                });
          },
        },
        controlNav: {
          setup: function () {
            i.manualControls
              ? m.controlNav.setupManual()
              : m.controlNav.setupPaging();
          },
          setupPaging: function () {
            var e,
              n,
              o =
                "thumbnails" === i.vars.controlNav
                  ? "control-thumbs"
                  : "control-paging",
              a = 1;
            if (
              ((i.controlNavScaffold = t(
                '<ol class="' + s + "control-nav " + s + o + '"></ol>'
              )),
                i.pagingCount > 1)
            )
              for (var r = 0; r < i.pagingCount; r++) {
                if (
                  ((n = i.slides.eq(r)),
                    (e =
                      "thumbnails" === i.vars.controlNav
                        ? '<img src="' + n.attr("data-thumb") + '"/>'
                        : "<a>" + a + "</a>"),
                    "thumbnails" === i.vars.controlNav &&
                    !0 === i.vars.thumbCaptions)
                ) {
                  var c = n.attr("data-thumbcaption");
                  "" != c &&
                    void 0 != c &&
                    (e += '<span class="' + s + 'caption">' + c + "</span>");
                }
                i.controlNavScaffold.append("<li>" + e + "</li>"), a++;
              }
            i.controlsContainer
              ? t(i.controlsContainer).append(i.controlNavScaffold)
              : i.append(i.controlNavScaffold),
              m.controlNav.set(),
              m.controlNav.active(),
              i.controlNavScaffold.delegate("a, img", l, function (e) {
                if ((e.preventDefault(), "" === u || u === e.type)) {
                  var n = t(this),
                    o = i.controlNav.index(n);
                  n.hasClass(s + "active") ||
                    ((i.direction = o > i.currentSlide ? "next" : "prev"),
                      i.flexAnimate(o, i.vars.pauseOnAction));
                }
                "" === u && (u = e.type), m.setToClearWatchedEvent();
              });
          },
          setupManual: function () {
            (i.controlNav = i.manualControls),
              m.controlNav.active(),
              i.controlNav.bind(l, function (e) {
                if ((e.preventDefault(), "" === u || u === e.type)) {
                  var n = t(this),
                    o = i.controlNav.index(n);
                  n.hasClass(s + "active") ||
                    ((i.direction = o > i.currentSlide ? "next" : "prev"),
                      i.flexAnimate(o, i.vars.pauseOnAction));
                }
                "" === u && (u = e.type), m.setToClearWatchedEvent();
              });
          },
          set: function () {
            var e = "thumbnails" === i.vars.controlNav ? "img" : "a";
            i.controlNav = t(
              "." + s + "control-nav li " + e,
              i.controlsContainer ? i.controlsContainer : i
            );
          },
          active: function () {
            i.controlNav
              .removeClass(s + "active")
              .eq(i.animatingTo)
              .addClass(s + "active");
          },
          update: function (e, n) {
            i.pagingCount > 1 && "add" === e
              ? i.controlNavScaffold.append(
                t("<li><a>" + i.count + "</a></li>")
              )
              : 1 === i.pagingCount
                ? i.controlNavScaffold.find("li").remove()
                : i.controlNav.eq(n).closest("li").remove(),
              m.controlNav.set(),
              i.pagingCount > 1 && i.pagingCount !== i.controlNav.length
                ? i.update(n, e)
                : m.controlNav.active();
          },
        },
        directionNav: {
          setup: function () {
            var e = t(
              '<ul class="' +
              s +
              'direction-nav"><li><a class="' +
              s +
              'prev" href="#">' +
              i.vars.prevText +
              '</a></li><li><a class="' +
              s +
              'next" href="#">' +
              i.vars.nextText +
              "</a></li></ul>"
            );
            i.controlsContainer
              ? (t(i.controlsContainer).append(e),
                (i.directionNav = t(
                  "." + s + "direction-nav li a",
                  i.controlsContainer
                )))
              : (i.append(e),
                (i.directionNav = t("." + s + "direction-nav li a", i))),
              m.directionNav.update(),
              i.directionNav.bind(l, function (e) {
                e.preventDefault();
                var n;
                ("" === u || u === e.type) &&
                  ((n = i.getTarget(
                    t(this).hasClass(s + "next") ? "next" : "prev"
                  )),
                    i.flexAnimate(n, i.vars.pauseOnAction)),
                  "" === u && (u = e.type),
                  m.setToClearWatchedEvent();
              });
          },
          update: function () {
            var t = s + "disabled";
            1 === i.pagingCount
              ? i.directionNav.addClass(t).attr("tabindex", "-1")
              : i.vars.animationLoop
                ? i.directionNav.removeClass(t).removeAttr("tabindex")
                : 0 === i.animatingTo
                  ? i.directionNav
                    .removeClass(t)
                    .filter("." + s + "prev")
                    .addClass(t)
                    .attr("tabindex", "-1")
                  : i.animatingTo === i.last
                    ? i.directionNav
                      .removeClass(t)
                      .filter("." + s + "next")
                      .addClass(t)
                      .attr("tabindex", "-1")
                    : i.directionNav.removeClass(t).removeAttr("tabindex");
          },
        },
        pausePlay: {
          setup: function () {
            var e = t('<div class="' + s + 'pauseplay"><a></a></div>');
            i.controlsContainer
              ? (i.controlsContainer.append(e),
                (i.pausePlay = t("." + s + "pauseplay a", i.controlsContainer)))
              : (i.append(e), (i.pausePlay = t("." + s + "pauseplay a", i))),
              m.pausePlay.update(i.vars.slideshow ? s + "pause" : s + "play"),
              i.pausePlay.bind(l, function (e) {
                e.preventDefault(),
                  ("" === u || u === e.type) &&
                  (t(this).hasClass(s + "pause")
                    ? ((i.manualPause = !0), (i.manualPlay = !1), i.pause())
                    : ((i.manualPause = !1), (i.manualPlay = !0), i.play())),
                  "" === u && (u = e.type),
                  m.setToClearWatchedEvent();
              });
          },
          update: function (t) {
            "play" === t
              ? i.pausePlay
                .removeClass(s + "pause")
                .addClass(s + "play")
                .html(i.vars.playText)
              : i.pausePlay
                .removeClass(s + "play")
                .addClass(s + "pause")
                .html(i.vars.pauseText);
          },
        },
        touch: function () {
          function t(t) {
            i.animating
              ? t.preventDefault()
              : (window.navigator.msPointerEnabled || 1 === t.touches.length) &&
              (i.pause(),
                (v = c ? i.h : i.w),
                (y = Number(new Date())),
                (b = t.touches[0].pageX),
                (x = t.touches[0].pageY),
                (m =
                  p && d && i.animatingTo === i.last
                    ? 0
                    : p && d
                      ? i.limit -
                      (i.itemW + i.vars.itemMargin) * i.move * i.animatingTo
                      : p && i.currentSlide === i.last
                        ? i.limit
                        : p
                          ? (i.itemW + i.vars.itemMargin) * i.move * i.currentSlide
                          : d
                            ? (i.last - i.currentSlide + i.cloneOffset) * v
                            : (i.currentSlide + i.cloneOffset) * v),
                (u = c ? x : b),
                (f = c ? b : x),
                e.addEventListener("touchmove", n, !1),
                e.addEventListener("touchend", o, !1));
          }
          function n(t) {
            (b = t.touches[0].pageX),
              (x = t.touches[0].pageY),
              (g = c ? u - x : u - b),
              (w = c
                ? Math.abs(g) < Math.abs(b - f)
                : Math.abs(g) < Math.abs(x - f));
            var e = 500;
            (!w || Number(new Date()) - y > e) &&
              (t.preventDefault(),
                !h &&
                i.transitions &&
                (i.vars.animationLoop ||
                  (g /=
                    (0 === i.currentSlide && 0 > g) ||
                      (i.currentSlide === i.last && g > 0)
                      ? Math.abs(g) / v + 2
                      : 1),
                  i.setProps(m + g, "setTouch")));
          }
          function o() {
            if (
              (e.removeEventListener("touchmove", n, !1),
                i.animatingTo === i.currentSlide && !w && null !== g)
            ) {
              var t = d ? -g : g,
                s = i.getTarget(t > 0 ? "next" : "prev");
              i.canAdvance(s) &&
                ((Number(new Date()) - y < 550 && Math.abs(t) > 50) ||
                  Math.abs(t) > v / 2)
                ? i.flexAnimate(s, i.vars.pauseOnAction)
                : h || i.flexAnimate(i.currentSlide, i.vars.pauseOnAction, !0);
            }
            e.removeEventListener("touchend", o, !1),
              (u = null),
              (f = null),
              (g = null),
              (m = null);
          }
          function s(t) {
            t.stopPropagation(),
              i.animating
                ? t.preventDefault()
                : (i.pause(),
                  e._gesture.addPointer(t.pointerId),
                  (S = 0),
                  (v = c ? i.h : i.w),
                  (y = Number(new Date())),
                  (m =
                    p && d && i.animatingTo === i.last
                      ? 0
                      : p && d
                        ? i.limit -
                        (i.itemW + i.vars.itemMargin) * i.move * i.animatingTo
                        : p && i.currentSlide === i.last
                          ? i.limit
                          : p
                            ? (i.itemW + i.vars.itemMargin) * i.move * i.currentSlide
                            : d
                              ? (i.last - i.currentSlide + i.cloneOffset) * v
                              : (i.currentSlide + i.cloneOffset) * v));
          }
          function r(t) {
            t.stopPropagation();
            var n = t.target._slider;
            if (n) {
              var i = -t.translationX,
                o = -t.translationY;
              return (
                (S += c ? o : i),
                (g = S),
                (w = c
                  ? Math.abs(S) < Math.abs(-i)
                  : Math.abs(S) < Math.abs(-o)),
                t.detail === t.MSGESTURE_FLAG_INERTIA
                  ? void setImmediate(function () {
                    e._gesture.stop();
                  })
                  : void (
                    (!w || Number(new Date()) - y > 500) &&
                    (t.preventDefault(),
                      !h &&
                      n.transitions &&
                      (n.vars.animationLoop ||
                        (g =
                          S /
                          ((0 === n.currentSlide && 0 > S) ||
                            (n.currentSlide === n.last && S > 0)
                            ? Math.abs(S) / v + 2
                            : 1)),
                        n.setProps(m + g, "setTouch")))
                  )
              );
            }
          }
          function l(t) {
            t.stopPropagation();
            var e = t.target._slider;
            if (e) {
              if (e.animatingTo === e.currentSlide && !w && null !== g) {
                var n = d ? -g : g,
                  i = e.getTarget(n > 0 ? "next" : "prev");
                e.canAdvance(i) &&
                  ((Number(new Date()) - y < 550 && Math.abs(n) > 50) ||
                    Math.abs(n) > v / 2)
                  ? e.flexAnimate(i, e.vars.pauseOnAction)
                  : h ||
                  e.flexAnimate(e.currentSlide, e.vars.pauseOnAction, !0);
              }
              (u = null), (f = null), (g = null), (m = null), (S = 0);
            }
          }
          var u,
            f,
            m,
            v,
            g,
            y,
            w = !1,
            b = 0,
            x = 0,
            S = 0;
          a
            ? ((e.style.msTouchAction = "none"),
              (e._gesture = new MSGesture()),
              (e._gesture.target = e),
              e.addEventListener("MSPointerDown", s, !1),
              (e._slider = i),
              e.addEventListener("MSGestureChange", r, !1),
              e.addEventListener("MSGestureEnd", l, !1))
            : e.addEventListener("touchstart", t, !1);
        },
        resize: function () {
          !i.animating &&
            i.is(":visible") &&
            (p || i.doMath(),
              h
                ? m.smoothHeight()
                : p
                  ? (i.slides.width(i.computedW),
                    i.update(i.pagingCount),
                    i.setProps())
                  : c
                    ? (i.viewport.height(i.h), i.setProps(i.h, "setTotal"))
                    : (i.vars.smoothHeight && m.smoothHeight(),
                      i.newSlides.width(i.computedW),
                      i.setProps(i.computedW, "setTotal")));
        },
        smoothHeight: function (t) {
          if (!c || h) {
            var e = h ? i : i.viewport;
            t
              ? e.animate({ height: i.slides.eq(i.animatingTo).height() }, t)
              : e.height(i.slides.eq(i.animatingTo).height());
          }
        },
        sync: function (e) {
          var n = t(i.vars.sync).data("flexslider"),
            o = i.animatingTo;
          switch (e) {
            case "animate":
              n.flexAnimate(o, i.vars.pauseOnAction, !1, !0);
              break;
            case "play":
              n.playing || n.asNav || n.play();
              break;
            case "pause":
              n.pause();
          }
        },
        uniqueID: function (e) {
          return (
            e.find("[id]").each(function () {
              var e = t(this);
              e.attr("id", e.attr("id") + "_clone");
            }),
            e
          );
        },
        pauseInvisible: {
          visProp: null,
          init: function () {
            var t = ["webkit", "moz", "ms", "o"];
            if ("hidden" in document) return "hidden";
            for (var e = 0; e < t.length; e++)
              t[e] + "Hidden" in document &&
                (m.pauseInvisible.visProp = t[e] + "Hidden");
            if (m.pauseInvisible.visProp) {
              var n =
                m.pauseInvisible.visProp.replace(/[H|h]idden/, "") +
                "visibilitychange";
              document.addEventListener(n, function () {
                m.pauseInvisible.isHidden()
                  ? i.startTimeout
                    ? clearTimeout(i.startTimeout)
                    : i.pause()
                  : i.started
                    ? i.play()
                    : i.vars.initDelay > 0
                      ? setTimeout(i.play, i.vars.initDelay)
                      : i.play();
              });
            }
          },
          isHidden: function () {
            return document[m.pauseInvisible.visProp] || !1;
          },
        },
        setToClearWatchedEvent: function () {
          clearTimeout(o),
            (o = setTimeout(function () {
              u = "";
            }, 3e3));
        },
      }),
      (i.flexAnimate = function (e, n, o, a, l) {
        if (
          (i.vars.animationLoop ||
            e === i.currentSlide ||
            (i.direction = e > i.currentSlide ? "next" : "prev"),
            f &&
            1 === i.pagingCount &&
            (i.direction = i.currentItem < e ? "next" : "prev"),
            !i.animating && (i.canAdvance(e, l) || o) && i.is(":visible"))
        ) {
          if (f && a) {
            var u = t(i.vars.asNavFor).data("flexslider");
            if (
              ((i.atEnd = 0 === e || e === i.count - 1),
                u.flexAnimate(e, !0, !1, !0, l),
                (i.direction = i.currentItem < e ? "next" : "prev"),
                (u.direction = i.direction),
                Math.ceil((e + 1) / i.visible) - 1 === i.currentSlide || 0 === e)
            )
              return (
                (i.currentItem = e),
                i.slides
                  .removeClass(s + "active-slide")
                  .eq(e)
                  .addClass(s + "active-slide"),
                !1
              );
            (i.currentItem = e),
              i.slides
                .removeClass(s + "active-slide")
                .eq(e)
                .addClass(s + "active-slide"),
              (e = Math.floor(e / i.visible));
          }
          if (
            ((i.animating = !0),
              (i.animatingTo = e),
              n && i.pause(),
              i.vars.before(i),
              i.syncExists && !l && m.sync("animate"),
              i.vars.controlNav && m.controlNav.active(),
              p ||
              i.slides
                .removeClass(s + "active-slide")
                .eq(e)
                .addClass(s + "active-slide"),
              (i.atEnd = 0 === e || e === i.last),
              i.vars.directionNav && m.directionNav.update(),
              e === i.last && (i.vars.end(i), i.vars.animationLoop || i.pause()),
              h)
          )
            r
              ? (i.slides.eq(i.currentSlide).css({ opacity: 0, zIndex: 1 }),
                i.slides.eq(e).css({ opacity: 1, zIndex: 2 }),
                i.wrapup(w))
              : (i.slides
                .eq(i.currentSlide)
                .css({ zIndex: 1 })
                .animate(
                  { opacity: 0 },
                  i.vars.animationSpeed,
                  i.vars.easing
                ),
                i.slides
                  .eq(e)
                  .css({ zIndex: 2 })
                  .animate(
                    { opacity: 1 },
                    i.vars.animationSpeed,
                    i.vars.easing,
                    i.wrapup
                  ));
          else {
            var v,
              g,
              y,
              w = c ? i.slides.filter(":first").height() : i.computedW;
            p
              ? ((v = i.vars.itemMargin),
                (y = (i.itemW + v) * i.move * i.animatingTo),
                (g = y > i.limit && 1 !== i.visible ? i.limit : y))
              : (g =
                0 === i.currentSlide &&
                  e === i.count - 1 &&
                  i.vars.animationLoop &&
                  "next" !== i.direction
                  ? d
                    ? (i.count + i.cloneOffset) * w
                    : 0
                  : i.currentSlide === i.last &&
                    0 === e &&
                    i.vars.animationLoop &&
                    "prev" !== i.direction
                    ? d
                      ? 0
                      : (i.count + 1) * w
                    : d
                      ? (i.count - 1 - e + i.cloneOffset) * w
                      : (e + i.cloneOffset) * w),
              i.setProps(g, "", i.vars.animationSpeed),
              i.transitions
                ? ((i.vars.animationLoop && i.atEnd) ||
                  ((i.animating = !1), (i.currentSlide = i.animatingTo)),
                  i.container.unbind("webkitTransitionEnd transitionend"),
                  i.container.bind(
                    "webkitTransitionEnd transitionend",
                    function () {
                      clearTimeout(i.ensureAnimationEnd), i.wrapup(w);
                    }
                  ),
                  clearTimeout(i.ensureAnimationEnd),
                  (i.ensureAnimationEnd = setTimeout(function () {
                    i.wrapup(w);
                  }, i.vars.animationSpeed + 100)))
                : i.container.animate(
                  i.args,
                  i.vars.animationSpeed,
                  i.vars.easing,
                  function () {
                    i.wrapup(w);
                  }
                );
          }
          i.vars.smoothHeight && m.smoothHeight(i.vars.animationSpeed);
        }
      }),
      (i.wrapup = function (t) {
        h ||
          p ||
          (0 === i.currentSlide &&
            i.animatingTo === i.last &&
            i.vars.animationLoop
            ? i.setProps(t, "jumpEnd")
            : i.currentSlide === i.last &&
            0 === i.animatingTo &&
            i.vars.animationLoop &&
            i.setProps(t, "jumpStart")),
          (i.animating = !1),
          (i.currentSlide = i.animatingTo),
          i.vars.after(i);
      }),
      (i.animateSlides = function () {
        !i.animating && v && i.flexAnimate(i.getTarget("next"));
      }),
      (i.pause = function () {
        clearInterval(i.animatedSlides),
          (i.animatedSlides = null),
          (i.playing = !1),
          i.vars.pausePlay && m.pausePlay.update("play"),
          i.syncExists && m.sync("pause");
      }),
      (i.play = function () {
        i.playing && clearInterval(i.animatedSlides),
          (i.animatedSlides =
            i.animatedSlides ||
            setInterval(i.animateSlides, i.vars.slideshowSpeed)),
          (i.started = i.playing = !0),
          i.vars.pausePlay && m.pausePlay.update("pause"),
          i.syncExists && m.sync("play");
      }),
      (i.stop = function () {
        i.pause(), (i.stopped = !0);
      }),
      (i.canAdvance = function (t, e) {
        var n = f ? i.pagingCount - 1 : i.last;
        return e
          ? !0
          : f &&
            i.currentItem === i.count - 1 &&
            0 === t &&
            "prev" === i.direction
            ? !0
            : f &&
              0 === i.currentItem &&
              t === i.pagingCount - 1 &&
              "next" !== i.direction
              ? !1
              : t !== i.currentSlide || f
                ? i.vars.animationLoop
                  ? !0
                  : i.atEnd &&
                    0 === i.currentSlide &&
                    t === n &&
                    "next" !== i.direction
                    ? !1
                    : i.atEnd &&
                      i.currentSlide === n &&
                      0 === t &&
                      "next" === i.direction
                      ? !1
                      : !0
                : !1;
      }),
      (i.getTarget = function (t) {
        return (
          (i.direction = t),
          "next" === t
            ? i.currentSlide === i.last
              ? 0
              : i.currentSlide + 1
            : 0 === i.currentSlide
              ? i.last
              : i.currentSlide - 1
        );
      }),
      (i.setProps = function (t, e, n) {
        var o = (function () {
          var n = t
            ? t
            : (i.itemW + i.vars.itemMargin) * i.move * i.animatingTo,
            o = (function () {
              if (p)
                return "setTouch" === e
                  ? t
                  : d && i.animatingTo === i.last
                    ? 0
                    : d
                      ? i.limit -
                      (i.itemW + i.vars.itemMargin) * i.move * i.animatingTo
                      : i.animatingTo === i.last
                        ? i.limit
                        : n;
              switch (e) {
                case "setTotal":
                  return d
                    ? (i.count - 1 - i.currentSlide + i.cloneOffset) * t
                    : (i.currentSlide + i.cloneOffset) * t;
                case "setTouch":
                  return d ? t : t;
                case "jumpEnd":
                  return d ? t : i.count * t;
                case "jumpStart":
                  return d ? i.count * t : t;
                default:
                  return t;
              }
            })();
          return -1 * o + "px";
        })();
        i.transitions &&
          ((o = c
            ? "translate3d(0," + o + ",0)"
            : "translate3d(" + o + ",0,0)"),
            (n = void 0 !== n ? n / 1e3 + "s" : "0s"),
            i.container.css("-" + i.pfx + "-transition-duration", n),
            i.container.css("transition-duration", n)),
          (i.args[i.prop] = o),
          (i.transitions || void 0 === n) && i.container.css(i.args),
          i.container.css("transform", o);
      }),
      (i.setup = function (e) {
        if (h)
          i.slides.css({
            width: "100%",
            float: "left",
            marginRight: "-100%",
            position: "relative",
          }),
            "init" === e &&
            (r
              ? i.slides
                .css({
                  opacity: 0,
                  display: "block",
                  webkitTransition:
                    "opacity " + i.vars.animationSpeed / 1e3 + "s ease",
                  zIndex: 1,
                })
                .eq(i.currentSlide)
                .css({ opacity: 1, zIndex: 2 })
              : i.slides
                .css({ opacity: 0, display: "block", zIndex: 1 })
                .eq(i.currentSlide)
                .css({ zIndex: 2 })
                .animate(
                  { opacity: 1 },
                  i.vars.animationSpeed,
                  i.vars.easing
                )),
            i.vars.smoothHeight && m.smoothHeight();
        else {
          var n, o;
          "init" === e &&
            ((i.viewport = t('<div class="' + s + 'viewport"></div>')
              .css({ overflow: "hidden", position: "relative" })
              .appendTo(i)
              .append(i.container)),
              (i.cloneCount = 0),
              (i.cloneOffset = 0),
              d &&
              ((o = t.makeArray(i.slides).reverse()),
                (i.slides = t(o)),
                i.container.empty().append(i.slides))),
            i.vars.animationLoop &&
            !p &&
            ((i.cloneCount = 2),
              (i.cloneOffset = 1),
              "init" !== e && i.container.find(".clone").remove(),
              m
                .uniqueID(
                  i.slides
                    .first()
                    .clone()
                    .addClass("clone")
                    .attr("aria-hidden", "true")
                )
                .appendTo(i.container),
              m
                .uniqueID(
                  i.slides
                    .last()
                    .clone()
                    .addClass("clone")
                    .attr("aria-hidden", "true")
                )
                .prependTo(i.container)),
            (i.newSlides = t(i.vars.selector, i)),
            (n = d
              ? i.count - 1 - i.currentSlide + i.cloneOffset
              : i.currentSlide + i.cloneOffset),
            c && !p
              ? (i.container
                .height(200 * (i.count + i.cloneCount) + "%")
                .css("position", "absolute")
                .width("100%"),
                setTimeout(
                  function () {
                    i.newSlides.css({ display: "block" }),
                      i.doMath(),
                      i.viewport.height(i.h),
                      i.setProps(n * i.h, "init");
                  },
                  "init" === e ? 100 : 0
                ))
              : (i.container.width(200 * (i.count + i.cloneCount) + "%"),
                i.setProps(n * i.computedW, "init"),
                setTimeout(
                  function () {
                    i.doMath(),
                      i.newSlides.css({
                        width: i.computedW,
                        float: "left",
                        display: "block",
                      }),
                      i.vars.smoothHeight && m.smoothHeight();
                  },
                  "init" === e ? 100 : 0
                ));
        }
        p ||
          i.slides
            .removeClass(s + "active-slide")
            .eq(i.currentSlide)
            .addClass(s + "active-slide"),
          i.vars.init(i);
      }),
      (i.doMath = function () {
        var t = i.slides.first(),
          e = i.vars.itemMargin,
          n = i.vars.minItems,
          o = i.vars.maxItems;
        (i.w = void 0 === i.viewport ? i.width() : i.viewport.width()),
          (i.h = t.height()),
          (i.boxPadding = t.outerWidth() - t.width()),
          p
            ? ((i.itemT = i.vars.itemWidth + e),
              (i.minW = n ? n * i.itemT : i.w),
              (i.maxW = o ? o * i.itemT - e : i.w),
              (i.itemW =
                i.minW > i.w
                  ? (i.w - e * (n - 1)) / n
                  : i.maxW < i.w
                    ? (i.w - e * (o - 1)) / o
                    : i.vars.itemWidth > i.w
                      ? i.w
                      : i.vars.itemWidth),
              (i.visible = Math.floor(i.w / i.itemW)),
              (i.move =
                i.vars.move > 0 && i.vars.move < i.visible
                  ? i.vars.move
                  : i.visible),
              (i.pagingCount = Math.ceil((i.count - i.visible) / i.move + 1)),
              (i.last = i.pagingCount - 1),
              (i.limit =
                1 === i.pagingCount
                  ? 0
                  : i.vars.itemWidth > i.w
                    ? i.itemW * (i.count - 1) + e * (i.count - 1)
                    : (i.itemW + e) * i.count - i.w - e))
            : ((i.itemW = i.w),
              (i.pagingCount = i.count),
              (i.last = i.count - 1)),
          (i.computedW = i.itemW - i.boxPadding);
      }),
      (i.update = function (t, e) {
        i.doMath(),
          p ||
          (t < i.currentSlide
            ? (i.currentSlide += 1)
            : t <= i.currentSlide && 0 !== t && (i.currentSlide -= 1),
            (i.animatingTo = i.currentSlide)),
          i.vars.controlNav &&
          !i.manualControls &&
          (("add" === e && !p) || i.pagingCount > i.controlNav.length
            ? m.controlNav.update("add")
            : (("remove" === e && !p) ||
              i.pagingCount < i.controlNav.length) &&
            (p &&
              i.currentSlide > i.last &&
              ((i.currentSlide -= 1), (i.animatingTo -= 1)),
              m.controlNav.update("remove", i.last))),
          i.vars.directionNav && m.directionNav.update();
      }),
      (i.addSlide = function (e, n) {
        var o = t(e);
        (i.count += 1),
          (i.last = i.count - 1),
          c && d
            ? void 0 !== n
              ? i.slides.eq(i.count - n).after(o)
              : i.container.prepend(o)
            : void 0 !== n
              ? i.slides.eq(n).before(o)
              : i.container.append(o),
          i.update(n, "add"),
          (i.slides = t(i.vars.selector + ":not(.clone)", i)),
          i.setup(),
          i.vars.added(i);
      }),
      (i.removeSlide = function (e) {
        var n = isNaN(e) ? i.slides.index(t(e)) : e;
        (i.count -= 1),
          (i.last = i.count - 1),
          isNaN(e)
            ? t(e, i.slides).remove()
            : c && d
              ? i.slides.eq(i.last).remove()
              : i.slides.eq(e).remove(),
          i.doMath(),
          i.update(n, "remove"),
          (i.slides = t(i.vars.selector + ":not(.clone)", i)),
          i.setup(),
          i.vars.removed(i);
      }),
      m.init();
  }),
    t(window)
      .blur(function () {
        focused = !1;
      })
      .focus(function () {
        focused = !0;
      }),
    (t.flexslider.defaults = {
      namespace: "flex-",
      selector: ".slides > li",
      animation: "fade",
      easing: "swing",
      direction: "horizontal",
      reverse: !1,
      animationLoop: !0,
      smoothHeight: !1,
      startAt: 0,
      slideshow: !0,
      slideshowSpeed: 7e3,
      animationSpeed: 600,
      initDelay: 0,
      randomize: !1,
      thumbCaptions: !1,
      pauseOnAction: !0,
      pauseOnHover: !1,
      pauseInvisible: !0,
      useCSS: !0,
      touch: !0,
      video: !1,
      controlNav: !0,
      directionNav: !0,
      prevText: "Previous",
      nextText: "Next",
      keyboard: !0,
      multipleKeyboard: !1,
      mousewheel: !1,
      pausePlay: !1,
      pauseText: "Pause",
      playText: "Play",
      controlsContainer: "",
      manualControls: "",
      sync: "",
      asNavFor: "",
      itemWidth: 0,
      itemMargin: 0,
      minItems: 1,
      maxItems: 0,
      move: 0,
      allowOneSlide: !0,
      start: function () { },
      before: function () { },
      after: function () { },
      end: function () { },
      added: function () { },
      removed: function () { },
      init: function () { },
    }),
    (t.fn.flexslider = function (e) {
      if ((void 0 === e && (e = {}), "object" == typeof e))
        return this.each(function () {
          var n = t(this),
            i = e.selector ? e.selector : ".slides > li",
            o = n.find(i);
          (1 === o.length && e.allowOneSlide === !0) || 0 === o.length
            ? (o.fadeIn(400), e.start && e.start(n))
            : void 0 === n.data("flexslider") && new t.flexslider(this, e);
        });
      var n = t(this).data("flexslider");
      switch (e) {
        case "play":
          n.play();
          break;
        case "pause":
          n.pause();
          break;
        case "stop":
          n.stop();
          break;
        case "next":
          n.flexAnimate(n.getTarget("next"), !0);
          break;
        case "prev":
        case "previous":
          n.flexAnimate(n.getTarget("prev"), !0);
          break;
        default:
          "number" == typeof e && n.flexAnimate(e, !0);
      }
    });
})(jQuery),
  !(function () {
    function t() { }
    function e(t) {
      return s.retinaImageSuffix + t;
    }
    function n(t, n) {
      if (((this.path = t || ""), "undefined" != typeof n && null !== n))
        (this.at_2x_path = n), (this.perform_check = !1);
      else {
        if (void 0 !== document.createElement) {
          var i = document.createElement("a");
          (i.href = this.path),
            (i.pathname = i.pathname.replace(a, e)),
            (this.at_2x_path = i.href);
        } else {
          var o = this.path.split("?");
          (o[0] = o[0].replace(a, e)), (this.at_2x_path = o.join("?"));
        }
        this.perform_check = !0;
      }
    }
    function i(t) {
      (this.el = t),
        (this.path = new n(
          this.el.getAttribute("src"),
          this.el.getAttribute("data-at2x")
        ));
      var e = this;
      this.path.check_2x_variant(function (t) {
        t && e.swap();
      });
    }
    var o = "undefined" == typeof exports ? window : exports,
      s = {
        retinaImageSuffix: "@2x",
        check_mime_type: !0,
        force_original_dimensions: !0,
      };
    (o.Retina = t),
      (t.configure = function (t) {
        null === t && (t = {});
        for (var e in t) t.hasOwnProperty(e) && (s[e] = t[e]);
      }),
      (t.init = function (t) {
        null === t && (t = o);
        var e = t.onload || function () { };
        t.onload = function () {
          var t,
            n,
            o = document.getElementsByTagName("img"),
            s = [];
          for (t = 0; t < o.length; t += 1)
            (n = o[t]),
              n.getAttributeNode("data-no-retina") || s.push(new i(n));
          e();
        };
      }),
      (t.isRetina = function () {
        var t =
          "(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";
        return o.devicePixelRatio > 1
          ? !0
          : o.matchMedia && o.matchMedia(t).matches
            ? !0
            : !1;
      });
    var a = /\.\w+$/;
    (o.RetinaImagePath = n),
      (n.confirmed_paths = []),
      (n.prototype.is_external = function () {
        return !(
          !this.path.match(/^https?\:/i) ||
          this.path.match("//" + document.domain)
        );
      }),
      (n.prototype.check_2x_variant = function (t) {
        var e,
          i = this;
        return this.is_external()
          ? t(!1)
          : this.perform_check ||
            "undefined" == typeof this.at_2x_path ||
            null === this.at_2x_path
            ? this.at_2x_path in n.confirmed_paths
              ? t(!0)
              : ((e = new XMLHttpRequest()),
                e.open("HEAD", this.at_2x_path),
                (e.onreadystatechange = function () {
                  if (4 !== e.readyState) return t(!1);
                  if (e.status >= 200 && e.status <= 399) {
                    if (s.check_mime_type) {
                      var o = e.getResponseHeader("Content-Type");
                      if (null === o || !o.match(/^image/i)) return t(!1);
                    }
                    return n.confirmed_paths.push(i.at_2x_path), t(!0);
                  }
                  return t(!1);
                }),
                void e.send())
            : t(!0);
      }),
      (o.RetinaImage = i),
      (i.prototype.swap = function (t) {
        function e() {
          n.el.complete
            ? (s.force_original_dimensions &&
              (n.el.setAttribute("width", n.el.offsetWidth),
                n.el.setAttribute("height", n.el.offsetHeight)),
              n.el.setAttribute("src", t))
            : setTimeout(e, 5);
        }
        "undefined" == typeof t && (t = this.path.at_2x_path);
        var n = this;
        e();
      }),
      t.isRetina() && t.init(o);
  })(),
  (window.Modernizr = (function (t, e, n) {
    function i(t) {
      v.cssText = t;
    }
    function o(t, e) {
      return i(w.join(t + ";") + (e || ""));
    }
    function s(t, e) {
      return typeof t === e;
    }
    function a(t, e) {
      return !!~("" + t).indexOf(e);
    }
    function r(t, e) {
      for (var i in t) {
        var o = t[i];
        if (!a(o, "-") && v[o] !== n) return "pfx" == e ? o : !0;
      }
      return !1;
    }
    function l(t, e, i) {
      for (var o in t) {
        var a = e[t[o]];
        if (a !== n)
          return i === !1 ? t[o] : s(a, "function") ? a.bind(i || e) : a;
      }
      return !1;
    }
    function u(t, e, n) {
      var i = t.charAt(0).toUpperCase() + t.slice(1),
        o = (t + " " + x.join(i + " ") + i).split(" ");
      return s(e, "string") || s(e, "undefined")
        ? r(o, e)
        : ((o = (t + " " + S.join(i + " ") + i).split(" ")), l(o, e, n));
    }
    var c = "2.8.3",
      d = {},
      p = !0,
      h = e.documentElement,
      f = "modernizr",
      m = e.createElement(f),
      v = m.style,
      g,
      y = {}.toString,
      w = " -webkit- -moz- -o- -ms- ".split(" "),
      b = "Webkit Moz O ms",
      x = b.split(" "),
      S = b.toLowerCase().split(" "),
      C = { svg: "http://www.w3.org/2000/svg" },
      I = {},
      P = {},
      T = {},
      A = [],
      M = A.slice,
      _,
      k = {}.hasOwnProperty,
      L;
    (L =
      s(k, "undefined") || s(k.call, "undefined")
        ? function (t, e) {
          return e in t && s(t.constructor.prototype[e], "undefined");
        }
        : function (t, e) {
          return k.call(t, e);
        }),
      Function.prototype.bind ||
      (Function.prototype.bind = function (t) {
        var e = this;
        if ("function" != typeof e) throw new TypeError();
        var n = M.call(arguments, 1),
          i = function () {
            if (this instanceof i) {
              var o = function () { };
              o.prototype = e.prototype;
              var s = new o(),
                a = e.apply(s, n.concat(M.call(arguments)));
              return Object(a) === a ? a : s;
            }
            return e.apply(t, n.concat(M.call(arguments)));
          };
        return i;
      }),
      (I.cssgradients = function () {
        var t = "background-image:",
          e = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
          n = "linear-gradient(left top,#9f9, white);";
        return (
          i(
            (t + "-webkit- ".split(" ").join(e + t) + w.join(n + t)).slice(
              0,
              -t.length
            )
          ),
          a(v.backgroundImage, "gradient")
        );
      }),
      (I.csstransforms = function () {
        return !!u("transform");
      }),
      (I.csstransitions = function () {
        return u("transition");
      }),
      (I.svg = function () {
        return (
          !!e.createElementNS && !!e.createElementNS(C.svg, "svg").createSVGRect
        );
      }),
      (I.inlinesvg = function () {
        var t = e.createElement("div");
        return (
          (t.innerHTML = "<svg/>"),
          (t.firstChild && t.firstChild.namespaceURI) == C.svg
        );
      }),
      (I.svgclippaths = function () {
        return (
          !!e.createElementNS &&
          /SVGClipPath/.test(y.call(e.createElementNS(C.svg, "clipPath")))
        );
      });
    for (var E in I)
      L(I, E) &&
        ((_ = E.toLowerCase()),
          (d[_] = I[E]()),
          A.push((d[_] ? "" : "no-") + _));
    return (
      (d.addTest = function (t, e) {
        if ("object" == typeof t)
          for (var i in t) L(t, i) && d.addTest(i, t[i]);
        else {
          if (((t = t.toLowerCase()), d[t] !== n)) return d;
          (e = "function" == typeof e ? e() : e),
            "undefined" != typeof p &&
            p &&
            (h.className += " " + (e ? "" : "no-") + t),
            (d[t] = e);
        }
        return d;
      }),
      i(""),
      (m = g = null),
      (function (t, e) {
        function n(t, e) {
          var n = t.createElement("p"),
            i = t.getElementsByTagName("head")[0] || t.documentElement;
          return (
            (n.innerHTML = "x<style>" + e + "</style>"),
            i.insertBefore(n.lastChild, i.firstChild)
          );
        }
        function i() {
          var t = y.elements;
          return "string" == typeof t ? t.split(" ") : t;
        }
        function o(t) {
          var e = v[t[f]];
          return e || ((e = {}), m++, (t[f] = m), (v[m] = e)), e;
        }
        function s(t, n, i) {
          if ((n || (n = e), g)) return n.createElement(t);
          i || (i = o(n));
          var s;
          return (
            (s = i.cache[t]
              ? i.cache[t].cloneNode()
              : p.test(t)
                ? (i.cache[t] = i.createElem(t)).cloneNode()
                : i.createElem(t)),
            !s.canHaveChildren || d.test(t) || s.tagUrn
              ? s
              : i.frag.appendChild(s)
          );
        }
        function a(t, n) {
          if ((t || (t = e), g)) return t.createDocumentFragment();
          n = n || o(t);
          for (
            var s = n.frag.cloneNode(), a = 0, r = i(), l = r.length;
            l > a;
            a++
          )
            s.createElement(r[a]);
          return s;
        }
        function r(t, e) {
          e.cache ||
            ((e.cache = {}),
              (e.createElem = t.createElement),
              (e.createFrag = t.createDocumentFragment),
              (e.frag = e.createFrag())),
            (t.createElement = function (n) {
              return y.shivMethods ? s(n, t, e) : e.createElem(n);
            }),
            (t.createDocumentFragment = Function(
              "h,f",
              "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" +
              i()
                .join()
                .replace(/[\w\-]+/g, function (t) {
                  return (
                    e.createElem(t), e.frag.createElement(t), 'c("' + t + '")'
                  );
                }) +
              ");return n}"
            )(y, e.frag));
        }
        function l(t) {
          t || (t = e);
          var i = o(t);
          return (
            y.shivCSS &&
            !h &&
            !i.hasCSS &&
            (i.hasCSS = !!n(
              t,
              "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}"
            )),
            g || r(t, i),
            t
          );
        }
        var u = "3.7.0",
          c = t.html5 || {},
          d =
            /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
          p =
            /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
          h,
          f = "_html5shiv",
          m = 0,
          v = {},
          g;
        !(function () {
          try {
            var t = e.createElement("a");
            (t.innerHTML = "<xyz></xyz>"),
              (h = "hidden" in t),
              (g =
                1 == t.childNodes.length ||
                (function () {
                  e.createElement("a");
                  var t = e.createDocumentFragment();
                  return (
                    "undefined" == typeof t.cloneNode ||
                    "undefined" == typeof t.createDocumentFragment ||
                    "undefined" == typeof t.createElement
                  );
                })());
          } catch (n) {
            (h = !0), (g = !0);
          }
        })();
        var y = {
          elements:
            c.elements ||
            "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
          version: u,
          shivCSS: c.shivCSS !== !1,
          supportsUnknownElements: g,
          shivMethods: c.shivMethods !== !1,
          type: "default",
          shivDocument: l,
          createElement: s,
          createDocumentFragment: a,
        };
        (t.html5 = y), l(e);
      })(this, e),
      (d._version = c),
      (d._prefixes = w),
      (d._domPrefixes = S),
      (d._cssomPrefixes = x),
      (d.testProp = function (t) {
        return r([t]);
      }),
      (d.testAllProps = u),
      (h.className =
        h.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") +
        (p ? " js " + A.join(" ") : "")),
      d
    );
  })(this, this.document)),
  (function (t, e, n) {
    function i(t) {
      return "[object Function]" == f.call(t);
    }
    function o(t) {
      return "string" == typeof t;
    }
    function s() { }
    function a(t) {
      return !t || "loaded" == t || "complete" == t || "uninitialized" == t;
    }
    function r() {
      var t = m.shift();
      (v = 1),
        t
          ? t.t
            ? p(function () {
              ("c" == t.t
                ? A.injectCss
                : A.injectJs)(t.s, 0, t.a, t.x, t.e, 1);
            }, 0)
            : (t(), r())
          : (v = 0);
    }
    function l(t, n, i, o, s, l, u) {
      function c(e) {
        if (
          !f &&
          a(d.readyState) &&
          ((b.r = f = 1),
            !v && r(),
            (d.onload = d.onreadystatechange = null),
            e)
        ) {
          "img" != t &&
            p(function () {
              w.removeChild(d);
            }, 50);
          for (var i in I[n]) I[n].hasOwnProperty(i) && I[n][i].onload();
        }
      }
      var u = u || A.errorTimeout,
        d = e.createElement(t),
        f = 0,
        g = 0,
        b = { t: i, s: n, e: s, a: l, x: u };
      1 === I[n] && ((g = 1), (I[n] = [])),
        "object" == t ? (d.data = n) : ((d.src = n), (d.type = t)),
        (d.width = d.height = "0"),
        (d.onerror =
          d.onload =
          d.onreadystatechange =
          function () {
            c.call(this, g);
          }),
        m.splice(o, 0, b),
        "img" != t &&
        (g || 2 === I[n]
          ? (w.insertBefore(d, y ? null : h), p(c, u))
          : I[n].push(d));
    }
    function u(t, e, n, i, s) {
      return (
        (v = 0),
        (e = e || "j"),
        o(t)
          ? l("c" == e ? x : b, t, e, this.i++, n, i, s)
          : (m.splice(this.i++, 0, t), 1 == m.length && r()),
        this
      );
    }
    function c() {
      var t = A;
      return (t.loader = { load: u, i: 0 }), t;
    }
    var d = e.documentElement,
      p = t.setTimeout,
      h = e.getElementsByTagName("script")[0],
      f = {}.toString,
      m = [],
      v = 0,
      g = "MozAppearance" in d.style,
      y = g && !!e.createRange().compareNode,
      w = y ? d : h.parentNode,
      d = t.opera && "[object Opera]" == f.call(t.opera),
      d = !!e.attachEvent && !d,
      b = g ? "object" : d ? "script" : "img",
      x = d ? "script" : b,
      S =
        Array.isArray ||
        function (t) {
          return "[object Array]" == f.call(t);
        },
      C = [],
      I = {},
      P = {
        timeout: function (t, e) {
          return e.length && (t.timeout = e[0]), t;
        },
      },
      T,
      A;
    (A = function (t) {
      function e(t) {
        var t = t.split("!"),
          e = C.length,
          n = t.pop(),
          i = t.length,
          n = { url: n, origUrl: n, prefixes: t },
          o,
          s,
          a;
        for (s = 0; i > s; s++)
          (a = t[s].split("=")), (o = P[a.shift()]) && (n = o(n, a));
        for (s = 0; e > s; s++) n = C[s](n);
        return n;
      }
      function a(t, o, s, a, r) {
        var l = e(t),
          u = l.autoCallback;
        l.url.split(".").pop().split("?").shift(),
          l.bypass ||
          (o &&
            (o = i(o)
              ? o
              : o[t] || o[a] || o[t.split("/").pop().split("?")[0]]),
            l.instead
              ? l.instead(t, o, s, a, r)
              : (I[l.url] ? (l.noexec = !0) : (I[l.url] = 1),
                s.load(
                  l.url,
                  l.forceCSS ||
                    (!l.forceJS &&
                      "css" == l.url.split(".").pop().split("?").shift())
                    ? "c"
                    : n,
                  l.noexec,
                  l.attrs,
                  l.timeout
                ),
                (i(o) || i(u)) &&
                s.load(function () {
                  c(),
                    o && o(l.origUrl, r, a),
                    u && u(l.origUrl, r, a),
                    (I[l.url] = 2);
                })));
      }
      function r(t, e) {
        function n(t, n) {
          if (t) {
            if (o(t))
              n ||
                (u = function () {
                  var t = [].slice.call(arguments);
                  c.apply(this, t), d();
                }),
                a(t, u, e, 0, r);
            else if (Object(t) === t)
              for (h in ((p = (function () {
                var e = 0,
                  n;
                for (n in t) t.hasOwnProperty(n) && e++;
                return e;
              })()),
                t))
                t.hasOwnProperty(h) &&
                  (!n &&
                    !--p &&
                    (i(u)
                      ? (u = function () {
                        var t = [].slice.call(arguments);
                        c.apply(this, t), d();
                      })
                      : (u[h] = (function (t) {
                        return function () {
                          var e = [].slice.call(arguments);
                          t && t.apply(this, e), d();
                        };
                      })(c[h]))),
                    a(t[h], u, e, h, r));
          } else !n && d();
        }
        var r = !!t.test,
          l = t.load || t.both,
          u = t.callback || s,
          c = u,
          d = t.complete || s,
          p,
          h;
        n(r ? t.yep : t.nope, !!l), l && n(l);
      }
      var l,
        u,
        d = this.yepnope.loader;
      if (o(t)) a(t, 0, d, 0);
      else if (S(t))
        for (l = 0; l < t.length; l++)
          (u = t[l]),
            o(u) ? a(u, 0, d, 0) : S(u) ? A(u) : Object(u) === u && r(u, d);
      else Object(t) === t && r(t, d);
    }),
      (A.addPrefix = function (t, e) {
        P[t] = e;
      }),
      (A.addFilter = function (t) {
        C.push(t);
      }),
      (A.errorTimeout = 1e4),
      null == e.readyState &&
      e.addEventListener &&
      ((e.readyState = "loading"),
        e.addEventListener(
          "DOMContentLoaded",
          (T = function () {
            e.removeEventListener("DOMContentLoaded", T, 0),
              (e.readyState = "complete");
          }),
          0
        )),
      (t.yepnope = c()),
      (t.yepnope.executeStack = r),
      (t.yepnope.injectJs = function (t, n, i, o, l, u) {
        var c = e.createElement("script"),
          d,
          f,
          o = o || A.errorTimeout;
        c.src = t;
        for (f in i) c.setAttribute(f, i[f]);
        (n = u ? r : n || s),
          (c.onreadystatechange = c.onload =
            function () {
              !d &&
                a(c.readyState) &&
                ((d = 1), n(), (c.onload = c.onreadystatechange = null));
            }),
          p(function () {
            d || ((d = 1), n(1));
          }, o),
          l ? c.onload() : h.parentNode.insertBefore(c, h);
      }),
      (t.yepnope.injectCss = function (t, n, i, o, a, l) {
        var o = e.createElement("link"),
          u,
          n = l ? r : n || s;
        (o.href = t), (o.rel = "stylesheet"), (o.type = "text/css");
        for (u in i) o.setAttribute(u, i[u]);
        a || (h.parentNode.insertBefore(o, h), p(n, 0));
      });
  })(this, document),
  (Modernizr.load = function () {
    yepnope.apply(window, [].slice.call(arguments, 0));
  }),
  function () {
    var t,
      e,
      n,
      i = function (t, e) {
        return function () {
          return t.apply(e, arguments);
        };
      },
      o =
        [].indexOf ||
        function (t) {
          for (var e = 0, n = this.length; n > e; e++)
            if (e in this && this[e] === t) return e;
          return -1;
        };
    (e = (function () {
      function t() { }
      return (
        (t.prototype.extend = function (t, e) {
          var n, i;
          for (n in e) (i = e[n]), null == t[n] && (t[n] = i);
          return t;
        }),
        (t.prototype.isMobile = function (t) {
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            t
          );
        }),
        t
      );
    })()),
      (n =
        this.WeakMap ||
        this.MozWeakMap ||
        (n = (function () {
          function t() {
            (this.keys = []), (this.values = []);
          }
          return (
            (t.prototype.get = function (t) {
              var e, n, i, o, s;
              for (s = this.keys, e = i = 0, o = s.length; o > i; e = ++i)
                if (((n = s[e]), n === t)) return this.values[e];
            }),
            (t.prototype.set = function (t, e) {
              var n, i, o, s, a;
              for (a = this.keys, n = o = 0, s = a.length; s > o; n = ++o)
                if (((i = a[n]), i === t)) return void (this.values[n] = e);
              return this.keys.push(t), this.values.push(e);
            }),
            t
          );
        })())),
      (t =
        this.MutationObserver ||
        this.WebkitMutationObserver ||
        this.MozMutationObserver ||
        (t = (function () {
          function t() {
            console.warn("MutationObserver is not supported by your browser."),
              console.warn(
                "WOW.js cannot detect dom mutations, please call .sync() after loading new content."
              );
          }
          return (
            (t.notSupported = !0), (t.prototype.observe = function () { }), t
          );
        })())),
      (this.WOW = (function () {
        function s(t) {
          null == t && (t = {}),
            (this.scrollCallback = i(this.scrollCallback, this)),
            (this.scrollHandler = i(this.scrollHandler, this)),
            (this.start = i(this.start, this)),
            (this.scrolled = !0),
            (this.config = this.util().extend(t, this.defaults)),
            (this.animationNameCache = new n());
        }
        return (
          (s.prototype.defaults = {
            boxClass: "wow",
            animateClass: "animated",
            offset: 0,
            mobile: !0,
            live: !0,
          }),
          (s.prototype.init = function () {
            var t;
            return (
              (this.element = window.document.documentElement),
              "interactive" === (t = document.readyState) || "complete" === t
                ? this.start()
                : document.addEventListener("DOMContentLoaded", this.start),
              (this.finished = [])
            );
          }),
          (s.prototype.start = function () {
            var e, n, i, o;
            if (
              ((this.stopped = !1),
                (this.boxes = function () {
                  var t, n, i, o;
                  for (
                    i = this.element.getElementsByClassName(this.config.boxClass),
                    o = [],
                    t = 0,
                    n = i.length;
                    n > t;
                    t++
                  )
                    (e = i[t]), o.push(e);
                  return o;
                }.call(this)),
                (this.all = function () {
                  var t, n, i, o;
                  for (i = this.boxes, o = [], t = 0, n = i.length; n > t; t++)
                    (e = i[t]), o.push(e);
                  return o;
                }.call(this)),
                this.boxes.length)
            )
              if (this.disabled()) this.resetStyle();
              else {
                for (o = this.boxes, n = 0, i = o.length; i > n; n++)
                  (e = o[n]), this.applyStyle(e, !0);
                window.addEventListener("scroll", this.scrollHandler, !1),
                  window.addEventListener("resize", this.scrollHandler, !1),
                  (this.interval = setInterval(this.scrollCallback, 50));
              }
            return this.config.live
              ? new t(
                (function (t) {
                  return function (e) {
                    var n, i, o, s, a;
                    for (a = [], o = 0, s = e.length; s > o; o++)
                      (i = e[o]),
                        a.push(
                          function () {
                            var t, e, o, s;
                            for (
                              o = i.addedNodes || [],
                              s = [],
                              t = 0,
                              e = o.length;
                              e > t;
                              t++
                            )
                              (n = o[t]), s.push(this.doSync(n));
                            return s;
                          }.call(t)
                        );
                    return a;
                  };
                })(this)
              ).observe(document.body, { childList: !0, subtree: !0 })
              : void 0;
          }),
          (s.prototype.stop = function () {
            return (
              (this.stopped = !0),
              window.removeEventListener("scroll", this.scrollHandler, !1),
              window.removeEventListener("resize", this.scrollHandler, !1),
              null != this.interval ? clearInterval(this.interval) : void 0
            );
          }),
          (s.prototype.sync = function () {
            return t.notSupported ? this.doSync(this.element) : void 0;
          }),
          (s.prototype.doSync = function (t) {
            var e, n, i, s, a;
            if (!this.stopped) {
              if ((null == t && (t = this.element), 1 !== t.nodeType)) return;
              for (
                t = t.parentNode || t,
                s = t.getElementsByClassName(this.config.boxClass),
                a = [],
                n = 0,
                i = s.length;
                i > n;
                n++
              )
                (e = s[n]),
                  o.call(this.all, e) < 0
                    ? (this.applyStyle(e, !0),
                      this.boxes.push(e),
                      this.all.push(e),
                      a.push((this.scrolled = !0)))
                    : a.push(void 0);
              return a;
            }
          }),
          (s.prototype.show = function (t) {
            return (
              this.applyStyle(t),
              (t.className = "" + t.className + " " + this.config.animateClass)
            );
          }),
          (s.prototype.applyStyle = function (t, e) {
            var n, i, o;
            return (
              (i = t.getAttribute("data-wow-duration")),
              (n = t.getAttribute("data-wow-delay")),
              (o = t.getAttribute("data-wow-iteration")),
              this.animate(
                (function (s) {
                  return function () {
                    return s.customStyle(t, e, i, n, o);
                  };
                })(this)
              )
            );
          }),
          (s.prototype.animate = (function () {
            return "requestAnimationFrame" in window
              ? function (t) {
                return window.requestAnimationFrame(t);
              }
              : function (t) {
                return t();
              };
          })()),
          (s.prototype.resetStyle = function () {
            var t, e, n, i, o;
            for (i = this.boxes, o = [], e = 0, n = i.length; n > e; e++)
              (t = i[e]),
                o.push(t.setAttribute("style", "visibility: visible;"));
            return o;
          }),
          (s.prototype.customStyle = function (t, e, n, i, o) {
            return (
              e && this.cacheAnimationName(t),
              (t.style.visibility = e ? "hidden" : "visible"),
              n && this.vendorSet(t.style, { animationDuration: n }),
              i && this.vendorSet(t.style, { animationDelay: i }),
              o && this.vendorSet(t.style, { animationIterationCount: o }),
              this.vendorSet(t.style, {
                animationName: e ? "none" : this.cachedAnimationName(t),
              }),
              t
            );
          }),
          (s.prototype.vendors = ["moz", "webkit"]),
          (s.prototype.vendorSet = function (t, e) {
            var n, i, o, s;
            s = [];
            for (n in e)
              (i = e[n]),
                (t["" + n] = i),
                s.push(
                  function () {
                    var e, s, a, r;
                    for (
                      a = this.vendors, r = [], e = 0, s = a.length;
                      s > e;
                      e++
                    )
                      (o = a[e]),
                        r.push(
                          (t["" + o + n.charAt(0).toUpperCase() + n.substr(1)] =
                            i)
                        );
                    return r;
                  }.call(this)
                );
            return s;
          }),
          (s.prototype.vendorCSS = function (t, e) {
            var n, i, o, s, a, r;
            for (
              i = window.getComputedStyle(t),
              n = i.getPropertyCSSValue(e),
              r = this.vendors,
              s = 0,
              a = r.length;
              a > s;
              s++
            )
              (o = r[s]), (n = n || i.getPropertyCSSValue("-" + o + "-" + e));
            return n;
          }),
          (s.prototype.animationName = function (t) {
            var e;
            try {
              e = this.vendorCSS(t, "animation-name").cssText;
            } catch (n) {
              e = window.getComputedStyle(t).getPropertyValue("animation-name");
            }
            return "none" === e ? "" : e;
          }),
          (s.prototype.cacheAnimationName = function (t) {
            return this.animationNameCache.set(t, this.animationName(t));
          }),
          (s.prototype.cachedAnimationName = function (t) {
            return this.animationNameCache.get(t);
          }),
          (s.prototype.scrollHandler = function () {
            return (this.scrolled = !0);
          }),
          (s.prototype.scrollCallback = function () {
            var t;
            return !this.scrolled ||
              ((this.scrolled = !1),
                (this.boxes = function () {
                  var e, n, i, o;
                  for (i = this.boxes, o = [], e = 0, n = i.length; n > e; e++)
                    (t = i[e]),
                      t && (this.isVisible(t) ? this.show(t) : o.push(t));
                  return o;
                }.call(this)),
                this.boxes.length || this.config.live)
              ? void 0
              : this.stop();
          }),
          (s.prototype.offsetTop = function (t) {
            for (var e; void 0 === t.offsetTop;) t = t.parentNode;
            for (e = t.offsetTop; (t = t.offsetParent);) e += t.offsetTop;
            return e;
          }),
          (s.prototype.isVisible = function (t) {
            var e, n, i, o, s;
            return (
              (n = t.getAttribute("data-wow-offset") || this.config.offset),
              (s = window.pageYOffset),
              (o = s + Math.min(this.element.clientHeight, innerHeight) - n),
              (i = this.offsetTop(t)),
              (e = i + t.clientHeight),
              o >= i && e >= s
            );
          }),
          (s.prototype.util = function () {
            return null != this._util ? this._util : (this._util = new e());
          }),
          (s.prototype.disabled = function () {
            return (
              !this.config.mobile && this.util().isMobile(navigator.userAgent)
            );
          }),
          s
        );
      })());
  }.call(this),
  "function" != typeof Object.create &&
  (Object.create = function (t) {
    function e() { }
    return (e.prototype = t), new e();
  }),
  (function (t, e, n) {
    var i = {
      init: function (e, n) {
        (this.$elem = t(n)),
          (this.options = t.extend(
            {},
            t.fn.owlCarousel.options,
            this.$elem.data(),
            e
          )),
          (this.userOptions = e),
          this.loadContent();
      },
      loadContent: function () {
        function e(t) {
          var e,
            i = "";
          if ("function" == typeof n.options.jsonSuccess)
            n.options.jsonSuccess.apply(this, [t]);
          else {
            for (e in t.owl) t.owl.hasOwnProperty(e) && (i += t.owl[e].item);
            n.$elem.html(i);
          }
          n.logIn();
        }
        var n = this,
          i;
        "function" == typeof n.options.beforeInit &&
          n.options.beforeInit.apply(this, [n.$elem]),
          "string" == typeof n.options.jsonPath
            ? ((i = n.options.jsonPath), t.getJSON(i, e))
            : n.logIn();
      },
      logIn: function () {
        this.$elem.data("owl-originalStyles", this.$elem.attr("style")),
          this.$elem.data("owl-originalClasses", this.$elem.attr("class")),
          this.$elem.css({ opacity: 0 }),
          (this.orignalItems = this.options.items),
          this.checkBrowser(),
          (this.wrapperWidth = 0),
          (this.checkVisible = null),
          this.setVars();
      },
      setVars: function () {
        return 0 === this.$elem.children().length
          ? !1
          : (this.baseClass(),
            this.eventTypes(),
            (this.$userItems = this.$elem.children()),
            (this.itemsAmount = this.$userItems.length),
            this.wrapItems(),
            (this.$owlItems = this.$elem.find(".owl-item")),
            (this.$owlWrapper = this.$elem.find(".owl-wrapper")),
            (this.playDirection = "next"),
            (this.prevItem = 0),
            (this.prevArr = [0]),
            (this.currentItem = 0),
            this.customEvents(),
            void this.onStartup());
      },
      onStartup: function () {
        this.updateItems(),
          this.calculateAll(),
          this.buildControls(),
          this.updateControls(),
          this.response(),
          this.moveEvents(),
          this.stopOnHover(),
          this.owlStatus(),
          !1 !== this.options.transitionStyle &&
          this.transitionTypes(this.options.transitionStyle),
          !0 === this.options.autoPlay && (this.options.autoPlay = 5e3),
          this.play(),
          this.$elem.find(".owl-wrapper").css("display", "block"),
          this.$elem.is(":visible")
            ? this.$elem.css("opacity", 1)
            : this.watchVisibility(),
          (this.onstartup = !1),
          this.eachMoveUpdate(),
          "function" == typeof this.options.afterInit &&
          this.options.afterInit.apply(this, [this.$elem]);
      },
      eachMoveUpdate: function () {
        !0 === this.options.lazyLoad && this.lazyLoad(),
          !0 === this.options.autoHeight && this.autoHeight(),
          this.onVisibleItems(),
          "function" == typeof this.options.afterAction &&
          this.options.afterAction.apply(this, [this.$elem]);
      },
      updateVars: function () {
        "function" == typeof this.options.beforeUpdate &&
          this.options.beforeUpdate.apply(this, [this.$elem]),
          this.watchVisibility(),
          this.updateItems(),
          this.calculateAll(),
          this.updatePosition(),
          this.updateControls(),
          this.eachMoveUpdate(),
          "function" == typeof this.options.afterUpdate &&
          this.options.afterUpdate.apply(this, [this.$elem]);
      },
      reload: function () {
        var t = this;
        e.setTimeout(function () {
          t.updateVars();
        }, 0);
      },
      watchVisibility: function () {
        var t = this;
        return !1 !== t.$elem.is(":visible")
          ? !1
          : (t.$elem.css({ opacity: 0 }),
            e.clearInterval(t.autoPlayInterval),
            e.clearInterval(t.checkVisible),
            void (t.checkVisible = e.setInterval(function () {
              t.$elem.is(":visible") &&
                (t.reload(),
                  t.$elem.animate({ opacity: 1 }, 200),
                  e.clearInterval(t.checkVisible));
            }, 500)));
      },
      wrapItems: function () {
        this.$userItems
          .wrapAll('<div class="owl-wrapper">')
          .wrap('<div class="owl-item"></div>'),
          this.$elem
            .find(".owl-wrapper")
            .wrap('<div class="owl-wrapper-outer">'),
          (this.wrapperOuter = this.$elem.find(".owl-wrapper-outer")),
          this.$elem.css("display", "block");
      },
      baseClass: function () {
        var t = this.$elem.hasClass(this.options.baseClass),
          e = this.$elem.hasClass(this.options.theme);
        t || this.$elem.addClass(this.options.baseClass),
          e || this.$elem.addClass(this.options.theme);
      },
      updateItems: function () {
        var e, n;
        if (!1 === this.options.responsive) return !1;
        if (!0 === this.options.singleItem)
          return (
            (this.options.items = this.orignalItems = 1),
            (this.options.itemsCustom = !1),
            (this.options.itemsDesktop = !1),
            (this.options.itemsDesktopSmall = !1),
            (this.options.itemsTablet = !1),
            (this.options.itemsTabletSmall = !1),
            (this.options.itemsMobile = !1)
          );
        if (
          ((e = t(this.options.responsiveBaseWidth).width()),
            e > (this.options.itemsDesktop[0] || this.orignalItems) &&
            (this.options.items = this.orignalItems),
            !1 !== this.options.itemsCustom)
        )
          for (
            this.options.itemsCustom.sort(function (t, e) {
              return t[0] - e[0];
            }),
            n = 0;
            n < this.options.itemsCustom.length;
            n += 1
          )
            this.options.itemsCustom[n][0] <= e &&
              (this.options.items = this.options.itemsCustom[n][1]);
        else
          e <= this.options.itemsDesktop[0] &&
            !1 !== this.options.itemsDesktop &&
            (this.options.items = this.options.itemsDesktop[1]),
            e <= this.options.itemsDesktopSmall[0] &&
            !1 !== this.options.itemsDesktopSmall &&
            (this.options.items = this.options.itemsDesktopSmall[1]),
            e <= this.options.itemsTablet[0] &&
            !1 !== this.options.itemsTablet &&
            (this.options.items = this.options.itemsTablet[1]),
            e <= this.options.itemsTabletSmall[0] &&
            !1 !== this.options.itemsTabletSmall &&
            (this.options.items = this.options.itemsTabletSmall[1]),
            e <= this.options.itemsMobile[0] &&
            !1 !== this.options.itemsMobile &&
            (this.options.items = this.options.itemsMobile[1]);
        this.options.items > this.itemsAmount &&
          !0 === this.options.itemsScaleUp &&
          (this.options.items = this.itemsAmount);
      },
      response: function () {
        var n = this,
          i,
          o;
        return !0 !== n.options.responsive
          ? !1
          : ((o = t(e).width()),
            (n.resizer = function () {
              t(e).width() !== o &&
                (!1 !== n.options.autoPlay &&
                  e.clearInterval(n.autoPlayInterval),
                  e.clearTimeout(i),
                  (i = e.setTimeout(function () {
                    (o = t(e).width()), n.updateVars();
                  }, n.options.responsiveRefreshRate)));
            }),
            void t(e).resize(n.resizer));
      },
      updatePosition: function () {
        this.jumpTo(this.currentItem),
          !1 !== this.options.autoPlay && this.checkAp();
      },
      appendItemsSizes: function () {
        var e = this,
          n = 0,
          i = e.itemsAmount - e.options.items;
        e.$owlItems.each(function (o) {
          var s = t(this);
          s.css({ width: e.itemWidth }).data("owl-item", Number(o)),
            (0 === o % e.options.items || o === i) && (o > i || (n += 1)),
            s.data("owl-roundPages", n);
        });
      },
      appendWrapperSizes: function () {
        this.$owlWrapper.css({
          width: this.$owlItems.length * this.itemWidth * 2,
          left: 0,
        }),
          this.appendItemsSizes();
      },
      calculateAll: function () {
        this.calculateWidth(),
          this.appendWrapperSizes(),
          this.loops(),
          this.max();
      },
      calculateWidth: function () {
        this.itemWidth = Math.round(this.$elem.width() / this.options.items);
      },
      max: function () {
        var t =
          -1 *
          (this.itemsAmount * this.itemWidth -
            this.options.items * this.itemWidth);
        return (
          this.options.items > this.itemsAmount
            ? (this.maximumPixels = t = this.maximumItem = 0)
            : ((this.maximumItem = this.itemsAmount - this.options.items),
              (this.maximumPixels = t)),
          t
        );
      },
      min: function () {
        return 0;
      },
      loops: function () {
        var e = 0,
          n = 0,
          i,
          o;
        for (
          this.positionsInArray = [0], this.pagesInArray = [], i = 0;
          i < this.itemsAmount;
          i += 1
        )
          (n += this.itemWidth),
            this.positionsInArray.push(-n),
            !0 === this.options.scrollPerPage &&
            ((o = t(this.$owlItems[i])),
              (o = o.data("owl-roundPages")),
              o !== e &&
              ((this.pagesInArray[e] = this.positionsInArray[i]), (e = o)));
      },
      buildControls: function () {
        (!0 === this.options.navigation || !0 === this.options.pagination) &&
          (this.owlControls = t('<div class="owl-controls"/>')
            .toggleClass("clickable", !this.browser.isTouch)
            .appendTo(this.$elem)),
          !0 === this.options.pagination && this.buildPagination(),
          !0 === this.options.navigation && this.buildButtons();
      },
      buildButtons: function () {
        var e = this,
          n = t('<div class="owl-buttons"/>');
        e.owlControls.append(n),
          (e.buttonPrev = t("<div/>", {
            class: "owl-prev",
            html: e.options.navigationText[0] || "",
          })),
          (e.buttonNext = t("<div/>", {
            class: "owl-next",
            html: e.options.navigationText[1] || "",
          })),
          n.append(e.buttonPrev).append(e.buttonNext),
          n.on(
            "touchstart.owlControls mousedown.owlControls",
            'div[class^="owl"]',
            function (t) {
              t.preventDefault();
            }
          ),
          n.on(
            "touchend.owlControls mouseup.owlControls",
            'div[class^="owl"]',
            function (n) {
              n.preventDefault(),
                t(this).hasClass("owl-next") ? e.next() : e.prev();
            }
          );
      },
      buildPagination: function () {
        var e = this;
        (e.paginationWrapper = t('<div class="owl-pagination"/>')),
          e.owlControls.append(e.paginationWrapper),
          e.paginationWrapper.on(
            "touchend.owlControls mouseup.owlControls",
            ".owl-page",
            function (n) {
              n.preventDefault(),
                Number(t(this).data("owl-page")) !== e.currentItem &&
                e.goTo(Number(t(this).data("owl-page")), !0);
            }
          );
      },
      updatePagination: function () {
        var e, n, i, o, s, a;
        if (!1 === this.options.pagination) return !1;
        for (
          this.paginationWrapper.html(""),
          e = 0,
          n = this.itemsAmount - (this.itemsAmount % this.options.items),
          o = 0;
          o < this.itemsAmount;
          o += 1
        )
          0 === o % this.options.items &&
            ((e += 1),
              n === o && (i = this.itemsAmount - this.options.items),
              (s = t("<div/>", { class: "owl-page" })),
              (a = t("<span></span>", {
                text: !0 === this.options.paginationNumbers ? e : "",
                class: !0 === this.options.paginationNumbers ? "owl-numbers" : "",
              })),
              s.append(a),
              s.data("owl-page", n === o ? i : o),
              s.data("owl-roundPages", e),
              this.paginationWrapper.append(s));
        this.checkPagination();
      },
      checkPagination: function () {
        var e = this;
        return !1 === e.options.pagination
          ? !1
          : void e.paginationWrapper.find(".owl-page").each(function () {
            t(this).data("owl-roundPages") ===
              t(e.$owlItems[e.currentItem]).data("owl-roundPages") &&
              (e.paginationWrapper.find(".owl-page").removeClass("active"),
                t(this).addClass("active"));
          });
      },
      checkNavigation: function () {
        return !1 === this.options.navigation
          ? !1
          : void (
            !1 === this.options.rewindNav &&
            (0 === this.currentItem && 0 === this.maximumItem
              ? (this.buttonPrev.addClass("disabled"),
                this.buttonNext.addClass("disabled"))
              : 0 === this.currentItem && 0 !== this.maximumItem
                ? (this.buttonPrev.addClass("disabled"),
                  this.buttonNext.removeClass("disabled"))
                : this.currentItem === this.maximumItem
                  ? (this.buttonPrev.removeClass("disabled"),
                    this.buttonNext.addClass("disabled"))
                  : 0 !== this.currentItem &&
                  this.currentItem !== this.maximumItem &&
                  (this.buttonPrev.removeClass("disabled"),
                    this.buttonNext.removeClass("disabled")))
          );
      },
      updateControls: function () {
        this.updatePagination(),
          this.checkNavigation(),
          this.owlControls &&
          (this.options.items >= this.itemsAmount
            ? this.owlControls.hide()
            : this.owlControls.show());
      },
      destroyControls: function () {
        this.owlControls && this.owlControls.remove();
      },
      next: function (t) {
        if (this.isTransition) return !1;
        if (
          ((this.currentItem +=
            !0 === this.options.scrollPerPage ? this.options.items : 1),
            this.currentItem >
            this.maximumItem +
            (!0 === this.options.scrollPerPage ? this.options.items - 1 : 0))
        ) {
          if (!0 !== this.options.rewindNav)
            return (this.currentItem = this.maximumItem), !1;
          (this.currentItem = 0), (t = "rewind");
        }
        this.goTo(this.currentItem, t);
      },
      prev: function (t) {
        if (this.isTransition) return !1;
        if (
          ((this.currentItem =
            !0 === this.options.scrollPerPage &&
              0 < this.currentItem &&
              this.currentItem < this.options.items
              ? 0
              : this.currentItem -
              (!0 === this.options.scrollPerPage ? this.options.items : 1)),
            0 > this.currentItem)
        ) {
          if (!0 !== this.options.rewindNav) return (this.currentItem = 0), !1;
          (this.currentItem = this.maximumItem), (t = "rewind");
        }
        this.goTo(this.currentItem, t);
      },
      goTo: function (t, n, i) {
        var o = this;
        return o.isTransition
          ? !1
          : ("function" == typeof o.options.beforeMove &&
            o.options.beforeMove.apply(this, [o.$elem]),
            t >= o.maximumItem ? (t = o.maximumItem) : 0 >= t && (t = 0),
            (o.currentItem = o.owl.currentItem = t),
            !1 !== o.options.transitionStyle &&
              "drag" !== i &&
              1 === o.options.items &&
              !0 === o.browser.support3d
              ? (o.swapSpeed(0),
                !0 === o.browser.support3d
                  ? o.transition3d(o.positionsInArray[t])
                  : o.css2slide(o.positionsInArray[t], 1),
                o.afterGo(),
                o.singleItemTransition(),
                !1)
              : ((t = o.positionsInArray[t]),
                !0 === o.browser.support3d
                  ? ((o.isCss3Finish = !1),
                    !0 === n
                      ? (o.swapSpeed("paginationSpeed"),
                        e.setTimeout(function () {
                          o.isCss3Finish = !0;
                        }, o.options.paginationSpeed))
                      : "rewind" === n
                        ? (o.swapSpeed(o.options.rewindSpeed),
                          e.setTimeout(function () {
                            o.isCss3Finish = !0;
                          }, o.options.rewindSpeed))
                        : (o.swapSpeed("slideSpeed"),
                          e.setTimeout(function () {
                            o.isCss3Finish = !0;
                          }, o.options.slideSpeed)),
                    o.transition3d(t))
                  : !0 === n
                    ? o.css2slide(t, o.options.paginationSpeed)
                    : "rewind" === n
                      ? o.css2slide(t, o.options.rewindSpeed)
                      : o.css2slide(t, o.options.slideSpeed),
                void o.afterGo()));
      },
      jumpTo: function (t) {
        "function" == typeof this.options.beforeMove &&
          this.options.beforeMove.apply(this, [this.$elem]),
          t >= this.maximumItem || -1 === t
            ? (t = this.maximumItem)
            : 0 >= t && (t = 0),
          this.swapSpeed(0),
          !0 === this.browser.support3d
            ? this.transition3d(this.positionsInArray[t])
            : this.css2slide(this.positionsInArray[t], 1),
          (this.currentItem = this.owl.currentItem = t),
          this.afterGo();
      },
      afterGo: function () {
        this.prevArr.push(this.currentItem),
          (this.prevItem = this.owl.prevItem =
            this.prevArr[this.prevArr.length - 2]),
          this.prevArr.shift(0),
          this.prevItem !== this.currentItem &&
          (this.checkPagination(),
            this.checkNavigation(),
            this.eachMoveUpdate(),
            !1 !== this.options.autoPlay && this.checkAp()),
          "function" == typeof this.options.afterMove &&
          this.prevItem !== this.currentItem &&
          this.options.afterMove.apply(this, [this.$elem]);
      },
      stop: function () {
        (this.apStatus = "stop"), e.clearInterval(this.autoPlayInterval);
      },
      checkAp: function () {
        "stop" !== this.apStatus && this.play();
      },
      play: function () {
        var t = this;
        return (
          (t.apStatus = "play"),
          !1 === t.options.autoPlay
            ? !1
            : (e.clearInterval(t.autoPlayInterval),
              void (t.autoPlayInterval = e.setInterval(function () {
                t.next(!0);
              }, t.options.autoPlay)))
        );
      },
      swapSpeed: function (t) {
        "slideSpeed" === t
          ? this.$owlWrapper.css(this.addCssSpeed(this.options.slideSpeed))
          : "paginationSpeed" === t
            ? this.$owlWrapper.css(this.addCssSpeed(this.options.paginationSpeed))
            : "string" != typeof t && this.$owlWrapper.css(this.addCssSpeed(t));
      },
      addCssSpeed: function (t) {
        return {
          "-webkit-transition": "all " + t + "ms ease",
          "-moz-transition": "all " + t + "ms ease",
          "-o-transition": "all " + t + "ms ease",
          transition: "all " + t + "ms ease",
        };
      },
      removeTransition: function () {
        return {
          "-webkit-transition": "",
          "-moz-transition": "",
          "-o-transition": "",
          transition: "",
        };
      },
      doTranslate: function (t) {
        return {
          "-webkit-transform": "translate3d(" + t + "px, 0px, 0px)",
          "-moz-transform": "translate3d(" + t + "px, 0px, 0px)",
          "-o-transform": "translate3d(" + t + "px, 0px, 0px)",
          "-ms-transform": "translate3d(" + t + "px, 0px, 0px)",
          transform: "translate3d(" + t + "px, 0px,0px)",
        };
      },
      transition3d: function (t) {
        this.$owlWrapper.css(this.doTranslate(t));
      },
      css2move: function (t) {
        this.$owlWrapper.css({ left: t });
      },
      css2slide: function (t, e) {
        var n = this;
        (n.isCssFinish = !1),
          n.$owlWrapper.stop(!0, !0).animate(
            { left: t },
            {
              duration: e || n.options.slideSpeed,
              complete: function () {
                n.isCssFinish = !0;
              },
            }
          );
      },
      checkBrowser: function () {
        var t = n.createElement("div");
        (t.style.cssText =
          "  -moz-transform:translate3d(0px, 0px, 0px); -ms-transform:translate3d(0px, 0px, 0px); -o-transform:translate3d(0px, 0px, 0px); -webkit-transform:translate3d(0px, 0px, 0px); transform:translate3d(0px, 0px, 0px)"),
          (t = t.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g)),
          (this.browser = {
            support3d: null !== t && 1 === t.length,
            isTouch: "ontouchstart" in e || e.navigator.msMaxTouchPoints,
          });
      },
      moveEvents: function () {
        (!1 !== this.options.mouseDrag || !1 !== this.options.touchDrag) &&
          (this.gestures(), this.disabledEvents());
      },
      eventTypes: function () {
        var t = ["s", "e", "x"];
        (this.ev_types = {}),
          !0 === this.options.mouseDrag && !0 === this.options.touchDrag
            ? (t = [
              "touchstart.owl mousedown.owl",
              "touchmove.owl mousemove.owl",
              "touchend.owl touchcancel.owl mouseup.owl",
            ])
            : !1 === this.options.mouseDrag && !0 === this.options.touchDrag
              ? (t = [
                "touchstart.owl",
                "touchmove.owl",
                "touchend.owl touchcancel.owl",
              ])
              : !0 === this.options.mouseDrag &&
              !1 === this.options.touchDrag &&
              (t = ["mousedown.owl", "mousemove.owl", "mouseup.owl"]),
          (this.ev_types.start = t[0]),
          (this.ev_types.move = t[1]),
          (this.ev_types.end = t[2]);
      },
      disabledEvents: function () {
        this.$elem.on("dragstart.owl", function (t) {
          t.preventDefault();
        }),
          this.$elem.on("mousedown.disableTextSelect", function (e) {
            return t(e.target).is("input, textarea, select, option");
          });
      },
      gestures: function () {
        function i(t) {
          if (void 0 !== t.touches)
            return { x: t.touches[0].pageX, y: t.touches[0].pageY };
          if (void 0 === t.touches) {
            if (void 0 !== t.pageX) return { x: t.pageX, y: t.pageY };
            if (void 0 === t.pageX) return { x: t.clientX, y: t.clientY };
          }
        }
        function o(e) {
          "on" === e
            ? (t(n).on(r.ev_types.move, s), t(n).on(r.ev_types.end, a))
            : "off" === e &&
            (t(n).off(r.ev_types.move), t(n).off(r.ev_types.end));
        }
        function s(o) {
          (o = o.originalEvent || o || e.event),
            (r.newPosX = i(o).x - l.offsetX),
            (r.newPosY = i(o).y - l.offsetY),
            (r.newRelativeX = r.newPosX - l.relativePos),
            "function" == typeof r.options.startDragging &&
            !0 !== l.dragging &&
            0 !== r.newRelativeX &&
            ((l.dragging = !0), r.options.startDragging.apply(r, [r.$elem])),
            (8 < r.newRelativeX || -8 > r.newRelativeX) &&
            !0 === r.browser.isTouch &&
            (void 0 !== o.preventDefault
              ? o.preventDefault()
              : (o.returnValue = !1),
              (l.sliding = !0)),
            (10 < r.newPosY || -10 > r.newPosY) &&
            !1 === l.sliding &&
            t(n).off("touchmove.owl"),
            (r.newPosX = Math.max(
              Math.min(r.newPosX, r.newRelativeX / 5),
              r.maximumPixels + r.newRelativeX / 5
            )),
            !0 === r.browser.support3d
              ? r.transition3d(r.newPosX)
              : r.css2move(r.newPosX);
        }
        function a(n) {
          n = n.originalEvent || n || e.event;
          var i;
          (n.target = n.target || n.srcElement),
            (l.dragging = !1),
            !0 !== r.browser.isTouch && r.$owlWrapper.removeClass("grabbing"),
            (r.dragDirection = r.owl.dragDirection =
              0 > r.newRelativeX ? "left" : "right"),
            0 !== r.newRelativeX &&
            ((i = r.getNewPosition()),
              r.goTo(i, !1, "drag"),
              l.targetElement === n.target &&
              !0 !== r.browser.isTouch &&
              (t(n.target).on("click.disable", function (e) {
                e.stopImmediatePropagation(),
                  e.stopPropagation(),
                  e.preventDefault(),
                  t(e.target).off("click.disable");
              }),
                (n = t._data(n.target, "events").click),
                (i = n.pop()),
                n.splice(0, 0, i))),
            o("off");
        }
        var r = this,
          l = {
            offsetX: 0,
            offsetY: 0,
            baseElWidth: 0,
            relativePos: 0,
            position: null,
            minSwipe: null,
            maxSwipe: null,
            sliding: null,
            dargging: null,
            targetElement: null,
          };
        (r.isCssFinish = !0),
          r.$elem.on(r.ev_types.start, ".owl-wrapper", function (n) {
            n = n.originalEvent || n || e.event;
            var s;
            if (3 === n.which) return !1;
            if (!(r.itemsAmount <= r.options.items)) {
              if (
                (!1 === r.isCssFinish && !r.options.dragBeforeAnimFinish) ||
                (!1 === r.isCss3Finish && !r.options.dragBeforeAnimFinish)
              )
                return !1;
              !1 !== r.options.autoPlay && e.clearInterval(r.autoPlayInterval),
                !0 === r.browser.isTouch ||
                r.$owlWrapper.hasClass("grabbing") ||
                r.$owlWrapper.addClass("grabbing"),
                (r.newPosX = 0),
                (r.newRelativeX = 0),
                t(this).css(r.removeTransition()),
                (s = t(this).position()),
                (l.relativePos = s.left),
                (l.offsetX = i(n).x - s.left),
                (l.offsetY = i(n).y - s.top),
                o("on"),
                (l.sliding = !1),
                (l.targetElement = n.target || n.srcElement);
            }
          });
      },
      getNewPosition: function () {
        var t = this.closestItem();
        return (
          t > this.maximumItem
            ? (t = this.currentItem = this.maximumItem)
            : 0 <= this.newPosX && (this.currentItem = t = 0),
          t
        );
      },
      closestItem: function () {
        var e = this,
          n =
            !0 === e.options.scrollPerPage
              ? e.pagesInArray
              : e.positionsInArray,
          i = e.newPosX,
          o = null;
        return (
          t.each(n, function (s, a) {
            i - e.itemWidth / 20 > n[s + 1] &&
              i - e.itemWidth / 20 < a &&
              "left" === e.moveDirection()
              ? ((o = a),
                (e.currentItem =
                  !0 === e.options.scrollPerPage
                    ? t.inArray(o, e.positionsInArray)
                    : s))
              : i + e.itemWidth / 20 < a &&
              i + e.itemWidth / 20 > (n[s + 1] || n[s] - e.itemWidth) &&
              "right" === e.moveDirection() &&
              (!0 === e.options.scrollPerPage
                ? ((o = n[s + 1] || n[n.length - 1]),
                  (e.currentItem = t.inArray(o, e.positionsInArray)))
                : ((o = n[s + 1]), (e.currentItem = s + 1)));
          }),
          e.currentItem
        );
      },
      moveDirection: function () {
        var t;
        return (
          0 > this.newRelativeX
            ? ((t = "right"), (this.playDirection = "next"))
            : ((t = "left"), (this.playDirection = "prev")),
          t
        );
      },
      customEvents: function () {
        var t = this;
        t.$elem.on("owl.next", function () {
          t.next();
        }),
          t.$elem.on("owl.prev", function () {
            t.prev();
          }),
          t.$elem.on("owl.play", function (e, n) {
            (t.options.autoPlay = n), t.play(), (t.hoverStatus = "play");
          }),
          t.$elem.on("owl.stop", function () {
            t.stop(), (t.hoverStatus = "stop");
          }),
          t.$elem.on("owl.goTo", function (e, n) {
            t.goTo(n);
          }),
          t.$elem.on("owl.jumpTo", function (e, n) {
            t.jumpTo(n);
          });
      },
      stopOnHover: function () {
        var t = this;
        !0 === t.options.stopOnHover &&
          !0 !== t.browser.isTouch &&
          !1 !== t.options.autoPlay &&
          (t.$elem.on("mouseover", function () {
            t.stop();
          }),
            t.$elem.on("mouseout", function () {
              "stop" !== t.hoverStatus && t.play();
            }));
      },
      lazyLoad: function () {
        var e, n, i, o, s;
        if (!1 === this.options.lazyLoad) return !1;
        for (e = 0; e < this.itemsAmount; e += 1)
          (n = t(this.$owlItems[e])),
            "loaded" !== n.data("owl-loaded") &&
            ((i = n.data("owl-item")),
              (o = n.find(".lazyOwl")),
              "string" != typeof o.data("src")
                ? n.data("owl-loaded", "loaded")
                : (void 0 === n.data("owl-loaded") &&
                  (o.hide(),
                    n.addClass("loading").data("owl-loaded", "checked")),
                  (s =
                    !0 === this.options.lazyFollow
                      ? i >= this.currentItem
                      : !0) &&
                  i < this.currentItem + this.options.items &&
                  o.length &&
                  this.lazyPreload(n, o)));
      },
      lazyPreload: function (t, n) {
        function i() {
          t.data("owl-loaded", "loaded").removeClass("loading"),
            n.removeAttr("data-src"),
            "fade" === s.options.lazyEffect ? n.fadeIn(400) : n.show(),
            "function" == typeof s.options.afterLazyLoad &&
            s.options.afterLazyLoad.apply(this, [s.$elem]);
        }
        function o() {
          (a += 1),
            s.completeImg(n.get(0)) || !0 === r
              ? i()
              : 100 >= a
                ? e.setTimeout(o, 100)
                : i();
        }
        var s = this,
          a = 0,
          r;
        "DIV" === n.prop("tagName")
          ? (n.css("background-image", "url(" + n.data("src") + ")"), (r = !0))
          : (n[0].src = n.data("src")),
          o();
      },
      autoHeight: function () {
        function n() {
          var n = t(o.$owlItems[o.currentItem]).height();
          o.wrapperOuter.css("height", n + "px"),
            o.wrapperOuter.hasClass("autoHeight") ||
            e.setTimeout(function () {
              o.wrapperOuter.addClass("autoHeight");
            }, 0);
        }
        function i() {
          (a += 1),
            o.completeImg(s.get(0))
              ? n()
              : 100 >= a
                ? e.setTimeout(i, 100)
                : o.wrapperOuter.css("height", "");
        }
        var o = this,
          s = t(o.$owlItems[o.currentItem]).find("img"),
          a;
        void 0 !== s.get(0) ? ((a = 0), i()) : n();
      },
      completeImg: function (t) {
        return !t.complete ||
          ("undefined" != typeof t.naturalWidth && 0 === t.naturalWidth)
          ? !1
          : !0;
      },
      onVisibleItems: function () {
        var e;
        for (
          !0 === this.options.addClassActive &&
          this.$owlItems.removeClass("active"),
          this.visibleItems = [],
          e = this.currentItem;
          e < this.currentItem + this.options.items;
          e += 1
        )
          this.visibleItems.push(e),
            !0 === this.options.addClassActive &&
            t(this.$owlItems[e]).addClass("active");
        this.owl.visibleItems = this.visibleItems;
      },
      transitionTypes: function (t) {
        (this.outClass = "owl-" + t + "-out"),
          (this.inClass = "owl-" + t + "-in");
      },
      singleItemTransition: function () {
        var t = this,
          e = t.outClass,
          n = t.inClass,
          i = t.$owlItems.eq(t.currentItem),
          o = t.$owlItems.eq(t.prevItem),
          s =
            Math.abs(t.positionsInArray[t.currentItem]) +
            t.positionsInArray[t.prevItem],
          a = Math.abs(t.positionsInArray[t.currentItem]) + t.itemWidth / 2;
        (t.isTransition = !0),
          t.$owlWrapper
            .addClass("owl-origin")
            .css({
              "-webkit-transform-origin": a + "px",
              "-moz-perspective-origin": a + "px",
              "perspective-origin": a + "px",
            }),
          o
            .css({ position: "relative", left: s + "px" })
            .addClass(e)
            .on(
              "webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend",
              function () {
                (t.endPrev = !0),
                  o.off(
                    "webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend"
                  ),
                  t.clearTransStyle(o, e);
              }
            ),
          i
            .addClass(n)
            .on(
              "webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend",
              function () {
                (t.endCurrent = !0),
                  i.off(
                    "webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend"
                  ),
                  t.clearTransStyle(i, n);
              }
            );
      },
      clearTransStyle: function (t, e) {
        t.css({ position: "", left: "" }).removeClass(e),
          this.endPrev &&
          this.endCurrent &&
          (this.$owlWrapper.removeClass("owl-origin"),
            (this.isTransition = this.endCurrent = this.endPrev = !1));
      },
      owlStatus: function () {
        this.owl = {
          userOptions: this.userOptions,
          baseElement: this.$elem,
          userItems: this.$userItems,
          owlItems: this.$owlItems,
          currentItem: this.currentItem,
          prevItem: this.prevItem,
          visibleItems: this.visibleItems,
          isTouch: this.browser.isTouch,
          browser: this.browser,
          dragDirection: this.dragDirection,
        };
      },
      clearEvents: function () {
        this.$elem.off(".owl owl mousedown.disableTextSelect"),
          t(n).off(".owl owl"),
          t(e).off("resize", this.resizer);
      },
      unWrap: function () {
        0 !== this.$elem.children().length &&
          (this.$owlWrapper.unwrap(),
            this.$userItems.unwrap().unwrap(),
            this.owlControls && this.owlControls.remove()),
          this.clearEvents(),
          this.$elem
            .attr("style", this.$elem.data("owl-originalStyles") || "")
            .attr("class", this.$elem.data("owl-originalClasses"));
      },
      destroy: function () {
        this.stop(),
          e.clearInterval(this.checkVisible),
          this.unWrap(),
          this.$elem.removeData();
      },
      reinit: function (e) {
        (e = t.extend({}, this.userOptions, e)),
          this.unWrap(),
          this.init(e, this.$elem);
      },
      addItem: function (t, e) {
        var n;
        return t
          ? 0 === this.$elem.children().length
            ? (this.$elem.append(t), this.setVars(), !1)
            : (this.unWrap(),
              (n = void 0 === e || -1 === e ? -1 : e),
              n >= this.$userItems.length || -1 === n
                ? this.$userItems.eq(-1).after(t)
                : this.$userItems.eq(n).before(t),
              void this.setVars())
          : !1;
      },
      removeItem: function (t) {
        return 0 === this.$elem.children().length
          ? !1
          : ((t = void 0 === t || -1 === t ? -1 : t),
            this.unWrap(),
            this.$userItems.eq(t).remove(),
            void this.setVars());
      },
    };
    (t.fn.owlCarousel = function (e) {
      return this.each(function () {
        if (!0 === t(this).data("owl-init")) return !1;
        t(this).data("owl-init", !0);
        var n = Object.create(i);
        n.init(e, this), t.data(this, "owlCarousel", n);
      });
    }),
      (t.fn.owlCarousel.options = {
        items: 5,
        itemsCustom: !1,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 3],
        itemsTablet: [768, 2],
        itemsTabletSmall: !1,
        itemsMobile: [479, 1],
        singleItem: !1,
        itemsScaleUp: !1,
        slideSpeed: 200,
        paginationSpeed: 800,
        rewindSpeed: 1e3,
        autoPlay: !1,
        stopOnHover: !1,
        navigation: !1,
        navigationText: ["prev", "next"],
        rewindNav: !0,
        scrollPerPage: !1,
        pagination: !0,
        paginationNumbers: !1,
        responsive: !0,
        responsiveRefreshRate: 200,
        responsiveBaseWidth: e,
        baseClass: "owl-carousel",
        theme: "owl-theme",
        lazyLoad: !1,
        lazyFollow: !0,
        lazyEffect: "fade",
        autoHeight: !1,
        jsonPath: !1,
        jsonSuccess: !1,
        dragBeforeAnimFinish: !0,
        mouseDrag: !0,
        touchDrag: !0,
        addClassActive: !1,
        transitionStyle: !1,
        beforeUpdate: !1,
        afterUpdate: !1,
        beforeInit: !1,
        afterInit: !1,
        beforeMove: !1,
        afterMove: !1,
        afterAction: !1,
        startDragging: !1,
        afterLazyLoad: !1,
      });
  })(jQuery, window, document),
  !(function (t, e) {
    function n(t) {
      return "object" == typeof t;
    }
    function i(t) {
      return "string" == typeof t;
    }
    function o(t) {
      return "number" == typeof t;
    }
    function s(t) {
      return t === e;
    }
    function a() {
      (B = google.maps),
        W ||
        (W = {
          verbose: !1,
          queryLimit: { attempt: 5, delay: 250, random: 250 },
          classes: (function () {
            var e = {};
            return (
              t.each(
                "Map Marker InfoWindow Circle Rectangle OverlayView StreetViewPanorama KmlLayer TrafficLayer BicyclingLayer GroundOverlay StyledMapType ImageMapType".split(
                  " "
                ),
                function (t, n) {
                  e[n] = B[n];
                }
              ),
              e
            );
          })(),
          map: {
            mapTypeId: B.MapTypeId.ROADMAP,
            center: [46.578498, 2.457275],
            zoom: 2,
          },
          overlay: { pane: "floatPane", content: "", offset: { x: 0, y: 0 } },
          geoloc: { getCurrentPosition: { maximumAge: 6e4, timeout: 5e3 } },
        });
    }
    function r(t, e) {
      return s(t) ? "gmap3_" + (e ? j + 1 : ++j) : t;
    }
    function l(t) {
      var e,
        n = B.version.split(".");
      for (t = t.split("."), e = 0; e < n.length; e++)
        n[e] = parseInt(n[e], 10);
      for (e = 0; e < t.length; e++) {
        if (((t[e] = parseInt(t[e], 10)), !n.hasOwnProperty(e))) return !1;
        if (n[e] < t[e]) return !1;
      }
      return !0;
    }
    function u(e, n, i, o, s) {
      function a(n, o) {
        n &&
          t.each(n, function (t, n) {
            var a = e,
              r = n;
            R(n) && ((a = n[0]), (r = n[1])),
              o(i, t, function (t) {
                r.apply(a, [s || i, t, l]);
              });
          });
      }
      var r = n.td || {},
        l = { id: o, data: r.data, tag: r.tag };
      a(r.events, B.event.addListener), a(r.onces, B.event.addListenerOnce);
    }
    function c(t) {
      var e,
        n = [];
      for (e in t) t.hasOwnProperty(e) && n.push(e);
      return n;
    }
    function d(t, e) {
      var n,
        i = arguments;
      for (n = 2; n < i.length; n++)
        if (e in i[n] && i[n].hasOwnProperty(e)) return void (t[e] = i[n][e]);
    }
    function p(e, n) {
      var i,
        o,
        s = ["data", "tag", "id", "events", "onces"],
        a = {};
      if (e.td)
        for (i in e.td)
          e.td.hasOwnProperty(i) &&
            "options" !== i &&
            "values" !== i &&
            (a[i] = e.td[i]);
      for (o = 0; o < s.length; o++) d(a, s[o], n, e.td);
      return (a.options = t.extend({}, e.opts || {}, n.options || {})), a;
    }
    function h() {
      if (W.verbose) {
        var t,
          e = [];
        if (window.console && H(console.error)) {
          for (t = 0; t < arguments.length; t++) e.push(arguments[t]);
          console.error.apply(console, e);
        } else {
          for (e = "", t = 0; t < arguments.length; t++)
            e += arguments[t].toString() + " ";
          alert(e);
        }
      }
    }
    function f(t) {
      return (o(t) || i(t)) && "" !== t && !isNaN(t);
    }
    function m(t) {
      var e,
        i = [];
      if (!s(t))
        if (n(t))
          if (o(t.length)) i = t;
          else for (e in t) i.push(t[e]);
        else i.push(t);
      return i;
    }
    function v(e) {
      return e
        ? H(e)
          ? e
          : ((e = m(e)),
            function (i) {
              var o;
              if (s(i)) return !1;
              if (n(i)) {
                for (o = 0; o < i.length; o++)
                  if (t.inArray(i[o], e) >= 0) return !0;
                return !1;
              }
              return t.inArray(i, e) >= 0;
            })
        : void 0;
    }
    function g(t, e, n) {
      var o = e ? t : null;
      return !t || i(t)
        ? o
        : t.latLng
          ? g(t.latLng)
          : t instanceof B.LatLng
            ? t
            : f(t.lat)
              ? new B.LatLng(t.lat, t.lng)
              : !n && R(t) && f(t[0]) && f(t[1])
                ? new B.LatLng(t[0], t[1])
                : o;
    }
    function y(t) {
      var e, n;
      return !t || t instanceof B.LatLngBounds
        ? t || null
        : (R(t)
          ? 2 === t.length
            ? ((e = g(t[0])), (n = g(t[1])))
            : 4 === t.length && ((e = g([t[0], t[1]])), (n = g([t[2], t[3]])))
          : "ne" in t && "sw" in t
            ? ((e = g(t.ne)), (n = g(t.sw)))
            : "n" in t &&
            "e" in t &&
            "s" in t &&
            "w" in t &&
            ((e = g([t.n, t.e])), (n = g([t.s, t.w]))),
          e && n ? new B.LatLngBounds(n, e) : null);
    }
    function w(t, e, n, o, s) {
      var a = n ? g(o.td, !1, !0) : !1,
        r = a
          ? { latLng: a }
          : o.td.address
            ? i(o.td.address)
              ? { address: o.td.address }
              : o.td.address
            : !1,
        l = r ? U.get(r) : !1,
        u = this;
      r
        ? ((s = s || 0),
          l
            ? ((o.latLng = l.results[0].geometry.location),
              (o.results = l.results),
              (o.status = l.status),
              e.apply(t, [o]))
            : (r.location && (r.location = g(r.location)),
              r.bounds && (r.bounds = y(r.bounds)),
              C().geocode(r, function (i, a) {
                a === B.GeocoderStatus.OK
                  ? (U.store(r, { results: i, status: a }),
                    (o.latLng = i[0].geometry.location),
                    (o.results = i),
                    (o.status = a),
                    e.apply(t, [o]))
                  : a === B.GeocoderStatus.OVER_QUERY_LIMIT &&
                    s < W.queryLimit.attempt
                    ? setTimeout(function () {
                      w.apply(u, [t, e, n, o, s + 1]);
                    }, W.queryLimit.delay +
                    Math.floor(Math.random() * W.queryLimit.random))
                    : (h("geocode failed", a, r),
                      (o.latLng = o.results = !1),
                      (o.status = a),
                      e.apply(t, [o]));
              })))
        : ((o.latLng = g(o.td, !1, !0)), e.apply(t, [o]));
    }
    function b(e, n, i, o) {
      function s() {
        do r++;
        while (r < e.length && !("address" in e[r]));
        return r >= e.length
          ? void i.apply(n, [o])
          : void w(
            a,
            function (n) {
              delete n.td, t.extend(e[r], n), s.apply(a, []);
            },
            !0,
            { td: e[r] }
          );
      }
      var a = this,
        r = -1;
      s();
    }
    function x(t, e, n) {
      var i = !1;
      navigator && navigator.geolocation
        ? navigator.geolocation.getCurrentPosition(
          function (o) {
            i ||
              ((i = !0),
                (n.latLng = new B.LatLng(
                  o.coords.latitude,
                  o.coords.longitude
                )),
                e.apply(t, [n]));
          },
          function () {
            i || ((i = !0), (n.latLng = !1), e.apply(t, [n]));
          },
          n.opts.getCurrentPosition
        )
        : ((n.latLng = !1), e.apply(t, [n]));
    }
    function S(t) {
      var e,
        i = !1;
      if (n(t) && t.hasOwnProperty("get")) {
        for (e in t) if ("get" !== e) return !1;
        i = !t.get.hasOwnProperty("callback");
      }
      return i;
    }
    function C() {
      return q.geocoder || (q.geocoder = new B.Geocoder()), q.geocoder;
    }
    function I() {
      var t = [];
      (this.get = function (e) {
        if (t.length) {
          var i,
            o,
            s,
            a,
            r,
            l = c(e);
          for (i = 0; i < t.length; i++) {
            for (
              a = t[i], r = l.length === a.keys.length, o = 0;
              o < l.length && r;
              o++
            )
              (s = l[o]),
                (r = s in a.request),
                r &&
                (r =
                  n(e[s]) && "equals" in e[s] && H(e[s])
                    ? e[s].equals(a.request[s])
                    : e[s] === a.request[s]);
            if (r) return a.results;
          }
        }
      }),
        (this.store = function (e, n) {
          t.push({ request: e, keys: c(e), results: n });
        });
    }
    function P() {
      var t = [],
        e = this;
      (e.empty = function () {
        return !t.length;
      }),
        (e.add = function (e) {
          t.push(e);
        }),
        (e.get = function () {
          return t.length ? t[0] : !1;
        }),
        (e.ack = function () {
          t.shift();
        });
    }
    function T() {
      function e(t) {
        return {
          id: t.id,
          name: t.name,
          object: t.obj,
          tag: t.tag,
          data: t.data,
        };
      }
      function n(t) {
        H(t.setMap) && t.setMap(null),
          H(t.remove) && t.remove(),
          H(t.free) && t.free(),
          (t = null);
      }
      var i = {},
        o = {},
        a = this;
      (a.add = function (t, e, n, s) {
        var l = t.td || {},
          u = r(l.id);
        return (
          i[e] || (i[e] = []),
          u in o && a.clearById(u),
          (o[u] = { obj: n, sub: s, name: e, id: u, tag: l.tag, data: l.data }),
          i[e].push(u),
          u
        );
      }),
        (a.getById = function (t, n, i) {
          var s = !1;
          return t in o && (s = n ? o[t].sub : i ? e(o[t]) : o[t].obj), s;
        }),
        (a.get = function (t, n, s, a) {
          var r,
            l,
            u = v(s);
          if (!i[t] || !i[t].length) return null;
          for (r = i[t].length; r;)
            if ((r--, (l = i[t][n ? r : i[t].length - r - 1]), l && o[l])) {
              if (u && !u(o[l].tag)) continue;
              return a ? e(o[l]) : o[l].obj;
            }
          return null;
        }),
        (a.all = function (t, n, a) {
          var r = [],
            l = v(n),
            u = function (t) {
              var n, s;
              for (n = 0; n < i[t].length; n++)
                if (((s = i[t][n]), s && o[s])) {
                  if (l && !l(o[s].tag)) continue;
                  r.push(a ? e(o[s]) : o[s].obj);
                }
            };
          if (t in i) u(t);
          else if (s(t)) for (t in i) u(t);
          return r;
        }),
        (a.rm = function (t, e, n) {
          var s, r;
          if (!i[t]) return !1;
          if (e)
            if (n)
              for (
                s = i[t].length - 1;
                s >= 0 && ((r = i[t][s]), !e(o[r].tag));
                s--
              );
            else
              for (
                s = 0;
                s < i[t].length && ((r = i[t][s]), !e(o[r].tag));
                s++
              );
          else s = n ? i[t].length - 1 : 0;
          return s in i[t] ? a.clearById(i[t][s], s) : !1;
        }),
        (a.clearById = function (t, e) {
          if (t in o) {
            var a,
              r = o[t].name;
            for (a = 0; s(e) && a < i[r].length; a++) t === i[r][a] && (e = a);
            return (
              n(o[t].obj),
              o[t].sub && n(o[t].sub),
              delete o[t],
              i[r].splice(e, 1),
              !0
            );
          }
          return !1;
        }),
        (a.objGetById = function (t) {
          var e, n;
          if (i.clusterer)
            for (n in i.clusterer)
              if ((e = o[i.clusterer[n]].obj.getById(t)) !== !1) return e;
          return !1;
        }),
        (a.objClearById = function (t) {
          var e;
          if (i.clusterer)
            for (e in i.clusterer)
              if (o[i.clusterer[e]].obj.clearById(t)) return !0;
          return null;
        }),
        (a.clear = function (t, e, n, o) {
          var s,
            r,
            l,
            u = v(o);
          if (t && t.length) t = m(t);
          else {
            t = [];
            for (s in i) t.push(s);
          }
          for (r = 0; r < t.length; r++)
            if (((l = t[r]), e)) a.rm(l, u, !0);
            else if (n) a.rm(l, u, !1);
            else for (; a.rm(l, u, !1););
        }),
        (a.objClear = function (e, n, s, a) {
          var r;
          if (i.clusterer && (t.inArray("marker", e) >= 0 || !e.length))
            for (r in i.clusterer) o[i.clusterer[r]].obj.clear(n, s, a);
        });
    }
    function A(e, n, o) {
      function s(t) {
        var e = {};
        return (e[t] = {}), e;
      }
      function a() {
        var t;
        for (t in o) if (o.hasOwnProperty(t) && !l.hasOwnProperty(t)) return t;
      }
      var r,
        l = {},
        u = this,
        c = {
          latLng: {
            map: !1,
            marker: !1,
            infowindow: !1,
            circle: !1,
            overlay: !1,
            getlatlng: !1,
            getmaxzoom: !1,
            getelevation: !1,
            streetviewpanorama: !1,
            getaddress: !0,
          },
          geoloc: { getgeoloc: !0 },
        };
      i(o) && (o = s(o)),
        (u.run = function () {
          for (var i, s; (i = a());) {
            if (H(e[i]))
              return (
                (r = i),
                (s = t.extend(!0, {}, W[i] || {}, o[i].options || {})),
                void (i in c.latLng
                  ? o[i].values
                    ? b(o[i].values, e, e[i], { td: o[i], opts: s, session: l })
                    : w(e, e[i], c.latLng[i], { td: o[i], opts: s, session: l })
                  : i in c.geoloc
                    ? x(e, e[i], { td: o[i], opts: s, session: l })
                    : e[i].apply(e, [{ td: o[i], opts: s, session: l }]))
              );
            l[i] = null;
          }
          n.apply(e, [o, l]);
        }),
        (u.ack = function (t) {
          (l[r] = t), u.run.apply(u, []);
        });
    }
    function M() {
      return q.ds || (q.ds = new B.DirectionsService()), q.ds;
    }
    function _() {
      return q.dms || (q.dms = new B.DistanceMatrixService()), q.dms;
    }
    function k() {
      return q.mzs || (q.mzs = new B.MaxZoomService()), q.mzs;
    }
    function L() {
      return q.es || (q.es = new B.ElevationService()), q.es;
    }
    function E(t) {
      function e() {
        var t = this;
        return (
          (t.onAdd = function () { }),
          (t.onRemove = function () { }),
          (t.draw = function () { }),
          W.classes.OverlayView.apply(t, [])
        );
      }
      e.prototype = W.classes.OverlayView.prototype;
      var n = new e();
      return n.setMap(t), n;
    }
    function N(e, i, o) {
      function s(t) {
        N[t] ||
          (delete z[t].options.map,
            (N[t] = new W.classes.Marker(z[t].options)),
            u(e, { td: z[t] }, N[t], z[t].id));
      }
      function a() {
        return (y = D.getProjection())
          ? ((P = !0),
            M.push(B.event.addListener(i, "zoom_changed", h)),
            M.push(B.event.addListener(i, "bounds_changed", h)),
            void m())
          : void setTimeout(function () {
            a.apply(A, []);
          }, 25);
      }
      function l(t) {
        n(_[t])
          ? (H(_[t].obj.setMap) && _[t].obj.setMap(null),
            H(_[t].obj.remove) && _[t].obj.remove(),
            H(_[t].shadow.remove) && _[t].obj.remove(),
            H(_[t].shadow.setMap) && _[t].shadow.setMap(null),
            delete _[t].obj,
            delete _[t].shadow)
          : N[t] && N[t].setMap(null),
          delete _[t];
      }
      function c() {
        var t,
          e,
          n,
          i,
          o,
          s,
          a,
          r,
          l = Math.cos,
          u = Math.sin,
          c = arguments;
        return (
          c[0] instanceof B.LatLng
            ? ((t = c[0].lat()),
              (n = c[0].lng()),
              c[1] instanceof B.LatLng
                ? ((e = c[1].lat()), (i = c[1].lng()))
                : ((e = c[1]), (i = c[2])))
            : ((t = c[0]),
              (n = c[1]),
              c[2] instanceof B.LatLng
                ? ((e = c[2].lat()), (i = c[2].lng()))
                : ((e = c[2]), (i = c[3]))),
          (o = (Math.PI * t) / 180),
          (s = (Math.PI * n) / 180),
          (a = (Math.PI * e) / 180),
          (r = (Math.PI * i) / 180),
          6371e3 *
          Math.acos(
            Math.min(
              l(o) * l(a) * l(s) * l(r) +
              l(o) * u(s) * l(a) * u(r) +
              u(o) * u(a),
              1
            )
          )
        );
      }
      function d() {
        var t = c(i.getCenter(), i.getBounds().getNorthEast()),
          e = new B.Circle({ center: i.getCenter(), radius: 1.25 * t });
        return e.getBounds();
      }
      function p() {
        var t,
          e = {};
        for (t in _) e[t] = !0;
        return e;
      }
      function h() {
        clearTimeout(g), (g = setTimeout(m, 25));
      }
      function f(t) {
        var e = y.fromLatLngToDivPixel(t),
          n = y.fromDivPixelToLatLng(
            new B.Point(e.x + o.radius, e.y - o.radius)
          ),
          i = y.fromDivPixelToLatLng(
            new B.Point(e.x - o.radius, e.y + o.radius)
          );
        return new B.LatLngBounds(i, n);
      }
      function m() {
        if (!S && !I && P) {
          var e,
            n,
            s,
            a,
            r,
            u,
            c,
            h,
            m,
            v,
            g,
            y = !1,
            x = [],
            A = {},
            M = i.getZoom(),
            k = "maxZoom" in o && M > o.maxZoom,
            L = p();
          for (
            C = !1,
            M > 3 &&
            ((r = d()),
              (y = r.getSouthWest().lng() < r.getNorthEast().lng())),
            e = 0;
            e < z.length;
            e++
          )
            !z[e] ||
              (y && !r.contains(z[e].options.position)) ||
              (w && !w(O[e])) ||
              x.push(e);
          for (; ;) {
            for (e = 0; A[e] && e < x.length;) e++;
            if (e === x.length) break;
            if (((a = []), T && !k)) {
              g = 10;
              do
                for (
                  h = a,
                  a = [],
                  g--,
                  c = h.length ? r.getCenter() : z[x[e]].options.position,
                  r = f(c),
                  n = e;
                  n < x.length;
                  n++
                )
                  A[n] || (r.contains(z[x[n]].options.position) && a.push(n));
              while (h.length < a.length && a.length > 1 && g);
            } else
              for (n = e; n < x.length; n++)
                if (!A[n]) {
                  a.push(n);
                  break;
                }
            for (
              u = { indexes: [], ref: [] }, m = v = 0, s = 0;
              s < a.length;
              s++
            )
              (A[a[s]] = !0),
                u.indexes.push(x[a[s]]),
                u.ref.push(x[a[s]]),
                (m += z[x[a[s]]].options.position.lat()),
                (v += z[x[a[s]]].options.position.lng());
            (m /= a.length),
              (v /= a.length),
              (u.latLng = new B.LatLng(m, v)),
              (u.ref = u.ref.join("-")),
              u.ref in L
                ? delete L[u.ref]
                : (1 === a.length && (_[u.ref] = !0), b(u));
          }
          t.each(L, function (t) {
            l(t);
          }),
            (I = !1);
        }
      }
      var g,
        y,
        w,
        b,
        x,
        S = !1,
        C = !1,
        I = !1,
        P = !1,
        T = !0,
        A = this,
        M = [],
        _ = {},
        k = {},
        L = {},
        N = [],
        z = [],
        O = [],
        D = E(i, o.radius);
      a(),
        (A.getById = function (t) {
          return t in k ? (s(k[t]), N[k[t]]) : !1;
        }),
        (A.rm = function (t) {
          var e = k[t];
          N[e] && N[e].setMap(null),
            delete N[e],
            (N[e] = !1),
            delete z[e],
            (z[e] = !1),
            delete O[e],
            (O[e] = !1),
            delete k[t],
            delete L[e],
            (C = !0);
        }),
        (A.clearById = function (t) {
          return t in k ? (A.rm(t), !0) : void 0;
        }),
        (A.clear = function (t, e, n) {
          var i,
            o,
            s,
            a,
            r,
            l = [],
            u = v(n);
          for (
            t
              ? ((i = z.length - 1), (o = -1), (s = -1))
              : ((i = 0), (o = z.length), (s = 1)),
            a = i;
            a !== o &&
            (!z[a] || (u && !u(z[a].tag)) || (l.push(L[a]), !e && !t));
            a += s
          );
          for (r = 0; r < l.length; r++) A.rm(l[r]);
        }),
        (A.add = function (t, e) {
          (t.id = r(t.id)),
            A.clearById(t.id),
            (k[t.id] = N.length),
            (L[N.length] = t.id),
            N.push(null),
            z.push(t),
            O.push(e),
            (C = !0);
        }),
        (A.addMarker = function (t, n) {
          (n = n || {}),
            (n.id = r(n.id)),
            A.clearById(n.id),
            n.options || (n.options = {}),
            (n.options.position = t.getPosition()),
            u(e, { td: n }, t, n.id),
            (k[n.id] = N.length),
            (L[N.length] = n.id),
            N.push(t),
            z.push(n),
            O.push(n.data || {}),
            (C = !0);
        }),
        (A.td = function (t) {
          return z[t];
        }),
        (A.value = function (t) {
          return O[t];
        }),
        (A.marker = function (t) {
          return t in N ? (s(t), N[t]) : !1;
        }),
        (A.markerIsSet = function (t) {
          return Boolean(N[t]);
        }),
        (A.setMarker = function (t, e) {
          N[t] = e;
        }),
        (A.store = function (t, e, n) {
          _[t.ref] = { obj: e, shadow: n };
        }),
        (A.free = function () {
          var e;
          for (e = 0; e < M.length; e++) B.event.removeListener(M[e]);
          (M = []),
            t.each(_, function (t) {
              l(t);
            }),
            (_ = {}),
            t.each(z, function (t) {
              z[t] = null;
            }),
            (z = []),
            t.each(N, function (t) {
              N[t] && (N[t].setMap(null), delete N[t]);
            }),
            (N = []),
            t.each(O, function (t) {
              delete O[t];
            }),
            (O = []),
            (k = {}),
            (L = {});
        }),
        (A.filter = function (t) {
          (w = t), m();
        }),
        (A.enable = function (t) {
          T !== t && ((T = t), m());
        }),
        (A.display = function (t) {
          b = t;
        }),
        (A.error = function (t) {
          x = t;
        }),
        (A.beginUpdate = function () {
          S = !0;
        }),
        (A.endUpdate = function () {
          (S = !1), C && m();
        }),
        (A.autofit = function (t) {
          var e;
          for (e = 0; e < z.length; e++)
            z[e] && t.extend(z[e].options.position);
        });
    }
    function z(t, e) {
      var n = this;
      (n.id = function () {
        return t;
      }),
        (n.filter = function (t) {
          e.filter(t);
        }),
        (n.enable = function () {
          e.enable(!0);
        }),
        (n.disable = function () {
          e.enable(!1);
        }),
        (n.add = function (t, n, i) {
          i || e.beginUpdate(), e.addMarker(t, n), i || e.endUpdate();
        }),
        (n.getById = function (t) {
          return e.getById(t);
        }),
        (n.clearById = function (t, n) {
          var i;
          return (
            n || e.beginUpdate(), (i = e.clearById(t)), n || e.endUpdate(), i
          );
        }),
        (n.clear = function (t, n, i, o) {
          o || e.beginUpdate(), e.clear(t, n, i), o || e.endUpdate();
        });
    }
    function O(e, n, i, o) {
      var s = this,
        a = [];
      W.classes.OverlayView.call(s),
        s.setMap(e),
        (s.onAdd = function () {
          var e = s.getPanes();
          n.pane in e && t(e[n.pane]).append(o),
            t.each(
              "dblclick click mouseover mousemove mouseout mouseup mousedown".split(
                " "
              ),
              function (e, n) {
                a.push(
                  B.event.addDomListener(o[0], n, function (e) {
                    t.Event(e).stopPropagation(),
                      B.event.trigger(s, n, [e]),
                      s.draw();
                  })
                );
              }
            ),
            a.push(
              B.event.addDomListener(o[0], "contextmenu", function (e) {
                t.Event(e).stopPropagation(),
                  B.event.trigger(s, "rightclick", [e]),
                  s.draw();
              })
            );
        }),
        (s.getPosition = function () {
          return i;
        }),
        (s.setPosition = function (t) {
          (i = t), s.draw();
        }),
        (s.draw = function () {
          var t = s.getProjection().fromLatLngToDivPixel(i);
          o.css("left", t.x + n.offset.x + "px").css(
            "top",
            t.y + n.offset.y + "px"
          );
        }),
        (s.onRemove = function () {
          var t;
          for (t = 0; t < a.length; t++) B.event.removeListener(a[t]);
          o.remove();
        }),
        (s.hide = function () {
          o.hide();
        }),
        (s.show = function () {
          o.show();
        }),
        (s.toggle = function () {
          o && (o.is(":visible") ? s.show() : s.hide());
        }),
        (s.toggleDOM = function () {
          s.setMap(s.getMap() ? null : e);
        }),
        (s.getDOMElement = function () {
          return o[0];
        });
    }
    function D(o) {
      function a() {
        !x && (x = C.get()) && x.run();
      }
      function c() {
        (x = null), C.ack(), a.call(S);
      }
      function d(t) {
        var e,
          n = t.td.callback;
        n &&
          ((e = Array.prototype.slice.call(arguments, 1)),
            H(n) ? n.apply(o, e) : R(n) && H(n[1]) && n[1].apply(n[0], e));
      }
      function f(t, e, n) {
        n && u(o, t, e, n), d(t, e), x.ack(e);
      }
      function v(e, n) {
        n = n || {};
        var i = n.td && n.td.options ? n.td.options : 0;
        E
          ? i && (i.center && (i.center = g(i.center)), E.setOptions(i))
          : ((i = n.opts || t.extend(!0, {}, W.map, i || {})),
            (i.center = e || g(i.center)),
            (E = new W.classes.Map(o.get(0), i)));
      }
      function w(n) {
        var i,
          s,
          a = new N(o, E, n),
          r = {},
          l = {},
          c = [],
          d = /^[0-9]+$/;
        for (s in n)
          d.test(s)
            ? (c.push(1 * s),
              (l[s] = n[s]),
              (l[s].width = l[s].width || 0),
              (l[s].height = l[s].height || 0))
            : (r[s] = n[s]);
        return (
          c.sort(function (t, e) {
            return t > e;
          }),
          (i = r.calculator
            ? function (e) {
              var n = [];
              return (
                t.each(e, function (t, e) {
                  n.push(a.value(e));
                }),
                r.calculator.apply(o, [n])
              );
            }
            : function (t) {
              return t.length;
            }),
          a.error(function () {
            h.apply(S, arguments);
          }),
          a.display(function (s) {
            var d,
              p,
              h,
              f,
              m,
              v,
              y = i(s.indexes);
            if (n.force || y > 1)
              for (d = 0; d < c.length; d++) c[d] <= y && (p = l[c[d]]);
            p
              ? ((m = p.offset || [-p.width / 2, -p.height / 2]),
                (h = t.extend({}, r)),
                (h.options = t.extend(
                  {
                    pane: "overlayLayer",
                    content: p.content
                      ? p.content.replace("CLUSTER_COUNT", y)
                      : "",
                    offset: {
                      x: ("x" in m ? m.x : m[0]) || 0,
                      y: ("y" in m ? m.y : m[1]) || 0,
                    },
                  },
                  r.options || {}
                )),
                (f = S.overlay({ td: h, opts: h.options, latLng: g(s) }, !0)),
                (h.options.pane = "floatShadow"),
                (h.options.content = t(document.createElement("div"))
                  .width(p.width + "px")
                  .height(p.height + "px")
                  .css({ cursor: "pointer" })),
                (v = S.overlay({ td: h, opts: h.options, latLng: g(s) }, !0)),
                (r.data = { latLng: g(s), markers: [] }),
                t.each(s.indexes, function (t, e) {
                  r.data.markers.push(a.value(e)),
                    a.markerIsSet(e) && a.marker(e).setMap(null);
                }),
                u(o, { td: r }, v, e, { main: f, shadow: v }),
                a.store(s, f, v))
              : t.each(s.indexes, function (t, e) {
                a.marker(e).setMap(E);
              });
          }),
          a
        );
      }
      function b(e, n, i) {
        var s = [],
          a = "values" in e.td;
        return (
          a || (e.td.values = [{ options: e.opts }]),
          e.td.values.length
            ? (v(),
              t.each(e.td.values, function (t, a) {
                var r,
                  l,
                  c,
                  d,
                  h = p(e, a);
                if (h.options[i])
                  if (h.options[i][0][0] && R(h.options[i][0][0]))
                    for (l = 0; l < h.options[i].length; l++)
                      for (c = 0; c < h.options[i][l].length; c++)
                        h.options[i][l][c] = g(h.options[i][l][c]);
                  else
                    for (l = 0; l < h.options[i].length; l++)
                      h.options[i][l] = g(h.options[i][l]);
                (h.options.map = E),
                  (d = new B[n](h.options)),
                  s.push(d),
                  (r = I.add({ td: h }, n.toLowerCase(), d)),
                  u(o, { td: h }, d, r);
              }),
              void f(e, a ? s : s[0]))
            : void f(e, !1)
        );
      }
      var x,
        S = this,
        C = new P(),
        I = new T(),
        E = null;
      (S._plan = function (t) {
        var e;
        for (e = 0; e < t.length; e++) C.add(new A(S, c, t[e]));
        a();
      }),
        (S.map = function (t) {
          v(t.latLng, t), u(o, t, E), f(t, E);
        }),
        (S.destroy = function (t) {
          I.clear(), o.empty(), E && (E = null), f(t, !0);
        }),
        (S.overlay = function (e, n) {
          var i = [],
            s = "values" in e.td;
          return (
            s || (e.td.values = [{ latLng: e.latLng, options: e.opts }]),
            e.td.values.length
              ? (O.__initialised ||
                ((O.prototype = new W.classes.OverlayView()),
                  (O.__initialised = !0)),
                t.each(e.td.values, function (s, a) {
                  var r,
                    l,
                    c = p(e, a),
                    d = t(document.createElement("div")).css({
                      border: "none",
                      borderWidth: 0,
                      position: "absolute",
                    });
                  d.append(c.options.content),
                    (l = new O(E, c.options, g(c) || g(a), d)),
                    i.push(l),
                    (d = null),
                    n || ((r = I.add(e, "overlay", l)), u(o, { td: c }, l, r));
                }),
                n ? i[0] : void f(e, s ? i : i[0]))
              : void f(e, !1)
          );
        }),
        (S.marker = function (e) {
          var n,
            i,
            s,
            a = "values" in e.td,
            l = !E;
          return (
            a ||
            ((e.opts.position = e.latLng || g(e.opts.position)),
              (e.td.values = [{ options: e.opts }])),
            e.td.values.length
              ? (l && v(),
                e.td.cluster && !E.getBounds()
                  ? void B.event.addListenerOnce(
                    E,
                    "bounds_changed",
                    function () {
                      S.marker.apply(S, [e]);
                    }
                  )
                  : void (e.td.cluster
                    ? (e.td.cluster instanceof z
                      ? ((i = e.td.cluster), (s = I.getById(i.id(), !0)))
                      : ((s = w(e.td.cluster)),
                        (i = new z(r(e.td.id, !0), s)),
                        I.add(e, "clusterer", i, s)),
                      s.beginUpdate(),
                      t.each(e.td.values, function (t, n) {
                        var i = p(e, n);
                        (i.options.position = g(
                          i.options.position ? i.options.position : n
                        )),
                          i.options.position &&
                          ((i.options.map = E),
                            l && (E.setCenter(i.options.position), (l = !1)),
                            s.add(i, n));
                      }),
                      s.endUpdate(),
                      f(e, i))
                    : ((n = []),
                      t.each(e.td.values, function (t, i) {
                        var s,
                          a,
                          r = p(e, i);
                        (r.options.position = g(
                          r.options.position ? r.options.position : i
                        )),
                          r.options.position &&
                          ((r.options.map = E),
                            l && (E.setCenter(r.options.position), (l = !1)),
                            (a = new W.classes.Marker(r.options)),
                            n.push(a),
                            (s = I.add({ td: r }, "marker", a)),
                            u(o, { td: r }, a, s));
                      }),
                      f(e, a ? n : n[0]))))
              : void f(e, !1)
          );
        }),
        (S.getroute = function (t) {
          (t.opts.origin = g(t.opts.origin, !0)),
            (t.opts.destination = g(t.opts.destination, !0)),
            M().route(t.opts, function (e, n) {
              d(t, n === B.DirectionsStatus.OK ? e : !1, n), x.ack();
            });
        }),
        (S.getdistance = function (t) {
          var e;
          for (
            t.opts.origins = m(t.opts.origins), e = 0;
            e < t.opts.origins.length;
            e++
          )
            t.opts.origins[e] = g(t.opts.origins[e], !0);
          for (
            t.opts.destinations = m(t.opts.destinations), e = 0;
            e < t.opts.destinations.length;
            e++
          )
            t.opts.destinations[e] = g(t.opts.destinations[e], !0);
          _().getDistanceMatrix(t.opts, function (e, n) {
            d(t, n === B.DistanceMatrixStatus.OK ? e : !1, n), x.ack();
          });
        }),
        (S.infowindow = function (n) {
          var i = [],
            a = "values" in n.td;
          a ||
            (n.latLng && (n.opts.position = n.latLng),
              (n.td.values = [{ options: n.opts }])),
            t.each(n.td.values, function (t, r) {
              var l,
                c,
                d = p(n, r);
              (d.options.position = g(
                d.options.position ? d.options.position : r.latLng
              )),
                E || v(d.options.position),
                (c = new W.classes.InfoWindow(d.options)),
                c &&
                (s(d.open) || d.open) &&
                (a
                  ? c.open(E, d.anchor || e)
                  : c.open(
                    E,
                    d.anchor ||
                    (n.latLng
                      ? e
                      : n.session.marker
                        ? n.session.marker
                        : e)
                  )),
                i.push(c),
                (l = I.add({ td: d }, "infowindow", c)),
                u(o, { td: d }, c, l);
            }),
            f(n, a ? i : i[0]);
        }),
        (S.circle = function (e) {
          var n = [],
            i = "values" in e.td;
          return (
            i ||
            ((e.opts.center = e.latLng || g(e.opts.center)),
              (e.td.values = [{ options: e.opts }])),
            e.td.values.length
              ? (t.each(e.td.values, function (t, i) {
                var s,
                  a,
                  r = p(e, i);
                (r.options.center = g(
                  r.options.center ? r.options.center : i
                )),
                  E || v(r.options.center),
                  (r.options.map = E),
                  (a = new W.classes.Circle(r.options)),
                  n.push(a),
                  (s = I.add({ td: r }, "circle", a)),
                  u(o, { td: r }, a, s);
              }),
                void f(e, i ? n : n[0]))
              : void f(e, !1)
          );
        }),
        (S.getaddress = function (t) {
          d(t, t.results, t.status), x.ack();
        }),
        (S.getlatlng = function (t) {
          d(t, t.results, t.status), x.ack();
        }),
        (S.getmaxzoom = function (t) {
          k().getMaxZoomAtLatLng(t.latLng, function (e) {
            d(t, e.status === B.MaxZoomStatus.OK ? e.zoom : !1, status),
              x.ack();
          });
        }),
        (S.getelevation = function (t) {
          var e,
            n = [],
            i = function (e, n) {
              d(t, n === B.ElevationStatus.OK ? e : !1, n), x.ack();
            };
          if (t.latLng) n.push(t.latLng);
          else
            for (n = m(t.td.locations || []), e = 0; e < n.length; e++)
              n[e] = g(n[e]);
          if (n.length) L().getElevationForLocations({ locations: n }, i);
          else {
            if (t.td.path && t.td.path.length)
              for (e = 0; e < t.td.path.length; e++) n.push(g(t.td.path[e]));
            n.length
              ? L().getElevationAlongPath({ path: n, samples: t.td.samples }, i)
              : x.ack();
          }
        }),
        (S.defaults = function (e) {
          t.each(e.td, function (e, i) {
            W[e] = n(W[e]) ? t.extend({}, W[e], i) : i;
          }),
            x.ack(!0);
        }),
        (S.rectangle = function (e) {
          var n = [],
            i = "values" in e.td;
          return (
            i || (e.td.values = [{ options: e.opts }]),
            e.td.values.length
              ? (t.each(e.td.values, function (t, i) {
                var s,
                  a,
                  r = p(e, i);
                (r.options.bounds = y(
                  r.options.bounds ? r.options.bounds : i
                )),
                  E || v(r.options.bounds.getCenter()),
                  (r.options.map = E),
                  (a = new W.classes.Rectangle(r.options)),
                  n.push(a),
                  (s = I.add({ td: r }, "rectangle", a)),
                  u(o, { td: r }, a, s);
              }),
                void f(e, i ? n : n[0]))
              : void f(e, !1)
          );
        }),
        (S.polyline = function (t) {
          b(t, "Polyline", "path");
        }),
        (S.polygon = function (t) {
          b(t, "Polygon", "paths");
        }),
        (S.trafficlayer = function (t) {
          v();
          var e = I.get("trafficlayer");
          e ||
            ((e = new W.classes.TrafficLayer()),
              e.setMap(E),
              I.add(t, "trafficlayer", e)),
            f(t, e);
        }),
        (S.bicyclinglayer = function (t) {
          v();
          var e = I.get("bicyclinglayer");
          e ||
            ((e = new W.classes.BicyclingLayer()),
              e.setMap(E),
              I.add(t, "bicyclinglayer", e)),
            f(t, e);
        }),
        (S.groundoverlay = function (t) {
          (t.opts.bounds = y(t.opts.bounds)),
            t.opts.bounds && v(t.opts.bounds.getCenter());
          var e,
            n = new W.classes.GroundOverlay(
              t.opts.url,
              t.opts.bounds,
              t.opts.opts
            );
          n.setMap(E), (e = I.add(t, "groundoverlay", n)), f(t, n, e);
        }),
        (S.streetviewpanorama = function (e) {
          e.opts.opts || (e.opts.opts = {}),
            e.latLng
              ? (e.opts.opts.position = e.latLng)
              : e.opts.opts.position &&
              (e.opts.opts.position = g(e.opts.opts.position)),
            e.td.divId
              ? (e.opts.container = document.getElementById(e.td.divId))
              : e.opts.container &&
              (e.opts.container = t(e.opts.container).get(0));
          var n,
            i = new W.classes.StreetViewPanorama(e.opts.container, e.opts.opts);
          i && E.setStreetView(i),
            (n = I.add(e, "streetviewpanorama", i)),
            f(e, i, n);
        }),
        (S.kmllayer = function (e) {
          var n = [],
            i = "values" in e.td;
          return (
            i || (e.td.values = [{ options: e.opts }]),
            e.td.values.length
              ? (t.each(e.td.values, function (t, i) {
                var s,
                  a,
                  r,
                  c = p(e, i);
                E || v(),
                  (r = c.options),
                  c.options.opts &&
                  ((r = c.options.opts),
                    c.options.url && (r.url = c.options.url)),
                  (r.map = E),
                  (a = l("3.10")
                    ? new W.classes.KmlLayer(r)
                    : new W.classes.KmlLayer(r.url, r)),
                  n.push(a),
                  (s = I.add({ td: c }, "kmllayer", a)),
                  u(o, { td: c }, a, s);
              }),
                void f(e, i ? n : n[0]))
              : void f(e, !1)
          );
        }),
        (S.panel = function (e) {
          v();
          var n,
            i,
            a = 0,
            r = 0,
            l = t(document.createElement("div"));
          l.css({ position: "absolute", zIndex: 1e3, visibility: "hidden" }),
            e.opts.content &&
            ((i = t(e.opts.content)),
              l.append(i),
              o.first().prepend(l),
              s(e.opts.left)
                ? s(e.opts.right)
                  ? e.opts.center && (a = (o.width() - i.width()) / 2)
                  : (a = o.width() - i.width() - e.opts.right)
                : (a = e.opts.left),
              s(e.opts.top)
                ? s(e.opts.bottom)
                  ? e.opts.middle && (r = (o.height() - i.height()) / 2)
                  : (r = o.height() - i.height() - e.opts.bottom)
                : (r = e.opts.top),
              l.css({ top: r, left: a, visibility: "visible" })),
            (n = I.add(e, "panel", l)),
            f(e, l, n),
            (l = null);
        }),
        (S.directionsrenderer = function (e) {
          e.opts.map = E;
          var n,
            i = new B.DirectionsRenderer(e.opts);
          e.td.divId
            ? i.setPanel(document.getElementById(e.td.divId))
            : e.td.container && i.setPanel(t(e.td.container).get(0)),
            (n = I.add(e, "directionsrenderer", i)),
            f(e, i, n);
        }),
        (S.getgeoloc = function (t) {
          f(t, t.latLng);
        }),
        (S.styledmaptype = function (t) {
          v();
          var e = new W.classes.StyledMapType(t.td.styles, t.opts);
          E.mapTypes.set(t.td.id, e), f(t, e);
        }),
        (S.imagemaptype = function (t) {
          v();
          var e = new W.classes.ImageMapType(t.opts);
          E.mapTypes.set(t.td.id, e), f(t, e);
        }),
        (S.autofit = function (e) {
          var n = new B.LatLngBounds();
          t.each(I.all(), function (t, e) {
            e.getPosition
              ? n.extend(e.getPosition())
              : e.getBounds
                ? (n.extend(e.getBounds().getNorthEast()),
                  n.extend(e.getBounds().getSouthWest()))
                : e.getPaths
                  ? e.getPaths().forEach(function (t) {
                    t.forEach(function (t) {
                      n.extend(t);
                    });
                  })
                  : e.getPath
                    ? e.getPath().forEach(function (t) {
                      n.extend(t);
                    })
                    : e.getCenter
                      ? n.extend(e.getCenter())
                      : "function" == typeof z &&
                      e instanceof z &&
                      ((e = I.getById(e.id(), !0)), e && e.autofit(n));
          }),
            n.isEmpty() ||
            (E.getBounds() && E.getBounds().equals(n)) ||
            ("maxZoom" in e.td &&
              B.event.addListenerOnce(E, "bounds_changed", function () {
                this.getZoom() > e.td.maxZoom && this.setZoom(e.td.maxZoom);
              }),
              E.fitBounds(n)),
            f(e, !0);
        }),
        (S.clear = function (e) {
          if (i(e.td)) {
            if (I.clearById(e.td) || I.objClearById(e.td)) return void f(e, !0);
            e.td = { name: e.td };
          }
          e.td.id
            ? t.each(m(e.td.id), function (t, e) {
              I.clearById(e) || I.objClearById(e);
            })
            : (I.clear(m(e.td.name), e.td.last, e.td.first, e.td.tag),
              I.objClear(m(e.td.name), e.td.last, e.td.first, e.td.tag)),
            f(e, !0);
        }),
        (S.get = function (n, o, s) {
          var a,
            r,
            l = o ? n : n.td;
          return (
            o || (s = l.full),
            i(l)
              ? ((r = I.getById(l, !1, s) || I.objGetById(l)),
                r === !1 && ((a = l), (l = {})))
              : (a = l.name),
            "map" === a && (r = E),
            r ||
            ((r = []),
              l.id
                ? (t.each(m(l.id), function (t, e) {
                  r.push(I.getById(e, !1, s) || I.objGetById(e));
                }),
                  R(l.id) || (r = r[0]))
                : (t.each(a ? m(a) : [e], function (e, n) {
                  var i;
                  l.first
                    ? ((i = I.get(n, !1, l.tag, s)), i && r.push(i))
                    : l.all
                      ? t.each(I.all(n, l.tag, s), function (t, e) {
                        r.push(e);
                      })
                      : ((i = I.get(n, !0, l.tag, s)), i && r.push(i));
                }),
                  l.all || R(a) || (r = r[0]))),
            (r = R(r) || !l.all ? r : [r]),
            o ? r : void f(n, r)
          );
        }),
        (S.exec = function (e) {
          t.each(m(e.td.func), function (n, i) {
            t.each(
              S.get(e.td, !0, e.td.hasOwnProperty("full") ? e.td.full : !0),
              function (t, e) {
                i.call(o, e);
              }
            );
          }),
            f(e, !0);
        }),
        (S.trigger = function (e) {
          if (i(e.td)) B.event.trigger(E, e.td);
          else {
            var n = [E, e.td.eventName];
            e.td.var_args &&
              t.each(e.td.var_args, function (t, e) {
                n.push(e);
              }),
              B.event.trigger.apply(B.event, n);
          }
          d(e), x.ack();
        });
    }
    var W,
      B,
      j = 0,
      H = t.isFunction,
      R = t.isArray,
      q = {},
      U = new I();
    t.fn.gmap3 = function () {
      var e,
        n = [],
        i = !0,
        o = [];
      for (a(), e = 0; e < arguments.length; e++)
        arguments[e] && n.push(arguments[e]);
      return (
        n.length || n.push("map"),
        t.each(this, function () {
          var e = t(this),
            s = e.data("gmap3");
          (i = !1),
            s || ((s = new D(e)), e.data("gmap3", s)),
            1 !== n.length || ("get" !== n[0] && !S(n[0]))
              ? s._plan(n)
              : o.push(
                "get" === n[0]
                  ? s.get("map", !0)
                  : s.get(n[0].get, !0, n[0].get.full)
              );
        }),
        o.length ? (1 === o.length ? o[0] : o) : this
      );
    };
  })(jQuery),
  (function (t, e, n) {
    "use strict";
    var i = t.document,
      o = t.Modernizr,
      s = function (t) {
        return t.charAt(0).toUpperCase() + t.slice(1);
      },
      a = "Moz Webkit O Ms".split(" "),
      r = function (t) {
        var e = i.documentElement.style,
          n;
        if ("string" == typeof e[t]) return t;
        t = s(t);
        for (var o = 0, r = a.length; r > o; o++)
          if (((n = a[o] + t), "string" == typeof e[n])) return n;
      },
      l = r("transform"),
      u = r("transitionProperty"),
      c = {
        csstransforms: function () {
          return !!l;
        },
        csstransforms3d: function () {
          var t = !!r("perspective");
          if (t) {
            var n = " -o- -moz- -ms- -webkit- -khtml- ".split(" "),
              i = "@media (" + n.join("transform-3d),(") + "modernizr)",
              o = e(
                "<style>" + i + "{#modernizr{height:3px}}</style>"
              ).appendTo("head"),
              s = e('<div id="modernizr" />').appendTo("html");
            (t = 3 === s.height()), s.remove(), o.remove();
          }
          return t;
        },
        csstransitions: function () {
          return !!u;
        },
      },
      d;
    if (o) for (d in c) o.hasOwnProperty(d) || o.addTest(d, c[d]);
    else {
      o = t.Modernizr = { _version: "1.6ish: miniModernizr for Isotope" };
      var p = " ",
        h;
      for (d in c) (h = c[d]()), (o[d] = h), (p += " " + (h ? "" : "no-") + d);
      e("html").addClass(p);
    }
    if (o.csstransforms) {
      var f = o.csstransforms3d
        ? {
          translate: function (t) {
            return "translate3d(" + t[0] + "px, " + t[1] + "px, 0) ";
          },
          scale: function (t) {
            return "scale3d(" + t + ", " + t + ", 1) ";
          },
        }
        : {
          translate: function (t) {
            return "translate(" + t[0] + "px, " + t[1] + "px) ";
          },
          scale: function (t) {
            return "scale(" + t + ") ";
          },
        },
        m = function (t, n, i) {
          var o = e.data(t, "isoTransform") || {},
            s = {},
            a,
            r = {},
            u;
          (s[n] = i), e.extend(o, s);
          for (a in o) (u = o[a]), (r[a] = f[a](u));
          var c = r.translate || "",
            d = r.scale || "",
            p = c + d;
          e.data(t, "isoTransform", o), (t.style[l] = p);
        };
      (e.cssNumber.scale = !0),
        (e.cssHooks.scale = {
          set: function (t, e) {
            m(t, "scale", e);
          },
          get: function (t, n) {
            var i = e.data(t, "isoTransform");
            return i && i.scale ? i.scale : 1;
          },
        }),
        (e.fx.step.scale = function (t) {
          e.cssHooks.scale.set(t.elem, t.now + t.unit);
        }),
        (e.cssNumber.translate = !0),
        (e.cssHooks.translate = {
          set: function (t, e) {
            m(t, "translate", e);
          },
          get: function (t, n) {
            var i = e.data(t, "isoTransform");
            return i && i.translate ? i.translate : [0, 0];
          },
        });
    }
    var v, g;
    o.csstransitions &&
      ((v = {
        WebkitTransitionProperty: "webkitTransitionEnd",
        MozTransitionProperty: "transitionend",
        OTransitionProperty: "oTransitionEnd otransitionend",
        transitionProperty: "transitionend",
      }[u]),
        (g = r("transitionDuration")));
    var y = e.event,
      w = e.event.handle ? "handle" : "dispatch",
      b;
    (y.special.smartresize = {
      setup: function () {
        e(this).bind("resize", y.special.smartresize.handler);
      },
      teardown: function () {
        e(this).unbind("resize", y.special.smartresize.handler);
      },
      handler: function (t, e) {
        var n = this,
          i = arguments;
        (t.type = "smartresize"),
          b && clearTimeout(b),
          (b = setTimeout(
            function () {
              y[w].apply(n, i);
            },
            "execAsap" === e ? 0 : 100
          ));
      },
    }),
      (e.fn.smartresize = function (t) {
        return t
          ? this.bind("smartresize", t)
          : this.trigger("smartresize", ["execAsap"]);
      }),
      (e.Isotope = function (t, n, i) {
        (this.element = e(n)), this._create(t), this._init(i);
      });
    var x = ["width", "height"],
      S = e(t);
    (e.Isotope.settings = {
      resizable: !0,
      layoutMode: "masonry",
      containerClass: "isotope",
      itemClass: "isotope-item",
      hiddenClass: "isotope-hidden",
      hiddenStyle: { opacity: 0, scale: 0.001 },
      visibleStyle: { opacity: 1, scale: 1 },
      containerStyle: { position: "relative", overflow: "hidden" },
      animationEngine: "best-available",
      animationOptions: { queue: !1, duration: 800 },
      sortBy: "original-order",
      sortAscending: !0,
      resizesContainer: !0,
      transformsEnabled: !0,
      itemPositionDataEnabled: !1,
    }),
      (e.Isotope.prototype = {
        _create: function (t) {
          (this.options = e.extend({}, e.Isotope.settings, t)),
            (this.styleQueue = []),
            (this.elemCount = 0);
          var n = this.element[0].style;
          this.originalStyle = {};
          var i = x.slice(0);
          for (var o in this.options.containerStyle) i.push(o);
          for (var s = 0, a = i.length; a > s; s++)
            (o = i[s]), (this.originalStyle[o] = n[o] || "");
          this.element.css(this.options.containerStyle),
            this._updateAnimationEngine(),
            this._updateUsingTransforms();
          var r = {
            "original-order": function (t, e) {
              return e.elemCount++, e.elemCount;
            },
            random: function () {
              return Math.random();
            },
          };
          (this.options.getSortData = e.extend(this.options.getSortData, r)),
            this.reloadItems(),
            (this.offset = {
              left: parseInt(this.element.css("padding-left") || 0, 10),
              top: parseInt(this.element.css("padding-top") || 0, 10),
            });
          var l = this;
          setTimeout(function () {
            l.element.addClass(l.options.containerClass);
          }, 0),
            this.options.resizable &&
            S.bind("smartresize.isotope", function () {
              l.resize();
            }),
            this.element.delegate(
              "." + this.options.hiddenClass,
              "click",
              function () {
                return !1;
              }
            );
        },
        _getAtoms: function (t) {
          var e = this.options.itemSelector,
            n = e ? t.filter(e).add(t.find(e)) : t,
            i = { position: "absolute" };
          return (
            (n = n.filter(function (t, e) {
              return 1 === e.nodeType;
            })),
            this.usingTransforms && ((i.left = 0), (i.top = 0)),
            n.css(i).addClass(this.options.itemClass),
            this.updateSortData(n, !0),
            n
          );
        },
        _init: function (t) {
          (this.$filteredAtoms = this._filter(this.$allAtoms)),
            this._sort(),
            this.reLayout(t);
        },
        option: function (t) {
          if (e.isPlainObject(t)) {
            this.options = e.extend(!0, this.options, t);
            var n;
            for (var i in t) (n = "_update" + s(i)), this[n] && this[n]();
          }
        },
        _updateAnimationEngine: function () {
          var t = this.options.animationEngine
            .toLowerCase()
            .replace(/[ _\-]/g, ""),
            e;
          switch (t) {
            case "css":
            case "none":
              e = !1;
              break;
            case "jquery":
              e = !0;
              break;
            default:
              e = !o.csstransitions;
          }
          (this.isUsingJQueryAnimation = e), this._updateUsingTransforms();
        },
        _updateTransformsEnabled: function () {
          this._updateUsingTransforms();
        },
        _updateUsingTransforms: function () {
          var t = (this.usingTransforms =
            this.options.transformsEnabled &&
            o.csstransforms &&
            o.csstransitions &&
            !this.isUsingJQueryAnimation);
          t ||
            (delete this.options.hiddenStyle.scale,
              delete this.options.visibleStyle.scale),
            (this.getPositionStyles = t ? this._translate : this._positionAbs);
        },
        _filter: function (t) {
          var e = "" === this.options.filter ? "*" : this.options.filter;
          if (!e) return t;
          var n = this.options.hiddenClass,
            i = "." + n,
            o = t.filter(i),
            s = o;
          if ("*" !== e) {
            s = o.filter(e);
            var a = t.not(i).not(e).addClass(n);
            this.styleQueue.push({ $el: a, style: this.options.hiddenStyle });
          }
          return (
            this.styleQueue.push({ $el: s, style: this.options.visibleStyle }),
            s.removeClass(n),
            t.filter(e)
          );
        },
        updateSortData: function (t, n) {
          var i = this,
            o = this.options.getSortData,
            s,
            a;
          t.each(function () {
            (s = e(this)), (a = {});
            for (var t in o)
              a[t] =
                n || "original-order" !== t
                  ? o[t](s, i)
                  : e.data(this, "isotope-sort-data")[t];
            e.data(this, "isotope-sort-data", a);
          });
        },
        _sort: function () {
          var t = this.options.sortBy,
            e = this._getSorter,
            n = this.options.sortAscending ? 1 : -1,
            i = function (i, o) {
              var s = e(i, t),
                a = e(o, t);
              return (
                s === a &&
                "original-order" !== t &&
                ((s = e(i, "original-order")), (a = e(o, "original-order"))),
                (s > a ? 1 : a > s ? -1 : 0) * n
              );
            };
          this.$filteredAtoms.sort(i);
        },
        _getSorter: function (t, n) {
          return e.data(t, "isotope-sort-data")[n];
        },
        _translate: function (t, e) {
          return { translate: [t, e] };
        },
        _positionAbs: function (t, e) {
          return { left: t, top: e };
        },
        _pushPosition: function (t, e, n) {
          (e = Math.round(e + this.offset.left)),
            (n = Math.round(n + this.offset.top));
          var i = this.getPositionStyles(e, n);
          this.styleQueue.push({ $el: t, style: i }),
            this.options.itemPositionDataEnabled &&
            t.data("isotope-item-position", { x: e, y: n });
        },
        layout: function (t, e) {
          var n = this.options.layoutMode;
          if ((this["_" + n + "Layout"](t), this.options.resizesContainer)) {
            var i = this["_" + n + "GetContainerSize"]();
            this.styleQueue.push({ $el: this.element, style: i });
          }
          this._processStyleQueue(t, e), (this.isLaidOut = !0);
        },
        _processStyleQueue: function (t, n) {
          var i =
            this.isLaidOut && this.isUsingJQueryAnimation ? "animate" : "css",
            s = this.options.animationOptions,
            a = this.options.onLayout,
            r,
            l,
            u,
            c;
          if (
            ((l = function (t, e) {
              e.$el[i](e.style, s);
            }),
              this._isInserting && this.isUsingJQueryAnimation)
          )
            l = function (t, e) {
              (r = e.$el.hasClass("no-transition") ? "css" : i),
                e.$el[r](e.style, s);
            };
          else if (n || a || s.complete) {
            var d = !1,
              p = [n, a, s.complete],
              h = this;
            if (
              ((u = !0),
                (c = function () {
                  if (!d) {
                    for (var e, n = 0, i = p.length; i > n; n++)
                      (e = p[n]),
                        "function" == typeof e && e.call(h.element, t, h);
                    d = !0;
                  }
                }),
                this.isUsingJQueryAnimation && "animate" === i)
            )
              (s.complete = c), (u = !1);
            else if (o.csstransitions) {
              for (
                var f = 0, m = this.styleQueue[0], y = m && m.$el, w;
                !y || !y.length;

              ) {
                if (((w = this.styleQueue[f++]), !w)) return;
                y = w.$el;
              }
              var b = parseFloat(getComputedStyle(y[0])[g]);
              b > 0 &&
                ((l = function (t, e) {
                  e.$el[i](e.style, s).one(v, c);
                }),
                  (u = !1));
            }
          }
          e.each(this.styleQueue, l), u && c(), (this.styleQueue = []);
        },
        resize: function () {
          this["_" + this.options.layoutMode + "ResizeChanged"]() &&
            this.reLayout();
        },
        reLayout: function (t) {
          this["_" + this.options.layoutMode + "Reset"](),
            this.layout(this.$filteredAtoms, t);
        },
        addItems: function (t, e) {
          var n = this._getAtoms(t);
          (this.$allAtoms = this.$allAtoms.add(n)), e && e(n);
        },
        insert: function (t, e) {
          this.element.append(t);
          var n = this;
          this.addItems(t, function (t) {
            var i = n._filter(t);
            n._addHideAppended(i),
              n._sort(),
              n.reLayout(),
              n._revealAppended(i, e);
          });
        },
        appended: function (t, e) {
          var n = this;
          this.addItems(t, function (t) {
            n._addHideAppended(t), n.layout(t), n._revealAppended(t, e);
          });
        },
        _addHideAppended: function (t) {
          (this.$filteredAtoms = this.$filteredAtoms.add(t)),
            t.addClass("no-transition"),
            (this._isInserting = !0),
            this.styleQueue.push({ $el: t, style: this.options.hiddenStyle });
        },
        _revealAppended: function (t, e) {
          var n = this;
          setTimeout(function () {
            t.removeClass("no-transition"),
              n.styleQueue.push({ $el: t, style: n.options.visibleStyle }),
              (n._isInserting = !1),
              n._processStyleQueue(t, e);
          }, 10);
        },
        reloadItems: function () {
          this.$allAtoms = this._getAtoms(this.element.children());
        },
        remove: function (t, e) {
          (this.$allAtoms = this.$allAtoms.not(t)),
            (this.$filteredAtoms = this.$filteredAtoms.not(t));
          var n = this,
            i = function () {
              t.remove(), e && e.call(n.element);
            };
          t.filter(":not(." + this.options.hiddenClass + ")").length
            ? (this.styleQueue.push({
              $el: t,
              style: this.options.hiddenStyle,
            }),
              this._sort(),
              this.reLayout(i))
            : i();
        },
        shuffle: function (t) {
          this.updateSortData(this.$allAtoms),
            (this.options.sortBy = "random"),
            this._sort(),
            this.reLayout(t);
        },
        destroy: function () {
          var t = this.usingTransforms,
            e = this.options;
          this.$allAtoms
            .removeClass(e.hiddenClass + " " + e.itemClass)
            .each(function () {
              var e = this.style;
              (e.position = ""),
                (e.top = ""),
                (e.left = ""),
                (e.opacity = ""),
                t && (e[l] = "");
            });
          var n = this.element[0].style;
          for (var i in this.originalStyle) n[i] = this.originalStyle[i];
          this.element
            .unbind(".isotope")
            .undelegate("." + e.hiddenClass, "click")
            .removeClass(e.containerClass)
            .removeData("isotope"),
            S.unbind(".isotope");
        },
        _getSegments: function (t) {
          var e = this.options.layoutMode,
            n = t ? "rowHeight" : "columnWidth",
            i = t ? "height" : "width",
            o = t ? "rows" : "cols",
            a = this.element[i](),
            r,
            l =
              (this.options[e] && this.options[e][n]) ||
              this.$filteredAtoms["outer" + s(i)](!0) ||
              a;
          (r = Math.floor(a / l)),
            (r = Math.max(r, 1)),
            (this[e][o] = r),
            (this[e][n] = l);
        },
        _checkIfSegmentsChanged: function (t) {
          var e = this.options.layoutMode,
            n = t ? "rows" : "cols",
            i = this[e][n];
          return this._getSegments(t), this[e][n] !== i;
        },
        _masonryReset: function () {
          (this.masonry = {}), this._getSegments();
          var t = this.masonry.cols;
          for (this.masonry.colYs = []; t--;) this.masonry.colYs.push(0);
        },
        _masonryLayout: function (t) {
          var n = this,
            i = n.masonry;
          t.each(function () {
            var t = e(this),
              o = Math.ceil(t.outerWidth(!0) / i.columnWidth);
            if (((o = Math.min(o, i.cols)), 1 === o))
              n._masonryPlaceBrick(t, i.colYs);
            else {
              var s = i.cols + 1 - o,
                a = [],
                r,
                l;
              for (l = 0; s > l; l++)
                (r = i.colYs.slice(l, l + o)), (a[l] = Math.max.apply(Math, r));
              n._masonryPlaceBrick(t, a);
            }
          });
        },
        _masonryPlaceBrick: function (t, e) {
          for (
            var n = Math.min.apply(Math, e), i = 0, o = 0, s = e.length;
            s > o;
            o++
          )
            if (e[o] === n) {
              i = o;
              break;
            }
          var a = this.masonry.columnWidth * i,
            r = n;
          this._pushPosition(t, a, r);
          var l = n + t.outerHeight(!0),
            u = this.masonry.cols + 1 - s;
          for (o = 0; u > o; o++) this.masonry.colYs[i + o] = l;
        },
        _masonryGetContainerSize: function () {
          var t = Math.max.apply(Math, this.masonry.colYs);
          return { height: t };
        },
        _masonryResizeChanged: function () {
          return this._checkIfSegmentsChanged();
        },
        _fitRowsReset: function () {
          this.fitRows = { x: 0, y: 0, height: 0 };
        },
        _fitRowsLayout: function (t) {
          var n = this,
            i = this.element.width(),
            o = this.fitRows;
          t.each(function () {
            var t = e(this),
              s = t.outerWidth(!0),
              a = t.outerHeight(!0);
            0 !== o.x && s + o.x > i && ((o.x = 0), (o.y = o.height)),
              n._pushPosition(t, o.x, o.y),
              (o.height = Math.max(o.y + a, o.height)),
              (o.x += s);
          });
        },
        _fitRowsGetContainerSize: function () {
          return { height: this.fitRows.height };
        },
        _fitRowsResizeChanged: function () {
          return !0;
        },
        _cellsByRowReset: function () {
          (this.cellsByRow = { index: 0 }),
            this._getSegments(),
            this._getSegments(!0);
        },
        _cellsByRowLayout: function (t) {
          var n = this,
            i = this.cellsByRow;
          t.each(function () {
            var t = e(this),
              o = i.index % i.cols,
              s = Math.floor(i.index / i.cols),
              a = (o + 0.5) * i.columnWidth - t.outerWidth(!0) / 2,
              r = (s + 0.5) * i.rowHeight - t.outerHeight(!0) / 2;
            n._pushPosition(t, a, r), i.index++;
          });
        },
        _cellsByRowGetContainerSize: function () {
          return {
            height:
              Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) *
              this.cellsByRow.rowHeight +
              this.offset.top,
          };
        },
        _cellsByRowResizeChanged: function () {
          return this._checkIfSegmentsChanged();
        },
        _straightDownReset: function () {
          this.straightDown = { y: 0 };
        },
        _straightDownLayout: function (t) {
          var n = this;
          t.each(function (t) {
            var i = e(this);
            n._pushPosition(i, 0, n.straightDown.y),
              (n.straightDown.y += i.outerHeight(!0));
          });
        },
        _straightDownGetContainerSize: function () {
          return { height: this.straightDown.y };
        },
        _straightDownResizeChanged: function () {
          return !0;
        },
        _masonryHorizontalReset: function () {
          (this.masonryHorizontal = {}), this._getSegments(!0);
          var t = this.masonryHorizontal.rows;
          for (this.masonryHorizontal.rowXs = []; t--;)
            this.masonryHorizontal.rowXs.push(0);
        },
        _masonryHorizontalLayout: function (t) {
          var n = this,
            i = n.masonryHorizontal;
          t.each(function () {
            var t = e(this),
              o = Math.ceil(t.outerHeight(!0) / i.rowHeight);
            if (((o = Math.min(o, i.rows)), 1 === o))
              n._masonryHorizontalPlaceBrick(t, i.rowXs);
            else {
              var s = i.rows + 1 - o,
                a = [],
                r,
                l;
              for (l = 0; s > l; l++)
                (r = i.rowXs.slice(l, l + o)), (a[l] = Math.max.apply(Math, r));
              n._masonryHorizontalPlaceBrick(t, a);
            }
          });
        },
        _masonryHorizontalPlaceBrick: function (t, e) {
          for (
            var n = Math.min.apply(Math, e), i = 0, o = 0, s = e.length;
            s > o;
            o++
          )
            if (e[o] === n) {
              i = o;
              break;
            }
          var a = n,
            r = this.masonryHorizontal.rowHeight * i;
          this._pushPosition(t, a, r);
          var l = n + t.outerWidth(!0),
            u = this.masonryHorizontal.rows + 1 - s;
          for (o = 0; u > o; o++) this.masonryHorizontal.rowXs[i + o] = l;
        },
        _masonryHorizontalGetContainerSize: function () {
          var t = Math.max.apply(Math, this.masonryHorizontal.rowXs);
          return { width: t };
        },
        _masonryHorizontalResizeChanged: function () {
          return this._checkIfSegmentsChanged(!0);
        },
        _fitColumnsReset: function () {
          this.fitColumns = { x: 0, y: 0, width: 0 };
        },
        _fitColumnsLayout: function (t) {
          var n = this,
            i = this.element.height(),
            o = this.fitColumns;
          t.each(function () {
            var t = e(this),
              s = t.outerWidth(!0),
              a = t.outerHeight(!0);
            0 !== o.y && a + o.y > i && ((o.x = o.width), (o.y = 0)),
              n._pushPosition(t, o.x, o.y),
              (o.width = Math.max(o.x + s, o.width)),
              (o.y += a);
          });
        },
        _fitColumnsGetContainerSize: function () {
          return { width: this.fitColumns.width };
        },
        _fitColumnsResizeChanged: function () {
          return !0;
        },
        _cellsByColumnReset: function () {
          (this.cellsByColumn = { index: 0 }),
            this._getSegments(),
            this._getSegments(!0);
        },
        _cellsByColumnLayout: function (t) {
          var n = this,
            i = this.cellsByColumn;
          t.each(function () {
            var t = e(this),
              o = Math.floor(i.index / i.rows),
              s = i.index % i.rows,
              a = (o + 0.5) * i.columnWidth - t.outerWidth(!0) / 2,
              r = (s + 0.5) * i.rowHeight - t.outerHeight(!0) / 2;
            n._pushPosition(t, a, r), i.index++;
          });
        },
        _cellsByColumnGetContainerSize: function () {
          return {
            width:
              Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) *
              this.cellsByColumn.columnWidth,
          };
        },
        _cellsByColumnResizeChanged: function () {
          return this._checkIfSegmentsChanged(!0);
        },
        _straightAcrossReset: function () {
          this.straightAcross = { x: 0 };
        },
        _straightAcrossLayout: function (t) {
          var n = this;
          t.each(function (t) {
            var i = e(this);
            n._pushPosition(i, n.straightAcross.x, 0),
              (n.straightAcross.x += i.outerWidth(!0));
          });
        },
        _straightAcrossGetContainerSize: function () {
          return { width: this.straightAcross.x };
        },
        _straightAcrossResizeChanged: function () {
          return !0;
        },
      }),
      (e.fn.imagesLoaded = function (t) {
        function n() {
          t.call(o, s);
        }
        function i(t) {
          var o = t.target;
          o.src !== r &&
            -1 === e.inArray(o, l) &&
            (l.push(o),
              --a <= 0 && (setTimeout(n), s.unbind(".imagesLoaded", i)));
        }
        var o = this,
          s = o.find("img").add(o.filter("img")),
          a = s.length,
          r =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
          l = [];
        return (
          a || n(),
          s.bind("load.imagesLoaded error.imagesLoaded", i).each(function () {
            var t = this.src;
            (this.src = r), (this.src = t);
          }),
          o
        );
      });
    var C = function (e) {
      t.console && t.console.error(e);
    };
    e.fn.isotope = function (t, n) {
      if ("string" == typeof t) {
        var i = Array.prototype.slice.call(arguments, 1);
        this.each(function () {
          var n = e.data(this, "isotope");
          return n
            ? e.isFunction(n[t]) && "_" !== t.charAt(0)
              ? void n[t].apply(n, i)
              : void C("no such method '" + t + "' for isotope instance")
            : void C(
              "cannot call methods on isotope prior to initialization; attempted to call method '" +
              t +
              "'"
            );
        });
      } else
        this.each(function () {
          var i = e.data(this, "isotope");
          i
            ? (i.option(t), i._init(n))
            : e.data(this, "isotope", new e.Isotope(t, this, n));
        });
      return this;
    };
  })(window, jQuery),
  (function (t, e, n, i) {
    "use strict";
    var o = function () {
      var t = n.body || n.documentElement,
        t = t.style;
      return "" == t.WebkitTransition
        ? "-webkit-"
        : "" == t.MozTransition
          ? "-moz-"
          : "" == t.OTransition
            ? "-o-"
            : "" == t.transition
              ? ""
              : !1;
    },
      s = o() === !1 ? !1 : !0,
      a = function (t, e, n) {
        var i = {},
          s = o();
        (i[s + "transform"] = "translateX(" + e + ")"),
          (i[s + "transition"] = s + "transform " + n + "s linear"),
          t.css(i);
      },
      r = "ontouchstart" in e,
      l = e.navigator.pointerEnabled || e.navigator.msPointerEnabled,
      u = function (t) {
        if (r) return !0;
        if (
          !l ||
          "undefined" == typeof t ||
          "undefined" == typeof t.pointerType
        )
          return !1;
        if ("undefined" != typeof t.MSPOINTER_TYPE_MOUSE) {
          if (t.MSPOINTER_TYPE_MOUSE != t.pointerType) return !0;
        } else if ("mouse" != t.pointerType) return !0;
        return !1;
      };
    t.fn.imageLightbox = function (i) {
      var i = t.extend(
        {
          selector: 'id="imagelightbox"',
          allowedTypes: "png|jpg|jpeg|gif",
          animationSpeed: 250,
          preloadNext: !0,
          enableKeyboard: !0,
          quitOnEnd: !1,
          quitOnImgClick: !1,
          quitOnDocClick: !0,
          onStart: !1,
          onEnd: !1,
          onLoadStart: !1,
          onLoadEnd: !1,
        },
        i
      ),
        o = t([]),
        c = t(),
        d = t(),
        p = 0,
        h = 0,
        f = 0,
        m = !1,
        v = function (e) {
          return (
            "a" == t(e).prop("tagName").toLowerCase() &&
            new RegExp(".(" + i.allowedTypes + ")$", "i").test(
              t(e).attr("href")
            )
          );
        },
        g = function () {
          if (!d.length) return !0;
          var n = 0.8 * t(e).width(),
            i = 0.9 * t(e).height(),
            o = new Image();
          (o.src = d.attr("src")),
            (o.onload = function () {
              if (((p = o.width), (h = o.height), p > n || h > i)) {
                var s = p / h > n / i ? p / n : h / i;
                (p /= s), (h /= s);
              }
              d.css({
                width: p + "px",
                height: h + "px",
                top: (t(e).height() - h) / 2 + "px",
                left: (t(e).width() - p) / 2 + "px",
              });
            });
        },
        y = function (e) {
          if (m) return !1;
          if (
            ((e = "undefined" == typeof e ? !1 : "left" == e ? 1 : -1),
              d.length)
          ) {
            if (
              e !== !1 &&
              (o.length < 2 ||
                (i.quitOnEnd === !0 &&
                  ((-1 === e && 0 == o.index(c)) ||
                    (1 === e && o.index(c) == o.length - 1))))
            )
              return b(), !1;
            var n = { opacity: 0 };
            s
              ? a(d, 100 * e - f + "px", i.animationSpeed / 1e3)
              : (n.left = parseInt(d.css("left")) + 100 * e + "px"),
              d.animate(n, i.animationSpeed, function () {
                w();
              }),
              (f = 0);
          }
          (m = !0),
            i.onLoadStart !== !1 && i.onLoadStart(),
            setTimeout(function () {
              d = t("<img " + i.selector + " />")
                .attr("src", c.attr("href"))
                .load(function () {
                  d.appendTo("body"), g();
                  var n = { opacity: 1 };
                  if ((d.css("opacity", 0), s))
                    a(d, -100 * e + "px", 0),
                      setTimeout(function () {
                        a(d, "0px", i.animationSpeed / 1e3);
                      }, 50);
                  else {
                    var r = parseInt(d.css("left"));
                    (n.left = r + "px"), d.css("left", r - 100 * e + "px");
                  }
                  if (
                    (d.animate(n, i.animationSpeed, function () {
                      (m = !1), i.onLoadEnd !== !1 && i.onLoadEnd();
                    }),
                      i.preloadNext)
                  ) {
                    var l = o.eq(o.index(c) + 1);
                    l.length || (l = o.eq(0)),
                      t("<img />").attr("src", l.attr("href")).load();
                  }
                })
                .error(function () {
                  i.onLoadEnd !== !1 && i.onLoadEnd();
                });
              var n = 0,
                r = 0,
                h = 0;
              d.on(l ? "pointerup MSPointerUp" : "click", function (t) {
                if ((t.preventDefault(), i.quitOnImgClick)) return b(), !1;
                if (u(t.originalEvent)) return !0;
                var e =
                  (t.pageX || t.originalEvent.pageX) - t.target.offsetLeft;
                (c = o.eq(o.index(c) - (p / 2 > e ? 1 : -1))),
                  c.length || (c = o.eq(p / 2 > e ? o.length : 0)),
                  y(p / 2 > e ? "left" : "right");
              })
                .on("touchstart pointerdown MSPointerDown", function (t) {
                  return !u(t.originalEvent) || i.quitOnImgClick
                    ? !0
                    : (s && (h = parseInt(d.css("left"))),
                      void (n =
                        t.originalEvent.pageX ||
                        t.originalEvent.touches[0].pageX));
                })
                .on("touchmove pointermove MSPointerMove", function (t) {
                  return !u(t.originalEvent) || i.quitOnImgClick
                    ? !0
                    : (t.preventDefault(),
                      (r =
                        t.originalEvent.pageX ||
                        t.originalEvent.touches[0].pageX),
                      (f = n - r),
                      void (s
                        ? a(d, -f + "px", 0)
                        : d.css("left", h - f + "px")));
                })
                .on(
                  "touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel",
                  function (t) {
                    return !u(t.originalEvent) || i.quitOnImgClick
                      ? !0
                      : void (Math.abs(f) > 50
                        ? ((c = o.eq(o.index(c) - (0 > f ? 1 : -1))),
                          c.length || (c = o.eq(0 > f ? o.length : 0)),
                          y(f > 0 ? "right" : "left"))
                        : s
                          ? a(d, "0px", i.animationSpeed / 1e3)
                          : d.animate(
                            { left: h + "px" },
                            i.animationSpeed / 2
                          ));
                  }
                );
            }, i.animationSpeed + 100);
        },
        w = function () {
          return d.length ? (d.remove(), void (d = t())) : !1;
        },
        b = function () {
          return d.length
            ? void d.animate({ opacity: 0 }, i.animationSpeed, function () {
              w(), (m = !1), i.onEnd !== !1 && i.onEnd();
            })
            : !1;
        };
      return (
        t(e).on("resize", g),
        i.quitOnDocClick &&
        t(n).on(r ? "touchend" : "click", function (e) {
          d.length && !t(e.target).is(d) && b();
        }),
        i.enableKeyboard &&
        t(n).on("keyup", function (t) {
          return d.length
            ? (t.preventDefault(),
              27 == t.keyCode && b(),
              void (
                (37 == t.keyCode || 39 == t.keyCode) &&
                ((c = o.eq(o.index(c) - (37 == t.keyCode ? 1 : -1))),
                  c.length || (c = o.eq(37 == t.keyCode ? o.length : 0)),
                  y(37 == t.keyCode ? "left" : "right"))
              ))
            : !0;
        }),
        t(n).on("click", this.selector, function (e) {
          return v(this)
            ? (e.preventDefault(),
              m
                ? !1
                : ((m = !1),
                  i.onStart !== !1 && i.onStart(),
                  (c = t(this)),
                  void y()))
            : !0;
        }),
        this.each(function () {
          return v(this) ? void (o = o.add(t(this))) : !0;
        }),
        (this.switchImageLightbox = function (t) {
          var e = o.eq(t);
          if (e.length) {
            var n = o.index(c);
            (c = e), y(n > t ? "left" : "right");
          }
          return this;
        }),
        (this.quitImageLightbox = function () {
          return b(), this;
        }),
        this
      );
    };
  })(jQuery, window, document);
