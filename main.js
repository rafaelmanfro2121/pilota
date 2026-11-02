/* Pilota — interações e animações */
(() => {
  // Se tiver um número de WhatsApp, o formulário abre a conversa já preenchida. Ex.: '5511900000000'
  const WHATSAPP = '';

  const PRICES = {
    // diária no plano semanal; mensal -10%, anual -20%
    urbana:  { dia: 36,  caucao: 300 },   // Honda Biz 125 ou similar
    scooter: { dia: 56,  caucao: 500 },   // Honda PCX 160 ou similar
    street:  { dia: 74,  caucao: 700 },   // Honda CB Twister 250 ou similar
    premium: { dia: 186, caucao: 2000 },  // Yamaha MT-07 ou similar
  };
  const DESCONTO = { semanal: 1, mensal: 0.9, anual: 0.8 };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const animate = hasGsap && !reduce;

  /* ---------- Simulador ---------- */
  const simDia = $('#sim-dia'), simSemana = $('#sim-semana'), simCaucao = $('#sim-caucao');
  const shown = { dia: 0, semana: 0, caucao: 0 };
  function simular() {
    const moto = $('input[name="moto"]:checked').value;
    const plano = $('input[name="plano"]:checked').value;
    const dia = Math.round(PRICES[moto].dia * DESCONTO[plano]);
    const alvo = { dia, semana: dia * 7, caucao: PRICES[moto].caucao };
    const paint = () => {
      simDia.textContent = Math.round(shown.dia);
      simSemana.textContent = brl(shown.semana);
      simCaucao.textContent = brl(shown.caucao);
    };
    if (animate) gsap.to(shown, { ...alvo, duration: .8, ease: 'expo.out', onUpdate: paint });
    else { Object.assign(shown, alvo); paint(); }
    $('#f-moto').value = moto;
  }
  $$('#simulador input').forEach(i => i.addEventListener('change', simular));
  simular();

  $$('[data-pick]').forEach(a => a.addEventListener('click', () => {
    const r = $(`input[name="moto"][value="${a.dataset.pick}"]`);
    if (r) { r.checked = true; simular(); }
  }));

  /* ---------- Formulário ---------- */
  const form = $('#form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const check = (id, valid) => {
      $(id).closest('.field').classList.toggle('is-bad', !valid);
      if (!valid && ok) $(id).focus();
      ok = ok && valid;
    };
    check('#f-nome', $('#f-nome').value.trim().length >= 2);
    check('#f-zap', $('#f-zap').value.replace(/\D/g, '').length >= 10);
    check('#f-cidade', $('#f-cidade').value.trim().length >= 2);
    if (!ok) return;

    $('#ok-nome').textContent = $('#f-nome').value.trim().split(' ')[0];
    const okBox = $('.form__ok');
    okBox.hidden = false;
    form.querySelector('button[type="submit"]').hidden = true;
    if (animate) gsap.from(okBox, { y: 16, opacity: 0, duration: .8, ease: 'expo.out' });
    if (WHATSAPP) {
      const moto = $('#f-moto').selectedOptions[0].text;
      const msg = `Olá! Sou ${$('#f-nome').value.trim()}, de ${$('#f-cidade').value.trim()}. Quero alugar: ${moto}.`;
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    }
  });
  $$('.field input').forEach(i => i.addEventListener('input', () => i.closest('.field').classList.remove('is-bad')));
  $('#f-zap').addEventListener('input', e => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 11);
    let v = d;
    if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    e.target.value = v;
  });

  /* ---------- Nav e CTA fixo ---------- */
  const nav = $('.nav'), mobileCta = $('.mobile-cta'), hero = $('.hero'), alugar = $('#alugar');
  let lastY = 0;
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 20);
    nav.classList.toggle('is-hidden', y > 600 && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    const r = alugar.getBoundingClientRect();
    mobileCta.classList.toggle('is-on', y > hero.offsetHeight * .8 && !(r.top < innerHeight && r.bottom > 0));
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });

  $('#ano').textContent = new Date().getFullYear();

  if (!animate) {
    $$('[data-reveal]').forEach(el => { el.style.opacity = 1; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Rolagem suave */
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4) });
    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const el = id.length > 1 && $(id);
      if (!el && id !== '#topo') return;
      e.preventDefault();
      lenis.scrollTo(id === '#topo' ? 0 : el, { offset: -10 });
    }));
  }

  /* Abertura */
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .from('.ln > span', { yPercent: 110, duration: 1.4, stagger: .1 })
    .from('.hero__img', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut' }, 0)
    .from('.hero__img img', { scale: 1.3, duration: 2.2 }, 0)
    .from(['.hero__kicker', '.hero__sub', '.hero__ctas', '.hero__facts', '.hero__media figcaption'], { y: 24, opacity: 0, duration: 1.2, stagger: .08 }, .35)
    .from('.nav__inner', { y: -20, opacity: 0, duration: 1 }, .2)
    .from('[data-count]', { textContent: 0, duration: 1.6, snap: { textContent: 1 }, ease: 'power3.out' }, .6);

  /* Foto do topo afunda devagar */
  gsap.to('.hero__img img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* Revelações de texto e blocos */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    onEnter: els => gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: .08, overwrite: true }),
  });

  /* Fotos das motos abrem como cortina */
  $$('.bike__img').forEach(box => {
    gsap.fromTo(box, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: box, start: 'top 88%' } });
    gsap.fromTo(box.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: box, start: 'top 88%' } });
  });

  /* Parallax das fotos de fundo */
  $$('[data-parallax]').forEach(img => {
    gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Linha dos passos se completa com a rolagem */
  gsap.to('.steps__line span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 80%', end: 'bottom 60%', scrub: .5 } });
})();
