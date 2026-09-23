/* ==========================================================================
   Benjamin De Paolo · script compartido (index.html + otras-cosas.html + 404)
   Todas las funciones son opcionales: si un elemento no existe en la página,
   la función simplemente no se activa. Así las dos páginas se comportan igual.
   ========================================================================== */
(function(){
  'use strict';

  var root = document.documentElement;
  var page = document.body.getAttribute('data-page') || '';
  var EMAIL = 'benjamindepaolo8@gmail.com';
  var LINKEDIN = 'https://www.linkedin.com/in/bdepaolo';
  var TIKTOK = 'https://www.tiktok.com/@benjamin.de.paolo';
  var WHATSAPP = 'https://wa.me/5492625533917';
  var TALK_FROM = 8, TALK_TO = 18;   /* horario de Mendoza en el que "Hablemos" abre WhatsApp: 8:00 a 18:00 */
  var MAP_QUERY = 'General Alvear, Mendoza, Argentina';

  function $(id){ return document.getElementById(id); }
  function prefersReducedMotion(){ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function canHover(){ return window.matchMedia('(hover: hover) and (pointer: fine)').matches; }

  /* ---------- tema ---------- */
  var themeBtn = $('theme-toggle');
  var iconMoon = $('icon-moon');
  var iconSun  = $('icon-sun');

  function isDark(){
    var explicit = root.getAttribute('data-theme');
    if(explicit) return explicit === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncIcons(){
    if(!iconMoon || !iconSun) return;
    var dark = isDark();
    iconMoon.hidden = dark;
    iconSun.hidden = !dark;
  }
  function syncMetaThemeColor(){
    var val = getComputedStyle(root).getPropertyValue('--bg').trim();
    var meta = $('meta-theme-color');
    if(meta && val) meta.setAttribute('content', val);
  }
  function applyTheme(next){
    root.setAttribute('data-theme', next);
    try{ localStorage.setItem('bdp-theme', next); }catch(e){}
    syncIcons();
    syncMetaThemeColor();
  }
  function toggleTheme(x, y){
    var next = isDark() ? 'light' : 'dark';
    root.style.setProperty('--x', (x != null ? x : window.innerWidth/2) + 'px');
    root.style.setProperty('--y', (y != null ? y : 0) + 'px');
    if(document.startViewTransition && !prefersReducedMotion()){
      document.startViewTransition(function(){ applyTheme(next); });
    } else {
      applyTheme(next);
    }
  }
  syncIcons();
  syncMetaThemeColor();
  if(themeBtn) themeBtn.addEventListener('click', function(e){ toggleTheme(e.clientX, e.clientY); });

  /* ---------- header pegajoso + barra de progreso ---------- */
  var headerRow  = $('header-row');
  var progressBar = $('progress-bar');
  var ticking = false;
  function onScroll(){
    if(headerRow) headerRow.classList.toggle('scrolled', window.scrollY > 8);
    if(progressBar){
      var h = document.documentElement;
      var scrollable = h.scrollHeight - h.clientHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressBar.style.width = pct + '%';
    }
    updateWordFocus();
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(onScroll); ticking = true; }
  }, {passive:true});

  /* ---------- foco de palabras al scrollear ---------- */
  /* Perfil: las descripciones (.desc). Sobre mí: los párrafos del texto, salvo los links de "Ver en ..." */
  var words = [];
  function wordSpan(){
    var s = document.createElement('span');
    s.className = 'word';
    return s;
  }
  /* Envuelve cada palabra en un span. Lo que va pegado a una palabra sin espacio (el pin 📍 y la coma que le sigue)
     queda dentro del mismo span, así el pin se mueve con su palabra y no se separa al cortar la línea. */
  function wrapWords(block){
    var frag = document.createDocumentFragment();
    var cur = null;
    function flush(){ if(cur){ frag.appendChild(cur); cur = null; } }
    Array.prototype.slice.call(block.childNodes).forEach(function(node){
      if(node.nodeType === 3){
        node.nodeValue.split(/(\s+)/).forEach(function(tok){
          if(tok === '') return;
          if(tok.trim() === ''){
            flush();
            frag.appendChild(document.createTextNode(tok));
          } else {
            if(!cur) cur = wordSpan();
            cur.appendChild(document.createTextNode(tok));
          }
        });
      } else if(node.nodeType === 1){
        if(!cur) cur = wordSpan();
        cur.appendChild(node);
      }
    });
    flush();
    block.textContent = '';
    block.appendChild(frag);
  }
  if(!prefersReducedMotion() && !document.body.classList.contains('portfolio')){
    document.querySelectorAll('.desc, .prose > p:not(.video-fallback), .prose .split > p').forEach(wrapWords);
    words = Array.prototype.slice.call(document.querySelectorAll('.word'));
  }
  function updateWordFocus(){
    if(!words.length) return;
    var vh = window.innerHeight;
    var center = vh * 0.5;
    var band = vh * 0.2;
    var fade = vh * 0.4;
    words.forEach(function(w){
      var r = w.getBoundingClientRect();
      if(r.bottom < -200 || r.top > vh + 200) return;
      var dist = Math.abs((r.top + r.height/2) - center);
      var t = dist <= band ? 1 : Math.max(0, 1 - (dist-band)/fade);
      w.style.opacity = (0.12 + t*0.88).toFixed(3);
      w.style.filter = t < 1 ? 'blur(' + ((1-t)*3).toFixed(2) + 'px)' : 'none';
    });
  }
  window.addEventListener('resize', updateWordFocus);
  onScroll();

  /* ---------- spotlight del cursor ---------- */
  var spot = $('spotlight');
  if(spot){
    if(canHover() && !prefersReducedMotion()){
      var raf = null;
      window.addEventListener('mousemove', function(e){
        if(raf) return;
        raf = requestAnimationFrame(function(){
          spot.style.setProperty('--mx', e.clientX + 'px');
          spot.style.setProperty('--my', e.clientY + 'px');
          raf = null;
        });
      });
    } else {
      spot.style.display = 'none';
    }
  }

  /* ---------- botones magnéticos ---------- */
  if(canHover() && !prefersReducedMotion()){
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top - r.height/2;
        el.style.transform = 'translate(' + (x*0.25) + 'px,' + (y*0.25) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

  /* ---------- aparición al scrollear ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if(revealables.length){
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, {threshold:.12});
      revealables.forEach(function(el){ io.observe(el); });
    } else {
      revealables.forEach(function(el){ el.classList.add('is-visible'); });
    }
  }

  /* ---------- reloj ---------- */
  var clockEl = $('local-clock');
  if(clockEl){
    var updateClock = function(){
      try{
        var fmt = new Intl.DateTimeFormat('es-AR', {hour:'2-digit', minute:'2-digit', timeZone:'America/Argentina/Mendoza'});
        clockEl.textContent = 'Mendoza, ' + fmt.format(new Date());
      }catch(e){}
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  /* ---------- toast ---------- */
  var toastEl = $('toast');
  var toastTimer = null;
  function toast(msg, long){
    if(!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.toggle('long', !!long);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, long ? 5500 : 1800);
  }

  /* ---------- Hablemos: WhatsApp de 8 a 18 (hora de Mendoza), aviso fuera de horario ---------- */
  function mendozaHour(){
    try{
      return parseInt(new Intl.DateTimeFormat('en-GB', {hour:'2-digit', hourCycle:'h23', timeZone:'America/Argentina/Mendoza'}).format(new Date()), 10);
    }catch(e){
      return new Date().getHours();
    }
  }
  function inTalkHours(){
    var h = mendozaHour();
    return h >= TALK_FROM && h < TALK_TO;
  }
  function talk(){
    if(inTalkHours()){
      window.open(WHATSAPP, '_blank', 'noopener');
    } else {
      toast('Probablemente por el horario me haya desconectado del celular. Mañana te contesto.', true);
    }
  }
  var talkBtn = $('talk-btn');
  if(talkBtn) talkBtn.addEventListener('click', talk);

  /* luz de estado del botón: verde dentro del horario, roja fuera; se revisa cada 30 s, igual que el reloj */
  var statusDot = $('status-dot');
  function updateStatus(){
    if(!statusDot) return;
    var open = inTalkHours();
    statusDot.setAttribute('data-state', open ? 'open' : 'closed');
    if(talkBtn) talkBtn.title = open ? 'Disponible por WhatsApp (de ' + TALK_FROM + ' a ' + TALK_TO + ', hora de Mendoza)' : 'Fuera de horario (de ' + TALK_FROM + ' a ' + TALK_TO + ', hora de Mendoza)';
  }
  if(statusDot){
    updateStatus();
    setInterval(updateStatus, 30000);
  }

  /* ---------- copiar email / vCard ---------- */
  function copyEmail(){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(EMAIL).then(function(){ toast('Email copiado ✓'); }).catch(function(){ toast(EMAIL); });
    } else {
      toast(EMAIL);
    }
  }
  function downloadVCard(){
    var vcf = [
      'BEGIN:VCARD','VERSION:3.0',
      'N:De Paolo;Benjamin;;;','FN:Benjamin De Paolo',
      'TITLE:Estudiante de Medicina · Consultor técnico en IA aplicada a la salud',
      'EMAIL;TYPE=INTERNET:' + EMAIL,
      'URL:' + LINKEDIN,
      'ADR;TYPE=WORK:;;Mendoza;;;Argentina',
      'END:VCARD'
    ].join('\r\n');
    var blob = new Blob([vcf], {type:'text/vcard'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'Benjamin-De-Paolo.vcf';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast('Contacto guardado ✓');
  }
  var copyBtn = $('copy-email-btn');
  if(copyBtn) copyBtn.addEventListener('click', copyEmail);
  var vcardBtn = $('vcard-btn');
  if(vcardBtn) vcardBtn.addEventListener('click', downloadVCard);

  /* ---------- easter egg ---------- */
  var particleColors = ['#64748b','#94a3b8','#475569','#cbd5e1'];
  function surprise(){
    toast('✨ Gracias por explorar tan a fondo');
    if(prefersReducedMotion()) return;
    for(var i=0;i<18;i++){
      (function(i){
        var p = document.createElement('span');
        p.className = 'particle';
        p.style.left = (42 + Math.random()*16) + '%';
        p.style.setProperty('--dx', (Math.random()*160-80) + 'px');
        p.style.setProperty('--dur', (0.8 + Math.random()*0.6) + 's');
        p.style.background = particleColors[i % particleColors.length];
        document.body.appendChild(p);
        p.addEventListener('animationend', function(){ p.remove(); });
      })(i);
    }
  }

  /* ---------- ir a una sección ---------- */
  function scrollToSection(id){
    var el = $(id);
    if(!el) return;
    el.scrollIntoView({block:'start'});
    var target = el.querySelector('h2, h3') || el;
    target.classList.remove('flash');
    void target.offsetWidth;
    target.classList.add('flash');
  }

  /* ---------- paleta de comandos + hoja de atajos ---------- */
  var overlay = $('sheet-overlay');
  var sheet = $('sheet');
  var lastFocused = null;

  function closeSheet(){
    if(!overlay || !sheet) return;
    overlay.hidden = true;
    sheet.innerHTML = '';
    document.body.style.overflow = '';
    if(lastFocused) lastFocused.focus();
  }

  function getCommands(){
    var cmds = [];

    /* secciones declaradas en el HTML con data-section="Etiqueta" */
    document.querySelectorAll('[data-section][id]').forEach(function(el){
      var id = el.id;
      cmds.push({
        label:'Ir a ' + el.getAttribute('data-section'),
        hint:'Sección',
        action:function(){ scrollToSection(id); }
      });
    });

    /* navegación entre páginas */
    if(page === 'otras-cosas'){
      cmds.push({label:'Volver al perfil', hint:'index', action:function(){ location.href = 'index.html'; }});
    } else if(page !== 'index') {
      cmds.push({label:'Sobre mí', hint:'Página', action:function(){ location.href = 'otras-cosas.html'; }});
    }

    cmds.push(
      {label:'Cambiar tema', hint: isDark() ? 'Modo claro' : 'Modo oscuro', action:function(){ toggleTheme(); }},
      {label:'Copiar email', hint:EMAIL, action:copyEmail},
      {label:'Descargar contacto', hint:'.vcf', action:downloadVCard},
      {label:'Abrir LinkedIn', hint:'Nueva pestaña', action:function(){ window.open(LINKEDIN,'_blank','noopener'); }},
      {label:'Abrir TikTok', hint:'Nueva pestaña', action:function(){ window.open(TIKTOK,'_blank','noopener'); }},
      {label:'Ver atajos de teclado', hint:'Ayuda', action:openShortcuts},
      {label:'✨ Sorpresa', hint:'???', action:surprise}
    );
    return cmds;
  }

  function openPalette(){
    if(!overlay || !sheet) return;
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    sheet.innerHTML =
      '<div class="palette-input-row">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.35-4.35"/></svg>' +
        '<input id="palette-input" type="text" placeholder="Buscar una acción o sección…" autocomplete="off">' +
        '<kbd>Esc</kbd>' +
      '</div>' +
      '<ul class="palette-list" id="palette-list"></ul>';

    var input = $('palette-input');
    var list = $('palette-list');
    var active = 0;
    var filtered = [];

    function render(){
      var q = input.value.trim().toLowerCase();
      var all = getCommands();
      filtered = q ? all.filter(function(c){
        return c.label.toLowerCase().indexOf(q) > -1 || c.hint.toLowerCase().indexOf(q) > -1;
      }) : all;
      active = 0;
      if(filtered.length === 0){
        list.innerHTML = '<li class="palette-empty">Sin resultados</li>';
        return;
      }
      list.innerHTML = filtered.map(function(c, i){
        return '<li class="' + (i === active ? 'active' : '') + '" data-i="' + i + '">' +
          '<span>' + c.label + '</span><span class="hint">' + c.hint + '</span></li>';
      }).join('');
    }
    function highlight(){
      Array.prototype.forEach.call(list.children, function(li, i){
        li.classList.toggle('active', i === active);
      });
    }
    function run(i){
      var cmd = filtered[i];
      if(!cmd) return;
      closeSheet();
      cmd.action();
    }

    input.addEventListener('input', render);
    list.addEventListener('mousemove', function(e){
      var li = e.target.closest('li[data-i]');
      if(li){ active = parseInt(li.dataset.i, 10); highlight(); }
    });
    list.addEventListener('click', function(e){
      var li = e.target.closest('li[data-i]');
      if(li) run(parseInt(li.dataset.i, 10));
    });
    sheet.addEventListener('keydown', function(e){
      if(e.key === 'ArrowDown'){ e.preventDefault(); active = Math.min(active+1, filtered.length-1); highlight(); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); active = Math.max(active-1, 0); highlight(); }
      else if(e.key === 'Enter'){ e.preventDefault(); run(active); }
    });

    render();
    input.focus();
  }

  function sheetHeader(title){
    return '<div class="sheet-header"><strong>' + title + '</strong>' +
        '<button class="icon-btn" id="sheet-close" aria-label="Cerrar">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button></div>';
  }

  function openMap(){
    if(!overlay || !sheet) return;
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    var q = encodeURIComponent(MAP_QUERY);
    sheet.innerHTML =
      sheetHeader('General Alvear, Mendoza') +
      '<div class="map-frame">' +
        '<iframe src="https://maps.google.com/maps?q=' + q + '&z=11&output=embed" title="Mapa de General Alvear, Mendoza" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
      '</div>' +
      '<a class="map-link" href="https://www.google.com/maps/search/?api=1&query=' + q + '" target="_blank" rel="noopener">Abrir en Google Maps ↗</a>';
    $('sheet-close').addEventListener('click', closeSheet);
    $('sheet-close').focus();
  }

  function openShortcuts(){
    if(!overlay || !sheet) return;
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    sheet.innerHTML =
      sheetHeader('Atajos de teclado') +
      '<ul class="shortcuts-list">' +
        '<li><span>Abrir paleta de comandos</span><span><kbd>Ctrl</kbd><kbd>K</kbd></span></li>' +
        '<li><span>Navegar resultados</span><span><kbd>↑</kbd><kbd>↓</kbd></span></li>' +
        '<li><span>Ejecutar</span><span><kbd>Enter</kbd></span></li>' +
        '<li><span>Cerrar</span><span><kbd>Esc</kbd></span></li>' +
      '</ul>';
    $('sheet-close').addEventListener('click', closeSheet);
  }

  var paletteTrigger = $('palette-trigger');
  if(paletteTrigger) paletteTrigger.addEventListener('click', openPalette);
  var shortcutsBtn = $('shortcuts-btn');
  if(shortcutsBtn) shortcutsBtn.addEventListener('click', openShortcuts);
  var mapBtn = $('map-btn');
  if(mapBtn) mapBtn.addEventListener('click', openMap);
  if(overlay) overlay.addEventListener('click', function(e){ if(e.target === overlay) closeSheet(); });

  window.addEventListener('keydown', function(e){
    if(!overlay) return;
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      if(overlay.hidden) openPalette(); else closeSheet();
    } else if(e.key === 'Escape' && !overlay.hidden){
      closeSheet();
    }
  });
})();
