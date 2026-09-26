/* Sagar Chinese — shared interactions */
(function(){
  "use strict";

  /* Navbar solid-on-scroll */
  var header = document.querySelector('.site-header');
  if(header){
    var onScroll = function(){ header.classList.toggle('solid', window.scrollY > 30); };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* Mobile menu */
  var burger = document.querySelector('.burger');
  var mobileNav = document.querySelector('.mobile-nav');
  if(burger && mobileNav){
    burger.addEventListener('click', function(){
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* Active nav link by current page */
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === here || (here === '' && href === 'index.html')) a.classList.add('active');
  });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* Subtle hero parallax (desktop only, respects reduced motion) */
  var heroImg = document.querySelector('.hero-media img');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(heroImg && !prefersReduced && window.innerWidth > 900){
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if(y < window.innerHeight){
        heroImg.style.transform = 'translateY(' + (y * 0.15) + 'px) scale(1.06)';
      }
    }, {passive:true});
  }

  /* Order Online demo modal */
  var orderBtns = document.querySelectorAll('[data-order-btn]');
  var modalBg = document.querySelector('.modal-bg');
  if(modalBg){
    orderBtns.forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        modalBg.classList.add('open');
      });
    });
    modalBg.addEventListener('click', function(e){ if(e.target === modalBg) modalBg.classList.remove('open'); });
    var modalClose = modalBg.querySelector('.modal-close');
    if(modalClose) modalClose.addEventListener('click', function(){ modalBg.classList.remove('open'); });
  }

  /* ---------------- MENU PAGE: category pills ---------------- */
  var pills = document.querySelectorAll('.menu-pill');
  if(pills.length){
    var sections = Array.prototype.map.call(pills, function(p){ return document.getElementById(p.dataset.target); });
    pills.forEach(function(p){
      p.addEventListener('click', function(){
        var target = document.getElementById(p.dataset.target);
        if(target){
          var y = target.getBoundingClientRect().top + window.scrollY - 130;
          window.scrollTo({top:y, behavior:'smooth'});
        }
      });
    });
    if('IntersectionObserver' in window){
      var catIO = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            pills.forEach(function(p){ p.classList.toggle('active', p.dataset.target === entry.target.id); });
          }
        });
      }, {threshold:0, rootMargin:'-140px 0px -70% 0px'});
      sections.forEach(function(s){ if(s) catIO.observe(s); });
    }
  }

  /* ---------------- GALLERY: lightbox ---------------- */
  var galItems = document.querySelectorAll('[data-lightbox]');
  var lightbox = document.querySelector('.lightbox');
  if(galItems.length && lightbox){
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('.lb-cap');
    var items = Array.prototype.slice.call(galItems);
    var idx = 0;
    function show(i){
      idx = (i + items.length) % items.length;
      var el = items[idx];
      lbImg.src = el.dataset.full || el.querySelector('img').src;
      lbImg.alt = el.querySelector('img').alt || '';
      lbCap.textContent = el.dataset.caption || '';
    }
    items.forEach(function(el, i){
      el.addEventListener('click', function(e){
        e.preventDefault();
        show(i);
        lightbox.classList.add('open');
      });
    });
    var closeBtn = lightbox.querySelector('.lb-close');
    var prevBtn = lightbox.querySelector('.lb-prev');
    var nextBtn = lightbox.querySelector('.lb-next');
    if(closeBtn) closeBtn.addEventListener('click', function(){ lightbox.classList.remove('open'); });
    if(prevBtn) prevBtn.addEventListener('click', function(){ show(idx - 1); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ show(idx + 1); });
    lightbox.addEventListener('click', function(e){ if(e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', function(e){
      if(!lightbox.classList.contains('open')) return;
      if(e.key === 'Escape') lightbox.classList.remove('open');
      if(e.key === 'ArrowRight') show(idx + 1);
      if(e.key === 'ArrowLeft') show(idx - 1);
    });
  }

})();
