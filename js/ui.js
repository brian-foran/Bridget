// ui.js — graceful behavior & micro-interactions for Time Worked Calculator
(function(){
  function $(s){return document.querySelector(s)}

  const minutesEl = $('#minutes');
  const hoursEl = $('#hours');
  const minsEl = $('#mins');
  const calcBtn = $('#calculate');
  const clearBtn = $('#clear');

  // lightweight animated counter for the "hours" value
  function animateValue(el, start, end, duration){
    const range = end - start;
    if(range === 0){ el.textContent = end; return; }
    let startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      const progress = Math.min((ts - startTime)/duration, 1);
      const value = Math.round(start + range * easeOutCubic(progress));
      el.textContent = value + (el.id === 'hours' ? ' hours' : '');
      if(progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

  function computeAndShow(){
    const raw = Math.max(0, Number(minutesEl.value) || 0);
    const hours = Math.floor(raw/60);
    const remainder = raw - hours*60;

    // animate hours smoothly
    const currentHours = Number((hoursEl.textContent || '0').replace(/[^0-9]/g,'')) || 0;
    animateValue(hoursEl, currentHours, hours, 700);

    // immediate update for minutes with small fade
    minsEl.style.opacity = 0.35;
    setTimeout(()=>{
      minsEl.textContent = remainder + ' minutes';
      minsEl.style.opacity = 1;
    }, 80);

    // tiny visual feedback on the calculate button
    calcBtn.classList.add('active');
    setTimeout(()=>calcBtn.classList.remove('active'), 260);
  }

  // keyboard handling (Enter triggers calculate)
  minutesEl.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') computeAndShow();
  });

  calcBtn.addEventListener('click', computeAndShow);

  clearBtn.addEventListener('click', ()=>{
    minutesEl.value = '';
    hoursEl.textContent = '—';
    minsEl.textContent = '— minutes';
    minutesEl.focus();
  });

  // small enhancement: keep last value in session storage
  minutesEl.addEventListener('input', ()=>{
    sessionStorage.setItem('bridget_minutes', minutesEl.value);
  });

  // restore
  const saved = sessionStorage.getItem('bridget_minutes');
  if(saved){ minutesEl.value = saved; }

  // visual affordance for calculate button
  calcBtn.style.transition = 'transform .12s ease, box-shadow .12s ease';
  calcBtn.addEventListener('mousedown', ()=> calcBtn.style.transform = 'translateY(1px)');
  calcBtn.addEventListener('mouseup', ()=> calcBtn.style.transform = 'translateY(0)');

})();
