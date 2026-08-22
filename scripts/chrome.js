// Shared nav + footer + dark-mode for Mike the Rebel site
(function() {
  const navLinks = [
    { href: 'work.html', label: 'Work', match: /^(work\.html|case-.*\.html)$/ },
    { href: 'index.html#about', label: 'About', match: /__never__/ },
  ];

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function renderNav(onDark) {
    const page = currentPage();
    const items = navLinks.map(l => {
      const active = l.match.test(page) ? ' active' : '';
      return `<li><a href="${l.href}" class="${active}">${l.label}</a></li>`;
    }).join('');
    return `
      <nav class="site-nav${onDark ? ' on-dark' : ''}">
        <a class="nav-logo" href="index.html"><span>Mike</span><span>the</span><span class="accent">Rebel</span></a>
        <ul class="nav-links">
          ${items}
          <li><a href="mailto:hello@miketherebel.com" class="nav-cta">Get in Touch</a></li>
        </ul>
        <button class="theme-toggle" aria-label="Toggle theme" type="button"><span class="tt-sun">☀</span><span class="tt-moon">☾</span></button>
        <button class="nav-burger" aria-label="Toggle menu" type="button"><span></span><span></span><span></span></button>
      </nav>
    `;
  }

  function renderFooter() {
    return `
      <footer class="site-footer">
        <div class="footer-top">
          <div>
            <div class="footer-logo">Mike the <span class="accent">Rebel</span></div>
            <div class="footer-tagline">Good design starts with understanding the business.</div>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h4>Navigate</h4>
              <a href="index.html">Home</a>
              <a href="work.html">Work</a>
            </div>
            <div class="footer-col">
              <h4>Connect</h4>
              <a href="mailto:hello@miketherebel.com">hello@miketherebel.com</a>
              <a href="https://www.instagram.com/mike.therebel/">Instagram</a>
              <a href="https://www.linkedin.com/in/miketherebel/">LinkedIn</a>
            </div>
            <div class="footer-col">
              <h4>Legal</h4>
              <a href="privacy-policy.html">Privacy Policy</a>
              <a href="terms-of-service.html">Terms of Service</a>
              <a href="colophon.html">Colophon</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-ack">I respectfully recognise all Aboriginal and Torres Strait Islander Traditional Custodians of Country and their continuing connection to land, sea, culture and community. I pay my respects to Elders past, present and emerging.</p>
          <p class="footer-copy">© Mike the Rebel 2026 /*· ABN 25 168 857 084*/</p>
        </div>
      </footer>
    `;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mtr-theme', theme);
  }

  window.MTR = {
    injectChrome(opts = {}) {
      const navSlot = document.getElementById('nav-slot');
      const footerSlot = document.getElementById('footer-slot');
      if (navSlot) navSlot.outerHTML = renderNav(opts.onDark);
      if (footerSlot) footerSlot.outerHTML = renderFooter();

      // Theme
      const saved = localStorage.getItem('mtr-theme') || 'light';
      applyTheme(saved);
      const btn = document.querySelector('.theme-toggle');
      if (btn) {
        btn.addEventListener('click', () => {
          const cur = document.documentElement.getAttribute('data-theme') || 'light';
          const next = cur === 'light' ? 'dark' : 'light';
          applyTheme(next);
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'theme_toggle', theme_mode: next });
        });
      }

      // CTA click tracking (any mailto link, tagged with its nav/footer/hero location)
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
        a.addEventListener('click', () => {
          let loc = 'body';
          if (a.closest('.site-nav')) loc = 'nav';
          else if (a.closest('.site-footer')) loc = 'footer';
          else if (a.closest('.cs-hero, .auto-holding, header')) loc = 'hero';
          else if (a.closest('.auto-eoi')) loc = 'eoi_form';
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'cta_click', cta_location: loc });
        });
      });

      // Outbound link tracking (social etc.)
      document.querySelectorAll('a[href^="http"]').forEach(a => {
        if (a.hostname === location.hostname) return;
        a.addEventListener('click', () => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'outbound_click', link_url: a.href });
        });
      });

      // Case study view (fires once per case-study page load)
      const csMatch = currentPage().match(/^case-(.+)\.html$/);
      if (csMatch) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'case_study_view', case_study_name: csMatch[1] });
      }

      // Mobile menu
      const nav = document.querySelector('.site-nav');
      const burger = document.querySelector('.nav-burger');
      if (nav && burger) {
        burger.addEventListener('click', () => nav.classList.toggle('menu-open'));
        nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('menu-open')));
        window.addEventListener('resize', () => { if (window.innerWidth > 860) nav.classList.remove('menu-open'); });
      }

      // Reveal observer
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.08 });
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }
  };
})();
