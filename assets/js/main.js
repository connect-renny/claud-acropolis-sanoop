/* ═══════════════════════════════════════════════════════════════════════════
   main.js — Cloud Acropolis home page

   Every module is independent: it looks for its own markup, bails out
   silently if it isn't there, and never assumes another module ran.

   GSAP (assets/js/gsap.min.js) is optional. Without it, reveals fall back to
   the CSS `.reveal` transition and buttons keep their plain hover states.

     1. Boot          no-js class, copyright year
     2. Header        shadow once the page scrolls
     3. Mega menu     desktop "Our Services" dropdown
     4. Mobile nav    drawer + scrim
     5. Marketplace   category filter tabs
     6. Hero slider   autoplay, arrows, dots
     7. FAQ           accordion
     8. Buttons       data-btn tiers, press, magnetic hover, idle nudge (GSAP)
     9. Screens       side pager + per-section entrance animations
    10. Network map   dot-matrix world map with animated routes (canvas)
    11. Enquiry forms contact / partner forms → pre-filled email (no backend)
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";

  /* ─── 1. Boot ───────────────────────────────────────────────────────────── */
  document.documentElement.classList.remove("no-js");

  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ─── 2. Header ─────────────────────────────────────────────────────────── */
  (function () {
    var header = document.getElementById("siteHeader");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ─── 3. Mega menu ──────────────────────────────────────────────────────── */
  (function () {
    var menuButtons = document.querySelectorAll(".has-menu > .nav-link[data-menu]");
    if (!menuButtons.length) return;

    function panelFor(btn) {
      return document.getElementById("menu-" + btn.dataset.menu);
    }

    function closeAllMenus() {
      menuButtons.forEach(function (btn) {
        btn.setAttribute("aria-expanded", "false");
        var panel = panelFor(btn);
        if (panel) panel.classList.remove("is-open");
      });
    }

    menuButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        closeAllMenus();
        btn.setAttribute("aria-expanded", String(!isOpen));
        var panel = panelFor(btn);
        if (panel) panel.classList.toggle("is-open", !isOpen);
      });
    });

    document.addEventListener("click", closeAllMenus);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllMenus();
    });
  })();

  /* ─── 4. Mobile nav ─────────────────────────────────────────────────────── */
  (function () {
    var navToggle = document.getElementById("navToggle");
    var mobileNav = document.getElementById("mobileNav");
    var navScrim = document.getElementById("navScrim");
    if (!navToggle || !mobileNav) return;

    function setMobileNav(open) {
      navToggle.setAttribute("aria-expanded", String(open));
      mobileNav.classList.toggle("is-open", open);
      if (navScrim) navScrim.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    navToggle.addEventListener("click", function () {
      setMobileNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
    if (navScrim) {
      navScrim.addEventListener("click", function () {
        setMobileNav(false);
      });
    }
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setMobileNav(false);
      });
    });
  })();

  /* ─── 5. Marketplace filter ─────────────────────────────────────────────── */
  // Shared by the tabs and any other [data-filter] link on the page.
  (function () {
    var filterTabs = document.querySelectorAll(".filter-tab");
    var mpCards = document.querySelectorAll(".mp-card[data-category]");
    if (!filterTabs.length) return;

    function applyFilter(value) {
      filterTabs.forEach(function (tab) {
        var active = tab.dataset.filter === value;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      mpCards.forEach(function (card) {
        var show = value === "all" || card.dataset.category === value;
        card.classList.toggle("is-hidden", !show);
      });
    }

    document.querySelectorAll("[data-filter]").forEach(function (el) {
      el.addEventListener("click", function () {
        applyFilter(el.dataset.filter);
      });
    });
  })();

  /* ─── 6. Hero slider ────────────────────────────────────────────────────── */
  (function () {
    var heroSection = document.getElementById("heroSlider");
    if (!heroSection) return;

    var slides = heroSection.querySelectorAll(".hero-slide");
    var dots = heroSection.querySelectorAll(".hero-dot");
    var prev = heroSection.querySelector(".hero-arrow--prev");
    var next = heroSection.querySelector(".hero-arrow--next");
    var SLIDE_DURATION = 6000;
    var current = 0;
    var timer = null;
    if (slides.length < 2) return;

    function goTo(index) {
      index = (index + slides.length) % slides.length;
      if (index === current) return;
      slides[current].classList.remove("is-active");
      slides[index].classList.add("is-active");
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
      current = index;
    }

    function stopAutoplay() {
      if (timer) clearInterval(timer);
    }
    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(function () {
        goTo(current + 1);
      }, SLIDE_DURATION);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        goTo(parseInt(dot.dataset.goto, 10));
        startAutoplay();
      });
    });
    if (next) {
      next.addEventListener("click", function () {
        goTo(current + 1);
        startAutoplay();
      });
    }
    if (prev) {
      prev.addEventListener("click", function () {
        goTo(current - 1);
        startAutoplay();
      });
    }
    heroSection.addEventListener("mouseenter", stopAutoplay);
    heroSection.addEventListener("mouseleave", startAutoplay);
    startAutoplay();
  })();

  /* ─── 7. FAQ accordion ──────────────────────────────────────────────────── */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    item.classList.toggle("is-open", btn.getAttribute("aria-expanded") === "true");

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      item.classList.toggle("is-open", !open);
    });
  });

  /* ─── 8. Buttons (GSAP) ─────────────────────────────────────────────────── */
  (function () {
    if (!hasGsap) return;
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".btn"));
    if (!buttons.length) return;

    // Tag every button with its animation tier so the CSS (fill sweep, top-edge
    // bar) and the JS below key off one data-btn attribute.
    function classify(btn) {
      if (btn.closest("#siteHeader")) return "dark";
      if (btn.classList.contains("btn-primary")) return "primary";
      if (btn.classList.contains("btn-white")) return "primary-light";
      if (btn.classList.contains("btn-outline-light")) return "outline-dark";
      if (btn.classList.contains("btn-outline")) return "outline";
      return null;
    }
    buttons.forEach(function (btn) {
      var type = classify(btn);
      if (type) btn.setAttribute("data-btn", type);
    });

    var canHover = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Press feedback works for mouse and touch alike.
    if (!reduceMotion) {
      buttons.forEach(function (btn) {
        function press() {
          gsap.to(btn, { scale: 0.97, duration: 0.1, ease: "power2.out", overwrite: "auto" });
        }
        function release() {
          gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        }
        btn.addEventListener("pointerdown", press);
        btn.addEventListener("pointerup", release);
        btn.addEventListener("pointercancel", release);
        btn.addEventListener("pointerleave", release);
      });
    }

    // Magnetic hover, arrow nudge and the idle loop: fine pointers only.
    if (!canHover || reduceMotion) return;

    var MAGNETIC_TYPES = { primary: 1, "primary-light": 1, dark: 1 };

    buttons.forEach(function (btn) {
      var type = btn.getAttribute("data-btn");
      if (!MAGNETIC_TYPES[type]) return;

      var isHeader = type === "dark";
      var rangeX = isHeader ? 3 : 6;
      var rangeY = isHeader ? 2 : 4;
      var hoverScale = isHeader ? 1.015 : 1.02;

      var xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3.out" });
      var yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3.out" });
      var scaleTo = gsap.quickTo(btn, "scale", { duration: 0.35, ease: "power3.out" });

      var arrow = btn.querySelector(".arrow");
      var arrowTo = arrow ? gsap.quickTo(arrow, "x", { duration: 0.3, ease: "power3.out" }) : null;

      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var relX = (e.clientX - r.left) / r.width - 0.5;
        var relY = (e.clientY - r.top) / r.height - 0.5;
        xTo(relX * rangeX * 2);
        yTo(relY * rangeY * 2);
        scaleTo(hoverScale);
        if (arrowTo) arrowTo(isHeader ? 3 : 6);
      });

      btn.addEventListener("mouseleave", function () {
        gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.out", overwrite: "auto" });
        if (arrow) gsap.to(arrow, { x: 0, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      });
    });

    // Occasional idle nudge on the most important CTAs, via one shared interval.
    var idleSelectors = [".hero-slide.is-active .btn .arrow", "#finalCtaPanel .btn-white .arrow"];
    var lastInteraction = Date.now();
    ["mousemove", "scroll", "keydown"].forEach(function (evt) {
      document.addEventListener(evt, function () {
        lastInteraction = Date.now();
      }, { passive: true });
    });

    setInterval(function () {
      if (Date.now() - lastInteraction < 4000) return;
      var candidates = [];
      idleSelectors.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.width > 0 && r.top < window.innerHeight && r.bottom > 0) candidates.push(el);
        });
      });
      if (!candidates.length) return;
      var el = candidates[Math.floor(Math.random() * candidates.length)];
      gsap.timeline({ defaults: { ease: "power2.out" } })
        .to(el, { x: 4, duration: 0.3 })
        .to(el, { x: 0, duration: 0.3 });
    }, 5000);
  })();

  /* ─── 9. Screens: pager + entrance animations ───────────────────────────── */
  (function () {
    var screens = Array.prototype.slice.call(document.querySelectorAll("[data-screen]"));
    if (!screens.length) return;

    var header = document.getElementById("siteHeader");

    // Pager — one dot per [data-screen] section. CSS shows it in screen mode only.
    var pager = document.getElementById("screenPager");
    var dots = [];
    if (pager) {
      dots = screens.map(function (sec, i) {
        var label = sec.getAttribute("data-screen");
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "pager-dot";
        dot.setAttribute("aria-label", "Go to " + label);
        dot.innerHTML = '<span class="pager-label">' + label + "</span>";
        dot.addEventListener("click", function () {
          var behavior = reduceMotion ? "auto" : "smooth";
          if (i === 0) window.scrollTo({ top: 0, behavior: behavior });
          else sec.scrollIntoView({ behavior: behavior });
        });
        pager.appendChild(dot);
        return dot;
      });
    }

    var activeIndex = -1;
    function updateActive() {
      var headerH = header ? header.offsetHeight : 0;
      var probe = headerH + (window.innerHeight - headerH) * 0.45;
      var idx = 0;
      for (var i = 0; i < screens.length; i++) {
        if (screens[i].getBoundingClientRect().top <= probe) idx = i;
      }
      if (idx === activeIndex) return;
      activeIndex = idx;
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === idx);
        if (i === idx) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
      if (pager) {
        var sec = screens[idx];
        pager.classList.toggle("on-dark", sec.classList.contains("section-dark") || sec.classList.contains("hero"));
      }
    }

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        updateActive();
      });
    }, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();

    // Entrance animations. GSAP when available; otherwise the CSS .reveal
    // transition, toggled by an IntersectionObserver.
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    var useGsap = hasGsap && !reduceMotion && "IntersectionObserver" in window;

    if (!useGsap) {
      if (!("IntersectionObserver" in window) || reduceMotion) {
        revealEls.forEach(function (el) {
          el.classList.add("in-view");
        });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) {
        io.observe(el);
      });
      return;
    }

    var HEAD_SEL = [
      ".split-head .eyebrow", ".split-head .section-title", ".split-head-aside > *", ".filter-tabs",
      ".section-head > *", ".faq-head > *",
      ".network-copy > .eyebrow", ".network-copy > .section-title", ".network-copy > .section-intro",
      ".contact-copy > *"
    ].join(",");
    var EXTRA_SEL = ".faq-item, .contact-card, .network-visual";
    var CLEAR = "transform,opacity,visibility";

    // Play once 20% of the section — or, for sections taller than five
    // screens (stacked plan cards on a phone), 20% of the screen — is in view.
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var enough = entry.intersectionRatio >= 0.2 || entry.intersectionRect.height >= window.innerHeight * 0.2;
        if (!enough) return;
        sectionIO.unobserve(entry.target);
        play(entry.target);
      });
    }, { threshold: [0, 0.05, 0.1, 0.15, 0.2] });

    screens.forEach(function (sec) {
      if (sec.classList.contains("hero")) return; // the hero has its own CSS slide transitions

      var head = sec.querySelectorAll(HEAD_SEL);
      var items = sec.querySelectorAll(".reveal");
      var extra = sec.querySelectorAll(EXTRA_SEL);

      // GSAP owns these now — drop the CSS transition so the two don't fight.
      Array.prototype.forEach.call(items, function (el) {
        el.classList.remove("reveal");
      });

      gsap.set(head, { autoAlpha: 0, y: 24 });
      gsap.set(items, { autoAlpha: 0, y: 36 });
      gsap.set(extra, { autoAlpha: 0, y: 18 });

      sec._anim = { head: head, items: items, extra: extra };
      sectionIO.observe(sec);
    });

    function play(sec) {
      var a = sec._anim;
      if (!a) return;
      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (a.head.length) {
        tl.to(a.head, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, clearProps: CLEAR });
      }
      if (a.items.length) {
        tl.to(a.items, {
          autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, clearProps: CLEAR,
          onStart: function () {
            // Kicks off CSS that keys off .in-view (the How It Works timeline).
            Array.prototype.forEach.call(a.items, function (el) {
              el.classList.add("in-view");
            });
          }
        }, a.head.length ? "-=0.45" : 0);
      }
      if (a.extra.length) {
        tl.to(a.extra, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.045, clearProps: CLEAR }, "-=0.55");
      }
    }
  })();

  /* ─── 10. Network map ───────────────────────────────────────────────────── */
  // Dot-matrix world map with animated routes from Muscat, for the
  // Carrier-Neutral Network screen. The land grid was rasterised from Natural
  // Earth 1:50m land (world-atlas) — each row is a hex bitmask, 1 = land cell.
  (function () {
    var netCanvas = document.getElementById("networkCanvas");
    if (!netCanvas) return;

    var MAP_DATA = {"world":{"top":78,"left":-180,"step":1.5,"cols":240,"rows":["0000000000e00003803ffffffff00000300000000000100c000000000000","00000000003dce18c0007fffffe0000000000001e00003fff0002f000000","000000000740000000003fffffe000000000000600003fff800000000000","0000000007fcc6adc0000ffffd800000000000180303ffffeffc02000000","c0010000023fc0c6ff8007fffec0000000000008076ffffffffcfff80001","001fffc0f23ffac127e01bffff0000000ffc0000c77fffffffffffffe0bc","c07fffffffe0437985e003fff00000001fffc637ffbfffffffffffffffff","ec0fffffffffffff81fe07ff800000007ffde3fffd7fffffffffffffffff","187ffffffffffffd0fe407f8007e00007c7e1fffffffffffffffffffffff","0007ffffffffffd340f803f800300003fdfffffffffffffffffffffffffe","003fffffffffffc08e3001f00000100ff3fffffffffffffffffffffffff8","001ffbffffffff800fc000700000001ff3ffffffffffffffffffffff07c0","000f801fffffff800fcc00000000001ff0fffffffffffffffffffe461800","00014007ffffffc007fe000000000800e8fffffffffffffffffff8007800","00040000fffffff817fe000000000c0663fffffffffffffffffff000f800","002000017fffffff9fff80000000320307ffffffffffffffffffc000f000","000000003fffffff9fffe0000000370ffffffffffffffffffffffc00e000","000000001fffffffdfffc0000000479ffffffffffffffffffffffd008000","000000001ffffffffff1000000000c7ffffffffffffffffffffffd010000","0000000007ffffffffd87000000001fffffffffffffffffffffff8000000","0000000007fffffffff80800000001fffffffffffffffffffffff8000000","0000000007fffffffffc0000000001fffff27f1ffffffffffffff0000000","0000000007ffffffffc80000000001ff3fe03e3fffffffffffffe3000000","0000000007ffffffff80000000003fc18fe00f1fffffffffffff07000000","0000000007fffffffe00000000003f8067e79f8ffffffffffffc00000000","0000000007fffffffe00000000003f00067fff8fffffffffff5806000000","0000000003fffffffc00000000003f00233fff8ffffffffffe1c04000000","0000000001fffffff80000000000082e0037ffdfffffffffff8c1c000000","0000000001fffffff800000000000dfe00c2ffffffffffffff0cfc000000","00000000007fffffe000000000001ffe0000ffffffffffffff02e0000000","00000000003fffffc000000000003fffc601ffffffffffffff8100000000","000000000017ffffc000000000007ffff7ffffffffffffffff8000000000","00000000001fff984000000000007fffffffff3fffffffffff8000000000","00000000001bfe00400000000001fffffffcff9fffffffffff0000000000","000000000005fe00600000000003fffffffeff83ffffffffff0000000000","000000000004fe00000000000003fffffffe7fcc07fffffffe0000000000","0000000000007e00000000000007ffffffff3ffe03fffffffc8000000000","0000000000003e00100000000007ffffffffbfff03fff7ffe00000000000","0000000000003e0c0e0000000007ffffffff9ffe007fc3fe000000000000","0000000000001f1c00c000000007ffffffff9ffc007f01fcc00000000000","00000000000007f8000000000007ffffffffcff8007e01fe00c000000000","000000000000013f000000000007ffffffffcfe0007c007f008000000000","000000000000001f800000000007fffffffff7800038007f808000000000","0000000000000003000000000007fffffffffc000038003f800000000000","0000000000000001014000000007fffffffff8c000180007807000000000","0000000000000000837e00000001ffffffffffc0001c0002000000000000","00000000000000004fff00000001ffffffffff8000140020003000000000","00000000000000000fff80000000ffffffffff8000060010001000000000","00000000000000000ffff80000003e0fffffff0000000198070000000000","000000000000000007fffc0000000003ffffff00000000d80c0000000000","00000000000000000ffffc0000000001fffffc00000000683e0400000000","00000000000000001ffffc0000000003fffff800000000307ee400000000","00000000000000003fffff8000000003fffff000000000187c04a0000000","00000000000000003fffffc000000003ffffe0000000003c7d8098000000","00000000000000003ffffffc00000001ffffe0000000000e0c487f000000","00000000000000003fffffff00000000ffffe0000000000600000f800000","00000000000000001fffffff80000000ffffc00000000003000047c00000","00000000000000001fffffff800000007fffc0000000000038200f600000","00000000000000000fffffff000000007fffc00000000000002000300000","00000000000000000ffffffe000000007fffe00000000000000100000000","000000000000000007fffffe000000007fffe000000000000001e1000000","000000000000000007fffffc00000000ffffe08000000000000be3000000","000000000000000003fffffc00000000ffffe1c000000000001fe3800000","000000000000000000fffffc00000000ffff878000000000007ffb800000","0000000000000000007ffffc00000000ffff078000000000007fffc00000","0000000000000000007ffff8000000007ffe03020000000001ffffe00000","0000000000000000007ffff8000000007fff07000000000007fffff00200","0000000000000000007fffc0000000003fff0700000000000ffffff80000","0000000000000000007fff00000000003ffe0600000000000ffffffc0000","0000000000000000007fff00000000003ffc0000000000001ffffffc0000","0000000000000000007fff00000000003ffc0000000000000ffffffc0000","000000000000000000fffe00000000001ff800000000000007fffffc0000","000000000000000000fffc00000000000ff000000000000007fffffc0000","000000000000000000fff800000000000fe000000000000007f87ffc0000","000000000000000000fff000000000000f8000000000000007c02ff80000","000000000000000000ffc00000000000000000000000000000000ff00010","000000000000000001ffc000000000000000000000000000000007f00008","000000000000000001ff800000000000000000000000000000000340000e","000000000000000001fe000000000000000000000000000000000000000c","000000000000000001f80000000000000000000000000000000000e00008","000000000000000001fc0000000000000000000000000000000000600030","000000000000000001f000000000000000000000000000000000000000c0","000000000000000001e000000000000000000000000000000000000001c0","000000000000000003f00000000000000000000000000000000000000000","000000000000000003e00000000000000000000000000000000000000000","000000000000000003c00000000000000000000000000000000000000000","000000000000000001c08000000000000000000000000000000000000000","000000000000000001c00000000000000000000000000000000000000000","000000000000000000380000000000000000000000000000000000000000","000000000000000000000000000000000000000000000000000000000000"]}};

    var WORLD = MAP_DATA.world;
    var MUSCAT = [58.4, 23.6];
    // Illustrative international nodes — a visual of global reach, not a map
    // of specific routes.
    var CITIES = [
      [-0.13, 51.5], [8.68, 50.1], [5.37, 43.3], [31.2, 30.0], [39.7, -4.0], [28.0, -26.2],
      [72.9, 19.1], [103.8, 1.35], [114.2, 22.3], [139.7, 35.7], [151.2, -33.9], [-74.0, 40.7], [55.3, 25.2]
    ];
    var EXTRA_LINKS = [[0, 11], [7, 8], [8, 9], [7, 10], [2, 3], [0, 1], [4, 5]];

    function decode(g) {
      var pts = [];
      g.rows.forEach(function (hex, r) {
        for (var i = 0; i < hex.length; i++) {
          var v = parseInt(hex.charAt(i), 16);
          for (var b = 0; b < 4; b++) {
            var c = i * 4 + b;
            if (c < g.cols && (v & (8 >> b))) pts.push([c, r]);
          }
        }
      });
      return pts;
    }

    // Lon/lat → fractional grid cell (cell centres sit at +0.5).
    function toGrid(g, lon, lat) {
      return [(lon - g.left) / g.step, (g.top - lat) / g.step];
    }

    // Scale the grid to cover the box, then place an anchor cell near
    // (ax, ay) without exposing edges.
    function layout(g, W, H, anchor, ax, ay, zoom) {
      var cs = Math.max(W / g.cols, H / g.rows.length) * (zoom || 1);
      var mapW = g.cols * cs, mapH = g.rows.length * cs;
      var offX = Math.min(0, Math.max(W - mapW, W * ax - (anchor[0] + 0.5) * cs));
      var offY = Math.min(0, Math.max(H - mapH, H * ay - (anchor[1] + 0.5) * cs));
      return { cs: cs, offX: offX, offY: offY };
    }

    function sizeCanvas(canvas) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = canvas.clientWidth, H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      var ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx: ctx, W: W, H: H, dpr: dpr };
    }

    function quadPoint(a, c, b, t) {
      var u = 1 - t;
      return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
    }

    // Bow every route "north" so the arcs read like long-haul links.
    function control(a, b, bow) {
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      var dx = b[0] - a[0], dy = b[1] - a[1];
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dy / len, ny = dx / len;
      if (ny > 0) { nx = -nx; ny = -ny; }
      return [mx + nx * len * bow, my + ny * len * bow];
    }

    var worldPts = decode(WORLD);
    var net = null, offscreen = null, links = [], nodes = [], hub = null, running = false, rafId = 0;

    function buildNet() {
      var s = sizeCanvas(netCanvas);
      if (!s.W || !s.H) return;
      var mus = toGrid(WORLD, MUSCAT[0], MUSCAT[1]);
      var wide = s.W > 560;
      var L = layout(WORLD, s.W, s.H, mus, 0.55, 0.5, wide ? 1.15 : 1.4);
      function px(lon, lat) {
        var g = toGrid(WORLD, lon, lat);
        return [L.offX + g[0] * L.cs, L.offY + g[1] * L.cs];
      }
      hub = px(MUSCAT[0], MUSCAT[1]);

      // Pre-render the dot layer once per resize; dots near Muscat are brighter.
      offscreen = document.createElement("canvas");
      offscreen.width = netCanvas.width;
      offscreen.height = netCanvas.height;
      var o = offscreen.getContext("2d");
      o.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      var r = Math.max(1.1, L.cs * 0.3);
      var reach = Math.max(s.W, s.H) * 0.45;
      worldPts.forEach(function (p) {
        var x = L.offX + (p[0] + 0.5) * L.cs, y = L.offY + (p[1] + 0.5) * L.cs;
        if (x < -4 || y < -4 || x > s.W + 4 || y > s.H + 4) return;
        var d = Math.sqrt((x - hub[0]) * (x - hub[0]) + (y - hub[1]) * (y - hub[1]));
        var near = Math.max(0, 1 - d / reach);
        o.fillStyle = "rgba(" + Math.round(52 + 10 * near) + "," + Math.round(82 + 25 * near) + "," + Math.round(190 + 50 * near) + "," + (0.34 + 0.4 * near).toFixed(3) + ")";
        o.beginPath();
        o.arc(x, y, r, 0, Math.PI * 2);
        o.fill();
      });

      nodes = CITIES.map(function (c, i) {
        return { p: px(c[0], c[1]), phase: (i * 0.37) % 1 };
      });
      links = [];
      nodes.forEach(function (n, i) {
        links.push({ a: hub, b: n.p, c: control(hub, n.p, 0.22), phase: (i * 0.173) % 1, dur: 4900 + (i % 4) * 800, main: true });
      });
      EXTRA_LINKS.forEach(function (pair, i) {
        var a = nodes[pair[0]].p, b = nodes[pair[1]].p;
        links.push({ a: a, b: b, c: control(a, b, 0.18), phase: (i * 0.29) % 1, dur: 6300 + (i % 3) * 900, main: false });
      });
      net = s;
    }

    // Route "draw-in" progress (0 → 1), tweened the first time the screen shows.
    var reveal = { p: reduceMotion || !hasGsap ? 1 : 0 };
    var clock = 0;

    // Partial quadratic curve from t=0 to t=end.
    function strokeCurve(ctx, l, end) {
      var steps = 28;
      ctx.beginPath();
      ctx.moveTo(l.a[0], l.a[1]);
      for (var k = 1; k <= steps; k++) {
        var pt = quadPoint(l.a, l.c, l.b, (k / steps) * end);
        ctx.lineTo(pt[0], pt[1]);
      }
      ctx.stroke();
    }

    function drawNet(time) {
      if (!net || !offscreen) return;
      var ctx = net.ctx, W = net.W, H = net.H;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(offscreen, 0, 0, W, H);

      // Route lines, growing outward from Muscat during the reveal.
      links.forEach(function (l, i) {
        var lp = Math.max(0, Math.min(1, reveal.p * 1.6 - (l.main ? i * 0.035 : 0.45 + i * 0.03)));
        l.lp = lp;
        if (!lp) return;
        ctx.strokeStyle = l.main ? "rgba(62,107,240,.7)" : "rgba(124,58,237,.38)";
        ctx.lineWidth = l.main ? 2.2 : 1.7;
        strokeCurve(ctx, l, lp);
      });

      // Travelling pulses with a short fading tail (fully drawn routes only).
      if (time !== null) {
        links.forEach(function (l) {
          if (l.lp < 1) return;
          var t = ((time / l.dur) + l.phase) % 1;
          for (var k = 0; k < 8; k++) {
            var tt = t - k * 0.01;
            if (tt < 0) break;
            var pt = quadPoint(l.a, l.c, l.b, tt);
            ctx.beginPath();
            ctx.arc(pt[0], pt[1], (l.main ? 3.2 : 2.4) * (1 - k / 9), 0, Math.PI * 2);
            ctx.fillStyle = l.main ? "rgba(62,107,240," + (0.95 - k * 0.11) + ")" : "rgba(124,58,237," + (0.6 - k * 0.07) + ")";
            ctx.fill();
          }
        });
      }

      // City nodes with a soft breathing halo.
      var nodeAlpha = Math.max(0, Math.min(1, reveal.p * 2 - 0.6));
      nodes.forEach(function (n) {
        if (!nodeAlpha) return;
        var pulse = time === null ? 0.5 : (Math.sin(time / 1000 + n.phase * 6.28) + 1) / 2;
        ctx.globalAlpha = nodeAlpha;
        ctx.beginPath();
        ctx.arc(n.p[0], n.p[1], 7 + pulse * 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(62,107,240," + (0.08 + pulse * 0.1) + ")";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.p[0], n.p[1], 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = "#3E6BF0";
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Muscat hub: expanding ring, soft glow, gradient core.
      var hp = time === null ? 0.4 : (time % 2300) / 2300;
      ctx.beginPath();
      ctx.arc(hub[0], hub[1], 9 + hp * 28, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(62,107,240," + (0.6 * (1 - hp)).toFixed(3) + ")";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      var grd = ctx.createRadialGradient(hub[0], hub[1], 0, hub[0], hub[1], 26);
      grd.addColorStop(0, "rgba(62,107,240,.28)");
      grd.addColorStop(1, "rgba(62,107,240,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(hub[0], hub[1], 26, 0, Math.PI * 2);
      ctx.fill();
      var core = ctx.createLinearGradient(hub[0] - 6, hub[1] - 6, hub[0] + 6, hub[1] + 6);
      core.addColorStop(0, "#3E6BF0");
      core.addColorStop(1, "#7C3AED");
      ctx.beginPath();
      ctx.arc(hub[0], hub[1], 6.5, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    }

    // Driven by GSAP's ticker when available, requestAnimationFrame otherwise.
    var useTicker = !!(hasGsap && gsap.ticker);
    function tick() {
      clock = useTicker ? gsap.ticker.time * 1000 : performance.now();
      drawNet(clock);
      if (running && !useTicker) rafId = requestAnimationFrame(tick);
    }
    function start() {
      if (running) return;
      if (reveal.p < 1 && hasGsap) {
        gsap.to(reveal, {
          p: 1, duration: 1.9, delay: 0.2, ease: "power2.inOut",
          onUpdate: function () {
            if (reduceMotion || !running) drawNet(null);
          }
        });
      }
      if (reduceMotion) return;
      running = true;
      if (useTicker) gsap.ticker.add(tick);
      else rafId = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      if (useTicker) gsap.ticker.remove(tick);
      else cancelAnimationFrame(rafId);
    }

    buildNet();
    drawNet(reduceMotion ? null : 0);

    // Only animate while the screen is visible.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.15 }).observe(netCanvas);
    } else {
      reveal.p = 1;
      start();
    }
    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        buildNet();
        drawNet(reduceMotion ? null : clock);
      }).observe(netCanvas);
    }
  })();

  /* ─── 11. Enquiry forms ─────────────────────────────────────────────────── */
  // The site is static, so a form[data-mailto] validates natively, then
  // opens the visitor's mail client with every labelled field in the body.
  (function () {
    var forms = document.querySelectorAll("form[data-mailto]");
    if (!forms.length) return;

    forms.forEach(function (form) {
      var status = form.querySelector(".form-status");

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var hp = form.querySelector(".form-hp input");
        if (hp && hp.value) return;

        if (!form.checkValidity()) {
          form.querySelectorAll("input, select, textarea").forEach(function (el) {
            el.setAttribute("aria-invalid", el.checkValidity() ? "false" : "true");
          });
          form.reportValidity();
          return;
        }

        var lines = [];
        form.querySelectorAll("[name]").forEach(function (el) {
          if (el.closest(".form-hp") || !el.labels || !el.labels.length) return;
          var label = el.labels[0].textContent.replace(/\*/g, "").trim();
          var value = el.type === "checkbox" ? (el.checked ? "Yes" : "No") : el.value.trim();
          if (value) lines.push(label + ": " + value);
        });

        window.location.href =
          "mailto:" + form.dataset.mailto +
          "?subject=" + encodeURIComponent(form.dataset.subject || "Website enquiry") +
          "&body=" + encodeURIComponent(lines.join("\n"));

        if (status) {
          status.dataset.state = "success";
          status.textContent = "Your email app should open with your message ready to send. If it doesn't, write to " + form.dataset.mailto + ".";
        }
      });

      form.addEventListener("input", function (e) {
        if (e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) {
          e.target.setAttribute("aria-invalid", "false");
        }
      });
    });
  })();
})();
