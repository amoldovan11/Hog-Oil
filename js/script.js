/* =========================================================
   NOON — site interactions (kept intentionally light)
   ========================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* mobile menu */
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

  /* nav hairline on scroll */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* gentle scroll reveal */
  var targets = [];
  [".section-head", ".product__copy", ".product__media", ".card", ".inside__copy",
   ".inside__list", ".sku", ".steps li", ".review", ".qa", ".plan", ".signup"]
    .forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (n) { targets.push(n); });
    });

  if ("IntersectionObserver" in window && !prefersReduced) {
    targets.forEach(function (n, i) {
      n.classList.add("reveal");
      n.style.transitionDelay = (i % 4) * 60 + "ms";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (n) { io.observe(n); });
  }

  /* add-to-bag demo */
  document.querySelectorAll("[data-add]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (btn.dataset.busy) return;
      btn.dataset.busy = "1";
      var original = btn.textContent;
      btn.textContent = "Added ✓";
      setTimeout(function () { btn.textContent = original; delete btn.dataset.busy; }, 1500);
    });
  });

  /* signup */
  var form = document.getElementById("signup");
  if (form) {
    var msg = document.getElementById("signupMsg");
    var input = document.getElementById("email");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = (input.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg.textContent = "Enter a valid email and we'll send your code.";
        msg.className = "signup__msg err";
        input.focus();
        return;
      }
      msg.textContent = "Done — check your inbox for $5 off.";
      msg.className = "signup__msg ok";
      form.reset();
    });
  }
})();
