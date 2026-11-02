/* Pilota — interações e animações */
(() => {
  // Se tiver um número de WhatsApp, o formulário abre a conversa já preenchida. Ex.: '5511900000000'
  const WHATSAPP = '';

  const PRICES = {
    // diária no plano semanal; mensal -10%, anual -20%
    urbana:   { dia: 36,  caucao: 300 },
    trabalho: { dia: 49,  caucao: 400 },
    aventura: { dia: 86,  caucao: 800 },
    estrada:  { dia: 161, caucao: 1500 },
  };
  const DESCONTO = { semanal: 1, mensal: 0.9, anual: 0.8 };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  /* ---------- Moto em SVG ---------- */
  let uid = 0;
  function wheel(cx, cy, c) {
    const spokes = Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3;
      return `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * 31).toFixed(1)}" y2="${(cy + Math.sin(a) * 31).toFixed(1)}"/>`;
    }).join('');
    return `<g>
      <circle cx="${cx}" cy="${cy}" r="45" fill="none" stroke="#101013" stroke-width="15"/>
      <circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="#2a2a30" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy}" r="35" fill="none" stroke="${c}" stroke-width="3"/>
      <g class="spokes" stroke="#cfccc4" stroke-width="3.2" stroke-linecap="round">
        <circle cx="${cx}" cy="${cy}" r="35" fill="none" stroke="none"/>${spokes}
      </g>
      <circle cx="${cx}" cy="${cy}" r="8" fill="#e2dfd7"/>
      <circle cx="${cx}" cy="${cy}" r="3" fill="#101013"/>
    </g>`;
  }
  function motoSVG(c, small) {
    const id = 'beam' + uid++;
    return `<svg class="moto${small ? ' moto--still' : ''}" viewBox="0 0 400 240" aria-hidden="true" focusable="false">
      <defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#fff4cf" stop-opacity=".9"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></linearGradient></defs>
      <ellipse cx="202" cy="232" rx="170" ry="7" fill="#000" opacity=".45"/>
      ${small ? '' : `<path class="beam" d="M312 82 L420 52 L420 122 Z" fill="url(#${id})"/>`}
      ${wheel(92, 180, c)}
      ${wheel(312, 180, c)}
      <g class="body-shake">
        <path d="M196 176 Q150 198 104 184 L68 162" stroke="#77757f" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M58 155 L88 172" stroke="#a3a1aa" stroke-width="13" stroke-linecap="round"/>
        <path d="M92 180 L188 166" stroke="#2c2c33" stroke-width="12" stroke-linecap="round"/>
        <path d="M52 104 L120 95 L114 112 L60 117 Z" fill="${c}"/>
        <rect x="45" y="104" width="13" height="7" rx="3" fill="#ff2b4a"/>
        <path d="M264 96 L236 164 L186 168 L150 118" stroke="#3a3a42" stroke-width="9" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
        <rect x="168" y="124" width="70" height="52" rx="10" fill="#26262c"/>
        <path d="M178 136h50M178 146h50M178 156h36" stroke="#3d3d46" stroke-width="3" stroke-linecap="round"/>
        <circle cx="222" cy="164" r="10" fill="#34343c" stroke="${c}" stroke-width="2.5"/>
        <path d="M112 112 L180 105 L198 126 L146 140 Z" fill="${c}" opacity=".7"/>
        <path d="M104 99 Q140 85 184 91 L182 106 Q140 103 112 113 Z" fill="#1c1c21"/>
        <path d="M172 94 Q182 65 226 63 L266 69 Q283 86 264 112 L198 120 Q182 112 172 94 Z" fill="${c}"/>
        <path d="M192 80 Q208 71 238 71" stroke="#fff" stroke-opacity=".38" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M278 72 L296 140" stroke="#55545c" stroke-width="11" stroke-linecap="round"/>
        <path d="M285 70 L312 180" stroke="#bdbbc4" stroke-width="7" stroke-linecap="round"/>
        <path d="M280 146 Q312 120 346 146" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M256 58 L294 64" stroke="#1f1f24" stroke-width="7" stroke-linecap="round"/>
        <path d="M274 60 L268 42" stroke="#1f1f24" stroke-width="3"/>
        <ellipse cx="266" cy="38" rx="8" ry="5" fill="#2a2a30"/>
        <path d="M287 72 Q312 69 317 92 L296 99 Q285 88 287 72 Z" fill="${c}"/>
        <circle cx="306" cy="84" r="7" fill="#fff4cf"/>
      </g>
    </svg>`;
  }
  $$('[data-moto]').forEach(el => { el.innerHTML = motoSVG(el.dataset.moto, el.hasAttribute('data-small')); });

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
    if (hasGsap && !reduce) {
      gsap.to(shown, { ...alvo, duration: .6, ease: 'power3.out', onUpdate: paint });
      gsap.fromTo(simDia, { y: -10, scale: 1.12 }, { y: 0, scale: 1, duration: .5, ease: 'back.out(3)' });
    } else { Object.assign(shown, alvo); paint(); }
    $('#f-moto').value = moto;
  }
  $$('#simulador input').forEach(i => i.addEventListener('change', simular));
  simular();

  $$('[data-pick]').forEach(btn => btn.addEventListener('click', () => {
    const r = $(`input[name="moto"][value="${btn.dataset.pick}"]`);
    if (r) { r.checked = true; simular(); }
  }));

  /* ---------- Formulário ---------- */
  const form = $('#form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    const check = (id, valid) => {
      const f = $(id).closest('.field');
      f.classList.toggle('is-bad', !valid);
      if (!valid && ok) $(id).focus();
      ok = ok && valid;
    };
    check('#f-nome', $('#f-nome').value.trim().length >= 2);
    check('#f-zap', $('#f-zap').value.replace(/\D/g, '').length >= 10);
    check('#f-cidade', $('#f-cidade').value.trim().length >= 2);
    if (!ok) {
      if (hasGsap && !reduce) gsap.fromTo(form, { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1, .3)' });
      return;
    }
    const nome = $('#f-nome').value.trim().split(' ')[0];
    $('#ok-nome').textContent = nome;
    const okBox = $('.form__ok');
    okBox.hidden = false;
    form.querySelector('button[type="submit"]').hidden = true;
    if (hasGsap && !reduce) gsap.from(okBox, { y: 20, opacity: 0, duration: .6, ease: 'back.out(2)' });
    if (WHATSAPP) {
      const moto = $('#f-moto').selectedOptions[0].text;
      const msg = `Oi! Sou ${$('#f-nome').value.trim()}, de ${$('#f-cidade').value.trim()}. Quero alugar uma moto: ${moto}.`;
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
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 30);
    nav.classList.toggle('is-hidden', y > 500 && y > lastY);
    const pastHero = y > hero.offsetHeight * .7;
    const r = alugar.getBoundingClientRect();
    const inForm = r.top < innerHeight && r.bottom > 0;
    mobileCta.classList.toggle('is-on', pastHero && !inForm);
    lastY = y;
  }, { passive: true });

  $('#ano').textContent = new Date().getFullYear();

  /* ---------- Luz que segue o mouse nos benefícios ---------- */
  $$('.perk').forEach(p => p.addEventListener('pointermove', e => {
    const r = p.getBoundingClientRect();
    p.style.setProperty('--mx', `${e.clientX - r.left}px`);
    p.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));

  /* ---------- Sem GSAP ou com movimento reduzido: mostra tudo ---------- */
  const done = () => document.documentElement.classList.add('loaded');
  if (!hasGsap || reduce) {
    $$('[data-reveal]').forEach(el => { el.style.opacity = 1; });
    done();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Botões magnéticos */
  if (finePointer) {
    $$('.magnetic').forEach(btn => {
      const xTo = gsap.quickTo(btn, 'x', { duration: .5, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(btn, 'y', { duration: .5, ease: 'elastic.out(1, .4)' });
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .25);
        yTo((e.clientY - r.top - r.height / 2) * .35);
      });
      btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });

    /* Cards inclinam com o mouse */
    $$('[data-tilt]').forEach(card => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3.out' });
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 14);
        rx(-((e.clientY - r.top) / r.height - .5) * 14);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* Abertura */
  function intro() {
    done();
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__title .w', { yPercent: 120, rotate: 6, duration: 1.1, stagger: .06 })
      .from('.hero__eyebrow', { y: 20, opacity: 0, duration: .6 }, 0)
      .from('.nav', { y: -40, opacity: 0, duration: .8 }, 0)
      .from('.hero__moto', { xPercent: -140, duration: 1.4, ease: 'expo.out' }, .1)
      .from('.hero__moto .moto', { rotate: -6, transformOrigin: '20% 90%', duration: 1, ease: 'elastic.out(1, .4)' }, .9)
      .from('.hero__word', { xPercent: 20, opacity: 0, duration: 1.6 }, .1)
      .from('.road', { scaleX: 0, transformOrigin: 'left', duration: 1.2 }, 0)
      .from(['.hero__sub', '.hero__ctas', '.hero__chips'], { y: 30, opacity: 0, duration: .8, stagger: .1 }, .5)
      .from('.price-tag', { scale: 0, rotate: -120, duration: 1, ease: 'back.out(1.8)' }, 1)
      .from('.price-tag [data-count]', { textContent: 0, duration: 1.2, snap: { textContent: 1 }, ease: 'power2.out' }, 1);
    gsap.to('.price-tag', { y: -10, rotate: 6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
  }
  let started = false;
  const start = () => { if (!started) { started = true; gsap.to('.loader', { yPercent: -100, duration: .7, ease: 'expo.inOut', onComplete: intro }); } };
  addEventListener('load', () => setTimeout(start, 350));
  setTimeout(start, 2500);

  /* Moto vai embora quando rola a página */
  const heroScroll = { trigger: '.hero__stage', start: 'center center', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
  gsap.to('.hero__moto', { x: () => innerWidth * .6, ease: 'none', scrollTrigger: heroScroll });
  gsap.to('.hero__word', { x: () => -innerWidth * .25, ease: 'none', scrollTrigger: { ...heroScroll } });
  gsap.to('.marquee__track', { skewX: -8, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* Revelações */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: els => gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: .1, overwrite: true }),
  });

  /* Cards das motos */
  gsap.from('.bike', {
    y: 120, opacity: 0, rotationX: -25, duration: 1.1, ease: 'power3.out', stagger: .12,
    scrollTrigger: { trigger: '.bikes__grid', start: 'top 85%' },
  });
  $$('.bike').forEach(card => {
    gsap.from(card.querySelector('.bike__art'), { xPercent: -60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 80%' } });
    gsap.from(card.querySelectorAll('.meter i'), { scaleX: 0, duration: 1.2, ease: 'power3.out', stagger: .15, scrollTrigger: { trigger: card, start: 'top 75%' } });
  });

  /* Como funciona: a moto percorre a estrada */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const steps = $$('.step');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.how__pin', start: 'top top', end: '+=1600', scrub: .6, pin: true,
        onUpdate: self => steps.forEach((s, i) => s.classList.toggle('is-active', self.progress >= i / 3 + .05)),
      },
    });
    tl.to('.how__road-fill', { scaleX: 1, ease: 'none' }, 0)
      .fromTo('.how__rider', { left: '0%' }, { left: '100%', ease: 'none' }, 0);
    steps.forEach((s, i) => tl.from(s, { y: 60, opacity: .25, duration: .2, ease: 'power2.out' }, i * .3));
  });
  mm.add('(max-width: 899px)', () => {
    gsap.utils.toArray('.step').forEach(s => gsap.from(s, { y: 60, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 85%', onEnter: () => s.classList.add('is-active') } }));
  });

  /* Benefícios, público e requisitos */
  gsap.from('.perk--big', { scale: .9, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.perks__grid', start: 'top 85%' } });
  gsap.from('.req__list li', { x: 80, duration: 1, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.req__list', start: 'top 85%' } });

  /* CTA final: moto atravessa o fundo */
  gsap.fromTo('.cta__moto', { xPercent: 40 }, { xPercent: -60, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
})();
