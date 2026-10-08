/* ================================================================
   Python Cheatsheets — общие скрипты
   Включая единый header со всеми темами.
   ================================================================ */
(function(){
  'use strict';

  /* ==================== 0. ЕДИНЫЙ HEADER ==================== */
  var TOPICS = [
    { color:'a1', title:'Основы Python', items: [
      { n:'1',  file:'1. Основы языка Python.html',             title:'Основы языка' },
      { n:'2',  file:'2. Python_ управляющие конструкции.html',   title:'Управляющие конструкции' },
      { n:'3',  file:'3. Функции в Python.html',                 title:'Функции' },
      { n:'4',  file:'4. Python_ модули.html',                   title:'Модули и пакеты' },
      { n:'9',  file:'9. Стуктуры данных_GEMINI.html',           title:'Структуры данных' }
    ]},
    { color:'a3', title:'ООП и графика', items: [
      { n:'7',  file:'7. Python ООП.html',                       title:'ООП в Python' },
      { n:'5',  file:'5. Python turtle.html',                    title:'Модуль turtle' },
      { n:'8',  file:'8. Pygame.html',                           title:'Pygame' },
      { n:'10', file:'10. PyQt5_GPT.html',                       title:'PyQt5' }
    ]},
    { color:'a5', title:'Мобильная разработка', items: [
      { n:'13', file:'13. Kivy_GPT.html',                        title:'Kivy' }
    ]},
    { color:'a2', title:'Данные, файлы, изображения', items: [
      { n:'11', file:'11. Текстовые файлы и json_GPT.html',      title:'Файлы и JSON' },
      { n:'12', file:'12. PIL_GPT.html',                         title:'Pillow (PIL)' },
      { n:'14', file:'14. Анализ данных_Qwen.html',              title:'Pandas' }
    ]},
    { color:'a4', title:'Инструменты и веб', items: [
      { n:'6',  file:'6. GIT_GPT.html',                          title:'Git, GitHub, GitFlic' },
      { n:'16', file:'16. Веб-разработка.html',                  title:'Веб-разработка' }
    ]}
  ];

  var HOME = 'index.html';
  var PLAYGROUND = 'python-compiler.html';

  function currentFile(){
    var p = location.pathname.split('/').pop();
    try { p = decodeURIComponent(p); } catch(e){}
    return p || HOME;
  }

  function buildHeader(){
    var cur = currentFile();

    var header = document.createElement('header');
    header.className = 'site-header';
    header.setAttribute('role', 'banner');

    // --- верхняя полоса ---
    var inner = document.createElement('div');
    inner.className = 'sh-inner';

    var logo = document.createElement('a');
    logo.className = 'sh-logo';
    logo.href = HOME;
    logo.innerHTML = '<span class="mark">Py</span><span class="lbl">Cheatsheets</span>';

    var nav = document.createElement('nav');
    nav.className = 'sh-nav';

    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'sh-btn';
    allBtn.setAttribute('aria-expanded', 'false');
    allBtn.innerHTML = 'Все темы <span class="chev">▾</span>';

    var playBtn = document.createElement('a');
    playBtn.className = 'sh-btn play';
    playBtn.href = PLAYGROUND;
    playBtn.innerHTML = '▶ Playground';
    if (cur === PLAYGROUND) playBtn.classList.add('is-active');

    var burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'sh-burger';
    burger.setAttribute('aria-label', 'Меню');
    burger.textContent = '☰';

    nav.appendChild(allBtn);
    nav.appendChild(playBtn);
    nav.appendChild(burger);

    inner.appendChild(logo);
    inner.appendChild(nav);

    // --- выпадающее меню ---
    var menu = document.createElement('div');
    menu.className = 'sh-menu';
    menu.setAttribute('role', 'menu');

    var grid = document.createElement('div');
    grid.className = 'sh-menu-grid';

    TOPICS.forEach(function(group){
      var g = document.createElement('div');
      g.className = 'sh-group g-' + group.color;
      var h = document.createElement('h4');
      h.textContent = group.title;
      g.appendChild(h);

      var list = document.createElement('div');
      list.className = 'sh-list';
      group.items.forEach(function(item){
        var a = document.createElement('a');
        a.href = item.file;
        if (item.file === cur) a.classList.add('is-active');
        a.innerHTML =
          '<span class="n">' + item.n + '</span>' +
          '<span class="t">' + item.title + '</span>';
        list.appendChild(a);
      });
      g.appendChild(list);
      grid.appendChild(g);
    });

    menu.appendChild(grid);
    header.appendChild(inner);
    header.appendChild(menu);

    document.body.insertBefore(header, document.body.firstChild);
    document.body.classList.add('has-site-header');

    // --- логика открытия/закрытия ---
    var isMobile = window.matchMedia('(max-width:720px)').matches;

    function openMenu(){
      menu.classList.add('open');
      allBtn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu(){
      menu.classList.remove('open');
      allBtn.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu(){
      if (menu.classList.contains('open')) closeMenu();
      else openMenu();
    }

    allBtn.addEventListener('click', function(e){
      e.stopPropagation();
      toggleMenu();
    });
    burger.addEventListener('click', function(e){
      e.stopPropagation();
      toggleMenu();
    });

    // клик вне — закрываем
    document.addEventListener('click', function(e){
      if (!header.contains(e.target)) closeMenu();
    });

    // Esc — закрываем
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') closeMenu();
    });

    // клик по ссылке внутри меню — закрываем
    menu.addEventListener('click', function(e){
      if (e.target.closest('a')) closeMenu();
    });

    // при изменении размера — переключаем вид
    window.addEventListener('resize', function(){
      isMobile = window.matchMedia('(max-width:720px)').matches;
    });
  }

  /* ==================== 1. ПОДСВЕТКА СИНТАКСИСА ==================== */
  var LANGS = {
    py: [
      /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\n]*"|'[^'\n]*')|(#.*$)|\b(import|from|as|def|return|class|with|try|except|finally|if|elif|else|for|while|in|and|or|not|is|lambda|yield|global|nonlocal|pass|break|continue|raise|async|await|del|assert|True|False|None|self|cls|super|match|case)\b|\b(print|len|range|input|str|int|float|bool|list|dict|set|tuple|sum|min|max|sorted|reversed|enumerate|zip|map|filter|type|isinstance|abs|round|open|iter|next|dir|vars|hasattr|getattr|setattr)\b|(@[\w.]+)|\b(\d+(?:\.\d+)?)\b/gm,
      ['s','c','k','b','d','nu']
    ],
    sql: [
      /('[^'\n]*')|(--.*$)|\b(CREATE|TABLE|IF|NOT|EXISTS|PRIMARY|KEY|AUTOINCREMENT|NULL|UNIQUE|DEFAULT|FOREIGN|REFERENCES|INSERT|INTO|VALUES|SELECT|FROM|WHERE|ORDER|BY|DESC|ASC|LIMIT|UPDATE|SET|DELETE|DROP|JOIN|ON|GROUP|AND|OR|LIKE|COUNT|AVG|SUM|INTEGER|TEXT|REAL|CHECK|LEFT|RIGHT|INNER|IS|AS|CASCADE|CURRENT_TIMESTAMP|PRAGMA)\b|\b(\d+)\b/gim,
      ['s','c','k','nu']
    ],
    html: [
      /(<!--[\s\S]*?-->)|("[^"\n]*")|(<\/?[\w!-]+|\/?>)|(\{\{[^}]*\}\}|\{%[^%]*%\})/g,
      ['c','s','k','d']
    ],
    css: [
      /(\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*')|([\w-]+)(?=\s*:\s)|(#[0-9a-fA-F]{3,6}\b|\b\d+(?:px|rem|em|%|fr|s|ms)?)/g,
      ['c','s','k','nu']
    ],
    sh: [
      /("[^"\n]*"|'[^'\n]*')|(#.*$)|\b(cd|ls|mkdir|rm|cp|mv|git|pip|python|npm|sudo|apt|brew|echo|export|source|cat|grep|find)\b|(\$[\w{}]+)/gm,
      ['s','c','k','nu']
    ],
    kv: [
      /("[^"\n]*"|'[^'\n]*')|(#.*$)|\b(True|False|None|if|else|for|in|and|or|not|is|root|self|app)\b|\b(\d+(?:\.\d+)?)\b/gm,
      ['s','c','k','nu']
    ],
    json: [
      /("[^"\n]*")(?=\s*:)|("[^"\n]*")|\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?)\b/gm,
      ['k','s','k','nu']
    ]
  };

  function escapeHtml(s){
    return s.replace(/[&<>]/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];
    });
  }

  function detectLang(text){
    if (/^\s*(CREATE|SELECT|INSERT|UPDATE|DELETE)\b/im.test(text)) return 'sql';
    if (/<!DOCTYPE|<html|<div|<section|<p>/i.test(text)) return 'html';
    if (/^\s*[.#\w-]+\s*\{/.test(text)) return 'css';
    if (/^\s*#!|^\s*(git|pip|npm|sudo)\b/m.test(text)) return 'sh';
    if (/^\s*\w+:\s*$/m.test(text) && /:\s*\w+/.test(text)) return 'kv';
    return 'py';
  }

  function highlight(codeEl){
    var cls = (codeEl.className || '').trim().split(/\s+/)[0];
    var src = codeEl.textContent;
    if (!LANGS[cls]) cls = detectLang(src);
    var lang = LANGS[cls];
    if (!lang) return;

    var re = lang[0], classes = lang[1];
    var out = '', last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(src))){
      out += escapeHtml(src.slice(last, m.index));
      var chunk = escapeHtml(m[0]);
      for (var i = 1; i < m.length; i++){
        if (m[i] !== undefined){
          chunk = '<i class="' + classes[i - 1] + '">' + chunk + '</i>';
          break;
        }
      }
      out += chunk;
      last = m.index + m[0].length;
      if (m[0] === '') re.lastIndex++;
    }
    out += escapeHtml(src.slice(last));
    codeEl.innerHTML = out;
  }

  function highlightAll(){
    var codes = document.querySelectorAll('pre > code');
    for (var i = 0; i < codes.length; i++) highlight(codes[i]);
  }

  /* ==================== 2. КНОПКА «НАВЕРХ» ==================== */
  function addToTop(){
    var btn = document.createElement('button');
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Наверх');
    btn.textContent = '↑';
    document.body.appendChild(btn);

    function update(){
      btn.classList.toggle('show', window.scrollY > 400);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==================== 3. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ==================== */
  var LS_THEME = 'py_cheats_theme';

  function systemIsDark(){
    return window.matchMedia('(prefers-color-scheme:dark)').matches;
  }
  function isDark(){
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return systemIsDark();
  }
  function applyTheme(t){
    if (t === 'dark' || t === 'light'){
      document.documentElement.setAttribute('data-theme', t);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function initTheme(){
    var saved = null;
    try { saved = localStorage.getItem(LS_THEME); } catch(e){}
    if (saved) applyTheme(saved);

    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Переключить тему');

    function refresh(){
      btn.textContent = isDark() ? '☀' : '☾';
      btn.title = isDark() ? 'Светлая тема' : 'Тёмная тема';
    }
    refresh();

    btn.addEventListener('click', function(){
      var next = isDark() ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(LS_THEME, next); } catch(e){}
      refresh();
    });

    document.body.appendChild(btn);
  }

  /* ==================== 4. ПРОГРЕСС ЧТЕНИЯ ==================== */
  function addReadProgress(){
    var bar = document.createElement('div');
    bar.className = 'read-progress';
    document.body.appendChild(bar);

    function update(){
      var h = document.documentElement;
      var total = h.scrollHeight - h.clientHeight;
      var pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
      bar.style.width = pct.toFixed(2) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ==================== 5. АКТИВНЫЙ ПУНКТ NAV ==================== */
  function initNavActive(){
    var nav = document.querySelector('nav.toc, nav:not(.sh-nav)');
    if (!nav) return;
    var links = nav.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    var targets = [];
    for (var i = 0; i < links.length; i++){
      var id = links[i].getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) targets.push({ el: el, link: links[i] });
    }
    if (!targets.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        for (var j = 0; j < targets.length; j++){
          targets[j].link.classList.toggle('active', targets[j].el === entry.target);
        }
      });
    }, { rootMargin: '-90px 0px -70% 0px', threshold: 0 });

    targets.forEach(function(t){ io.observe(t.el); });
  }

  /* ==================== 6. ID ДЛЯ H2 БЕЗ ID ==================== */
  function initAutoIds(){
    var h2s = document.querySelectorAll('main h2:not([id])');
    for (var i = 0; i < h2s.length; i++){
      var t = h2s[i].textContent
        .toLowerCase()
        .replace(/[^\wа-яё]+/gi, '-')
        .replace(/^-|-$/g, '');
      if (t) h2s[i].id = t;
    }
  }

  /* ==================== 7. ПЛАВНЫЙ СКРОЛЛ ЯКОРЕЙ ==================== */
  function initSmoothScroll(){
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      if (a.closest('.sh-menu')) return; // не мешаем ссылкам в меню
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    });
  }

  /* ==================== ЗАПУСК ==================== */
  function boot(){
    buildHeader();
    initAutoIds();
    highlightAll();
    addToTop();
    initTheme();
    addReadProgress();
    initNavActive();
    initSmoothScroll();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();