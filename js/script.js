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
})();
