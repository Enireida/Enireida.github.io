/* Portfolio behaviour: mobile menu, nav state, scroll reveal, copy email. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var nav = document.querySelector('.site-nav');
  var menu = document.getElementById('menu');
  var menuBtn = document.getElementById('menuBtn');

  /* Mobile menu ----------------------------------------------------------- */

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
  }

  menuBtn.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  /* Shadow under the nav once the page is scrolled ------------------------ */

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Scroll reveal + active nav link --------------------------------------- */

  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    var navLinks = {};
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
      navLinks[a.getAttribute('href').slice(1)] = a;
    });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(navLinks).forEach(function (id) {
          navLinks[id].classList.toggle('is-active', id === entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('section[id]').forEach(function (s) {
      sectionObserver.observe(s);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Copy email ------------------------------------------------------------ */

  var copyBtn = document.getElementById('copyBtn');
  var status = document.getElementById('copyStatus');
  var address = document.getElementById('emailAddress');

  copyBtn.addEventListener('click', function () {
    var text = address.textContent.trim();

    function selectInstead() {
      var range = document.createRange();
      range.selectNodeContents(address);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Selected. Press Ctrl/Cmd + C.';
    }

    try {
      navigator.clipboard.writeText(text).then(function () {
        status.textContent = 'Copied!';
      }, selectInstead);
    } catch (err) {
      selectInstead();
    }
  });
})();
