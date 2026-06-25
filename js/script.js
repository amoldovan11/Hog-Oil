/* =========================================================
   HOG OIL — site interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Clone the can into the hero stage ----------
     The canonical <svg id="theCan"> lives in the product section.
     We clone it into the hero and namespace every internal id so
     gradient/filter references stay valid (no duplicate ids). */
  function namespaceSvg(svg, suffix) {
    var idEls = svg.querySelectorAll("[id]");
    idEls.forEach(function (el) {
      var oldId = el.id;
      var newId = oldId + "-" + suffix;
      el.id = newId;
      // rewrite references across the cloned subtree
      var refAttrs = ["fill", "stroke", "filter", "clip-path", "mask", "href"];
      svg.querySelectorAll("*").forEach(function (node) {
        refAttrs.forEach(function (attr) {
          var val = node.getAttribute(attr);
          if (val && val.indexOf("#" + oldId) !== -1) {
            node.setAttribute(attr, val.replace("#" + oldId, "#" + newId));
          }
        });
        var xlink = node.getAttribute("xlink:href");
        if (xlink && xlink === "#" + oldId) node.setAttribute("xlink:href", "#" + newId);
      });
    });
  }

  var source = document.getElementById("theCan");
  var stage = document.getElementById("canStage");
  if (source && stage) {
    var clone = source.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.add("can");
    namespaceSvg(clone, "hero");
    stage.appendChild(clone);
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = [
    ".section-head", ".product__detail", ".product__visual",
    ".feat", ".datasheet", ".specs__intro", ".step",
    ".report", ".price-card", ".signup"
  ];
  var nodes = [];
  revealTargets.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (n) { nodes.push(n); });
  });

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !prefersReduced) {
    nodes.forEach(function (n, i) {
      n.classList.add("reveal");
      n.style.transitionDelay = (i % 3) * 80 + "ms";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Subtle can tilt on pointer move (hero) ---------- */
  var heroCan = stage ? stage.querySelector(".can") : null;
  if (heroCan && !prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    var hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5;
      var dy = (e.clientY - r.top) / r.height - 0.5;
      heroCan.style.transform = "rotateY(" + (dx * 10) + "deg) rotateX(" + (-dy * 8) + "deg)";
    });
    hero.addEventListener("mouseleave", function () { heroCan.style.transform = ""; });
  }

  /* ---------- Newsletter signup ---------- */
  var form = document.getElementById("signup");
  if (form) {
    var msg = document.getElementById("signupMsg");
    var input = document.getElementById("email");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = (input.value || "").trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!ok) {
        msg.textContent = "That email won't cut it, partner. Try again.";
        msg.className = "signup__msg err";
        input.focus();
        return;
      }
      msg.textContent = "You're in the herd. Watch your inbox for the next drop. \u{1F417}";
      msg.className = "signup__msg ok";
      form.reset();
    });
  }

  /* ---------- Fake "add to crate" ---------- */
  var crate = 0;
  document.querySelectorAll("[data-buy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      crate++;
      var original = btn.textContent;
      btn.textContent = "Loaded ✔ (" + crate + ")";
      btn.style.pointerEvents = "none";
      setTimeout(function () {
        btn.textContent = original;
        btn.style.pointerEvents = "";
      }, 1400);
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav__links a");
  if ("IntersectionObserver" in window && navLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (a) {
            a.style.color = a.getAttribute("href") === "#" + id ? "var(--bone)" : "";
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* =======================================================
     ABSURDITY LAYER
     ======================================================= */

  /* ---------- Testosterone HUD (scroll + clicks) ---------- */
  var hud = document.getElementById("hud");
  var hudFill = document.getElementById("hudFill");
  var hudVal = document.getElementById("hudVal");
  var clickBonus = 0;
  function updateHud() {
    if (!hudFill) return;
    var h = document.documentElement;
    var max = (h.scrollHeight - h.clientHeight) || 1;
    var scrollPct = Math.min(100, (h.scrollTop / max) * 100);
    var pct = Math.min(100, Math.round(scrollPct * 0.7 + clickBonus));
    hudFill.style.width = pct + "%";
    if (hudVal) hudVal.textContent = pct;
    if (hud) hud.classList.toggle("maxed", pct >= 100);
  }
  window.addEventListener("scroll", updateHud, { passive: true });
  window.addEventListener("resize", updateHud);
  updateHud();

  /* ---------- GREASE UP chaos button ---------- */
  var greaseBtn = document.getElementById("greaseUp");
  var manCount = document.getElementById("manCount");
  var manliness = 0;
  var EMOJI = ["🔥", "🦅", "🥓", "💪", "🇺🇸", "🪓", "🐗", "⭐", "🛻", "🍖"];
  var audioCtx = null;

  function airHorn() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var now = audioCtx.currentTime;
      [220, 277].forEach(function (freq, i) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
        o.connect(g).connect(audioCtx.destination);
        o.start(now + i * 0.01);
        o.stop(now + 0.36);
      });
    } catch (e) { /* audio not available — no problem */ }
  }

  function spawnParticles(x, y) {
    if (prefersReduced) return;
    for (var i = 0; i < 14; i++) {
      var p = document.createElement("span");
      p.className = "grease-particle";
      p.textContent = EMOJI[(Math.random() * EMOJI.length) | 0];
      var ang = Math.random() * Math.PI * 2;
      var dist = 90 + Math.random() * 160;
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--dy", (Math.sin(ang) * dist - 60) + "px");
      p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(p);
      setTimeout((function (node) { return function () { node.remove(); }; })(p), 950);
    }
  }

  if (greaseBtn) {
    greaseBtn.addEventListener("click", function () {
      manliness += 50 + ((Math.random() * 450) | 0);
      if (manCount) manCount.textContent = manliness.toLocaleString("en-US");
      clickBonus = Math.min(100, clickBonus + 9);
      updateHud();
      var r = greaseBtn.getBoundingClientRect();
      spawnParticles(r.left + r.width / 2, r.top + r.height / 2);
      if (!prefersReduced) {
        document.body.classList.remove("shake");
        void document.body.offsetWidth; /* reflow to restart animation */
        document.body.classList.add("shake");
        setTimeout(function () { document.body.classList.remove("shake"); }, 450);
      }
      airHorn();
      if (manliness >= 5000 && greaseBtn.textContent.indexOf("MAX") === -1) {
        greaseBtn.innerHTML = "MAX GREASE 🔥";
      }
    });
  }

  /* ---------- Animated stat counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1600;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US") + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Ingredient bars reveal ---------- */
  var reactorGrid = document.querySelector(".reactor__grid");
  if (reactorGrid && "IntersectionObserver" in window) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { reactorGrid.classList.add("bars-go"); bio.disconnect(); }
      });
    }, { threshold: 0.25 });
    bio.observe(reactorGrid);
  } else if (reactorGrid) {
    reactorGrid.classList.add("bars-go");
  }

  /* ---------- Hog Wisdom generator ---------- */
  var WISDOM = [
    "A man's handshake should leave a small bruise of respect.",
    "If you can hear your own truck, you are not driving it hard enough.",
    "Brisket is just patience you can eat.",
    "The sun respects effort. Out-effort the sun.",
    "Grease is just confidence you can apply topically.",
    "A real one keeps jumper cables he hopes to never use.",
    "You miss 100% of the fences you do not mend.",
    "Never trust a sunset that didn't make you a little emotional.",
    "If it's broken, fix it. If it's fine, fix it anyway.",
    "The strongest tool in the shed is showing up."
  ];
  var wisdomBtn = document.getElementById("wisdomBtn");
  var wisdomOut = document.getElementById("wisdom");
  var lastWisdom = -1;
  if (wisdomBtn && wisdomOut) {
    wisdomBtn.addEventListener("click", function () {
      var i;
      do { i = (Math.random() * WISDOM.length) | 0; } while (i === lastWisdom && WISDOM.length > 1);
      lastWisdom = i;
      wisdomOut.textContent = "“" + WISDOM[i] + "”";
    });
  }

  /* ---------- MAXIMUM OVERDRIVE (Konami): keyboard + touch ---------- */
  var banner = document.getElementById("overdriveBanner");
  function fireOverdrive() {
    var on = document.body.classList.toggle("overdrive");
    if (banner) banner.hidden = !on;
    if (on && manCount) { manliness += 9000; manCount.textContent = manliness.toLocaleString("en-US"); }
    if (on && !prefersReduced) { spawnParticles(window.innerWidth / 2, window.innerHeight / 2); }
  }

  // Generic sequence matcher with an inactivity reset.
  // onStep(matched, total) fires whenever progress is made (used for haptics).
  function makeMatcher(seq, onDone, onStep) {
    var pos = 0, timer = null;
    return function (tok) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { pos = 0; }, 5000);
      if (tok === seq[pos]) {
        pos++;
        if (onStep) onStep(pos, seq.length);
        if (pos === seq.length) { pos = 0; onDone(); }
      } else {
        pos = (tok === seq[0]) ? 1 : 0;
        if (onStep && pos === 1) onStep(1, seq.length);
      }
    };
  }

  // Desktop: ↑ ↑ ↓ ↓ ← → ← → B A
  var KMAP = { ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R", b: "B", a: "A" };
  var kmatch = makeMatcher(["U","U","D","D","L","R","L","R","B","A"], fireOverdrive);
  window.addEventListener("keydown", function (e) {
    var tok = KMAP[e.key] || (e.key ? KMAP[e.key.toLowerCase()] : null);
    if (tok) kmatch(tok);
  });

  // Mobile: swipe up, up, down, down, left, right, left, right (no taps — a tap fires
  // by accident on touch, e.g. when stopping a momentum scroll, and would reset you).
  // Sub-threshold touches are ignored entirely, so stray taps never break a run.
  // Listeners are passive, so normal scrolling still works. Each correct swipe buzzes.
  var SWIPE_MIN = 26;
  var tmatch = makeMatcher(["U","U","D","D","L","R","L","R"], fireOverdrive, function (n, total) {
    if (navigator.vibrate) { try { navigator.vibrate(n === total ? [50, 30, 70] : 18); } catch (er) {} }
  });
  var sx = 0, sy = 0;
  window.addEventListener("touchstart", function (e) {
    var t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY;
  }, { passive: true });
  window.addEventListener("touchend", function (e) {
    var t = e.changedTouches[0];
    var dx = t.clientX - sx, dy = t.clientY - sy;
    var ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < SWIPE_MIN) return;        // ignore taps / tiny moves
    tmatch(ay >= ax ? (dy < 0 ? "U" : "D") : (dx < 0 ? "L" : "R"));
  }, { passive: true });

  // Easiest path on phones: tap the HOG OIL logo (top-left) 5 times fast.
  // Bound to the whole brand for a big tap target; each tap buzzes + pulses the hog so
  // you can see it counting (and confirm this script actually loaded).
  var brand = document.querySelector(".nav__brand");
  var hogIco = document.querySelector(".nav__hog");
  if (brand) {
    var taps = 0, tapTimer = null;
    brand.addEventListener("click", function (e) {
      e.preventDefault();
      taps++;
      if (tapTimer) clearTimeout(tapTimer);
      tapTimer = setTimeout(function () { taps = 0; }, 1500);
      if (navigator.vibrate) { try { navigator.vibrate(15); } catch (er) {} }
      if (hogIco && !prefersReduced) {
        hogIco.classList.remove("bump"); void hogIco.offsetWidth; hogIco.classList.add("bump");
      }
      if (taps >= 5) { taps = 0; fireOverdrive(); }
    });
  }
})();
