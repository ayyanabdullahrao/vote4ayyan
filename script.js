(() => {
  const header = document.getElementById('siteHeader');
  const progress = document.querySelector('.scroll-progress span');
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    menuBtn.setAttribute('aria-label','Open navigation');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    revealItems.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 35, 220)}ms`;
      observer.observe(el);
    });
  } else {
    revealItems.forEach(el => el.classList.add('visible'));
  }

  // Voting countdown — based on the election timetable in the nomination pack.
  // The pack's timetable is labelled 2025, but the cover identifies Election 26/27
  // and 5 October 2026 is the corresponding Monday, so the countdown uses 5 Oct 2026, 9:00am.
  const votingTarget = new Date('2026-10-05T09:00:00+01:00').getTime();
  const countdown = () => {
    const remaining = Math.max(0, votingTarget - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  };
  countdown();
  setInterval(countdown, 1000);

  const detailPanel = document.getElementById('detailPanel');
  document.querySelectorAll('.text-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const same = detailPanel.textContent === btn.dataset.detail;
      document.querySelectorAll('.text-btn span').forEach(s => s.textContent = '+');
      if (same) {
        detailPanel.classList.remove('show');
        detailPanel.textContent = '';
        return;
      }
      detailPanel.textContent = btn.dataset.detail;
      detailPanel.classList.add('show');
      btn.querySelector('span').textContent = '−';

      // Bring the newly opened explanation smoothly into view.
      requestAnimationFrame(() => {
        detailPanel.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'center'
        });
      });
    });
  });

  const steps = [
    ['Start with your voice.', 'Students should have a clear route for sharing ideas and concerns.'],
    ['Course-level representation.', 'Course representatives can help collect and communicate issues affecting students on a course.'],
    ['A stronger local voice.', 'Centre-level representation can help bring local priorities into the wider student structure.'],
    ['Connect it to the Union.', 'The wider Students’ Union can bring together student voices and work with the college on relevant issues.']
  ];
  const pathDetail = document.getElementById('pathDetail');
  document.querySelectorAll('.path-step').forEach((button, index) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.path-step').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      pathDetail.innerHTML = `<strong>${steps[index][0]}</strong><span>${steps[index][1]}</span>`;
    });
  });
})();
