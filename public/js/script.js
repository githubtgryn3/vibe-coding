document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.classList.toggle("active", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  var counters = document.querySelectorAll("[data-count]");
  counters.forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    var revealed = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !revealed) {
            revealed = true;
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
  });

  var revealables = document.querySelectorAll("[data-reveal]");
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealables.forEach(function (el) {
    revealObserver.observe(el);
  });

  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = document.getElementById("nama").value.trim();
    var email = document.getElementById("email").value.trim();
    var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nama) {
      status.textContent = "Mohon isi nama lengkap Anda.";
      status.className = "form-status error";
      return;
    }
    if (!emailValid) {
      status.textContent = "Mohon isi email yang valid.";
      status.className = "form-status error";
      return;
    }

    status.textContent = "Terima kasih! Data Anda telah kami terima.";
    status.className = "form-status success";
    form.reset();
  });
});