(function(){
  document.documentElement.classList.add('js');
  // モバイルメニュー
  var btn=document.querySelector('.menu-btn');
  btn.addEventListener('click',function(){
    var open=document.body.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded',open);
  });
  // 画像が無い場合はプレースホルダー色面を見せる
  document.querySelectorAll('.ph img').forEach(function(i){
    i.addEventListener('error',function(){i.style.display='none'});
  });
  // 控えめなフェードイン
  var els=document.querySelectorAll('.sec-title .ja,.service__list li,.support__list li,.concept__photo,.concept__body');  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}
  var io=new IntersectionObserver(function(ents){
    ents.forEach(function(en){if(en.isIntersecting){en.target.classList.add('is-in');io.unobserve(en.target)}});
  },{threshold:.12});
  els.forEach(function(e){io.observe(e)});
})();

/* FV slider：5枚クロスフェード（操作UIなし） */
(function(){
  // ▼ 写真の管理はここだけ。同じファイル名で差し替えればOK
var heroSlides=[
  {src:'images/top/top.jpg', alt:'桜と富士山を望む和装フォトウェディング',tone:'light',pos:'50% 50%'},
  {src:'images/top/top2.jpg',alt:'雪景色の中のウェディングフォト',        tone:'light',pos:'50% 50%'},
  {src:'images/top/top3.jpg',alt:'東京駅前のウェディングフォト',          tone:'light',pos:'50% 50%'},
  {src:'images/top/top4.jpg',alt:'韓国スタジオでのウェディングフォト',    tone:'light',pos:'50% 50%'},
  {src:'images/top/top5.jpg',alt:'湖畔のウェディングフォト',              tone:'light',pos:'50% 50%'}
];
  var INTERVAL=6500;

  var fv=document.querySelector('.fv');
  if(!fv) return;
  var wrap=fv.querySelector('[data-fv-slides]');
  var cur=fv.querySelector('[data-fv-current]');
  var tot=fv.querySelector('[data-fv-total]');
  var imgs=[], idx=0, timer;
  function pad(n){return ('0'+n).slice(-2)}
  if(tot) tot.textContent=pad(heroSlides.length);

  heroSlides.forEach(function(s){
    var img=new Image();
    img.src=s.src; img.alt=s.alt||''; img.decoding='async';
    img.style.objectPosition=s.pos||'50% 50%';
    img.setAttribute('aria-hidden','true');
    img.addEventListener('error',function(){
      img.dataset.broken='1';                      // 未配置の画像はスキップ
      if(img.classList.contains('is-active')) next();
    });
    wrap.appendChild(img); imgs.push(img);
  });

  function show(n){
    imgs.forEach(function(im,i){
      var on=i===n;
      im.classList.toggle('is-active',on);
      im.setAttribute('aria-hidden',on?'false':'true');
    });
    fv.dataset.tone=heroSlides[n].tone||'light';
    if(cur) cur.textContent=pad(n+1);
    idx=n;
  }
  function next(){
    for(var k=1;k<=imgs.length;k++){
      var n=(idx+k)%imgs.length;
      if(!imgs[n].dataset.broken){ show(n); return; }
    }
  }
  function start(){ stop(); if(imgs.length>1) timer=setInterval(next,INTERVAL); }
  function stop(){ clearInterval(timer); }

  show(0);
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  start();
  document.addEventListener('visibilitychange',function(){ document.hidden?stop():start(); });
})();

// NEWS アコーディオン
document.querySelectorAll('.news__item').forEach(function (item) {
  var btn = item.querySelector('.news__toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var open = item.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

// BANNER パララックス（スクロールで画像が上下に少し動く）
(function () {
  var banner = document.querySelector('.banner');
  if (!banner) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ticking = false;

  function update() {
    var rect = banner.getBoundingClientRect();
    var vh = window.innerHeight;
    // 画面中央にバナー中央が来た時を 0、下端〜上端を +1〜-1 にする
    var p = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
    p = Math.max(-1, Math.min(1, p));
    var max = rect.height * 0.12; // 上下に動く最大量（CSSの12%に合わせる）
    banner.style.setProperty('--py', (-p * max).toFixed(1) + 'px');
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// Header：スクロール状態 / スマホメニューをリンクタップ・Escで閉じる
(function(){
  var header=document.querySelector('.header');
  if(header){
    var onScroll=function(){header.classList.toggle('is-scrolled',window.scrollY>24)};
    window.addEventListener('scroll',onScroll,{passive:true});
    onScroll();
  }
  var btn=document.querySelector('.menu-btn'),nav=document.querySelector('.gnav');
  if(!btn||!nav) return;
  function close(){document.body.classList.remove('nav-open');btn.setAttribute('aria-expanded','false')}
  nav.addEventListener('click',function(e){if(e.target.closest('a')) close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape') close()});
})();