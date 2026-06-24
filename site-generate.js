/* ============================================================
   site-generate.js  —  The Gordon Hotel
   Turns content (from content.json) into the full index.html.
   Pure: no DOM access, so it runs in the browser (admin.html)
   and in Node (build/test). Do not edit by hand unless you know
   what you're doing — edit content.json via admin.html instead.
   ============================================================ */
(function (root) {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function attr(s) { return esc(s).replace(/"/g, "&quot;"); }
  function enc(s) { return encodeURIComponent(String(s == null ? "" : s)); }

  var CSS = `
  :root{
    --bg:#0A0908; --bg-2:#121110; --bg-3:#1B1813;
    --gold:#C9A24C; --gold-bright:#E4C36A; --gold-soft:#8C7029;
    --text:#ECE6D8; --muted:#9D9483;
    --line:rgba(201,162,76,.22); --line-strong:rgba(201,162,76,.45);
    --maxw:1140px;
    --display:'Michroma',sans-serif;
    --body:'Saira',-apple-system,system-ui,sans-serif;
  }
  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{margin:0;background:var(--bg);color:var(--text);font-family:var(--body);font-weight:400;line-height:1.65;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden;}
  h1,h2,h3,h4{margin:0;font-weight:400;}
  a{color:inherit;}
  img{max-width:100%;display:block;}
  ::selection{background:var(--gold);color:#0A0908;}
  .wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px;}
  .eyebrow{font-family:var(--body);font-weight:600;text-transform:uppercase;letter-spacing:.32em;font-size:.7rem;color:var(--gold);}
  .section-title{font-family:var(--display);text-transform:uppercase;letter-spacing:.04em;font-size:clamp(1.55rem,4.4vw,2.55rem);color:var(--text);line-height:1.12;}
  .gold-rule{width:52px;height:2px;background:var(--gold);margin-bottom:1.4rem;}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;font-family:var(--body);font-weight:600;letter-spacing:.04em;text-transform:uppercase;font-size:.86rem;line-height:1;padding:1.05em 1.7em;border-radius:2px;text-decoration:none;cursor:pointer;border:1.5px solid transparent;transition:transform .18s ease,background .18s ease,color .18s ease,border-color .18s ease,box-shadow .18s ease;white-space:nowrap;}
  .btn-gold{background:var(--gold);color:#0A0908;}
  .btn-gold:hover{background:var(--gold-bright);transform:translateY(-2px);box-shadow:0 12px 28px -12px rgba(201,162,76,.6);}
  .btn-ghost{background:transparent;color:var(--gold);border-color:var(--line-strong);}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold-bright);background:rgba(201,162,76,.07);transform:translateY(-2px);}
  :focus-visible{outline:3px solid var(--gold-bright);outline-offset:3px;border-radius:3px;}
  .skip{position:absolute;left:-9999px;top:0;background:var(--gold);color:#0A0908;padding:.7em 1.2em;font-weight:700;z-index:300;}
  .skip:focus{left:0;}
  header.site{position:sticky;top:0;z-index:120;transition:background .3s ease,box-shadow .3s ease,border-color .3s ease;border-bottom:1px solid transparent;}
  header.site.scrolled{background:rgba(8,8,7,.94);backdrop-filter:blur(8px);border-bottom-color:var(--line);box-shadow:0 14px 30px rgba(0,0,0,.4);}
  .nav{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:76px;}
  .brand{display:flex;align-items:center;gap:.7em;text-decoration:none;flex:none;}
  .brand img{height:38px;width:auto;}
  .nav-links{display:none;gap:2.2em;align-items:center;margin-left:auto;}
  .nav-links a{text-decoration:none;color:var(--text);font-weight:500;font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;opacity:.82;transition:opacity .18s,color .18s;}
  .nav-links a:hover{opacity:1;color:var(--gold-bright);}
  .nav-actions{display:flex;gap:.6em;flex:none;}
  .nav-actions .btn{padding:.78em 1.15em;font-size:.74rem;}
  .nav-actions .btn.menu-only{display:none;}
  @media(min-width:980px){.nav-links{display:flex;}.nav-actions .btn.menu-only{display:inline-flex;}}
  .hero{position:relative;margin-top:-76px;padding:150px 0 96px;text-align:center;overflow:hidden;}
  .hero::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(60% 42% at 50% 8%, rgba(201,162,76,.16) 0%, rgba(201,162,76,0) 62%),radial-gradient(80% 60% at 50% 120%, rgba(201,162,76,.07) 0%, rgba(201,162,76,0) 60%);}
  .hero::after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;box-shadow:inset 0 -60px 90px -50px #000;}
  .hero-inner{position:relative;z-index:2;max-width:820px;margin:0 auto;padding:0 24px;}
  .hero .eyebrow{display:inline-block;margin-bottom:1.6rem;}
  .hero-logo{width:min(620px,86%);margin:0 auto 1.4rem;filter:drop-shadow(0 8px 30px rgba(0,0,0,.6));}
  .hero h1{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);}
  .tagline{font-family:var(--body);font-weight:300;font-size:clamp(1.15rem,2.6vw,1.55rem);color:var(--text);max-width:30ch;margin:.4rem auto 0;line-height:1.4;}
  .tagline b{font-weight:600;color:var(--gold-bright);}
  .hero-sub{margin:1.1rem auto 0;max-width:52ch;color:var(--muted);font-size:1.02rem;}
  .status{display:inline-flex;align-items:center;gap:.65em;margin:2rem auto 0;padding:.65em 1.2em;background:rgba(201,162,76,.05);border:1px solid var(--line-strong);border-radius:999px;font-weight:500;font-size:.94rem;color:var(--text);}
  .status .dot{width:9px;height:9px;border-radius:50%;background:var(--muted);flex:none;}
  .status.open .dot{background:#7BD17F;animation:pulse 2.4s infinite;}
  .status.closed .dot{background:#C0563C;box-shadow:0 0 8px rgba(192,86,60,.5);}
  @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(123,209,127,.55);}70%{box-shadow:0 0 0 8px rgba(123,209,127,0);}100%{box-shadow:0 0 0 0 rgba(123,209,127,0);}}
  .hero-cta{display:flex;flex-wrap:wrap;gap:.8em;justify-content:center;margin-top:2.1rem;}
  .hero-note{margin-top:1.1rem;font-size:.78rem;letter-spacing:.04em;color:var(--muted);text-transform:uppercase;}
  .band{padding:clamp(58px,8vw,100px) 0;scroll-margin-top:84px;position:relative;}
  .band.alt{background:var(--bg-2);}
  .band-head{max-width:680px;margin-bottom:48px;}
  .band-head .eyebrow{display:block;margin-bottom:.85rem;}
  .band-head p{color:var(--muted);font-size:1.08rem;margin:1rem 0 0;max-width:54ch;}
  .promos{display:grid;gap:18px;grid-template-columns:1fr;}
  @media(min-width:680px){.promos{grid-template-columns:repeat(2,1fr);}}
  @media(min-width:1000px){.promos{grid-template-columns:repeat(3,1fr);}}
  .promo{position:relative;overflow:hidden;background:var(--bg-3);border:1px solid var(--line);border-radius:6px;cursor:pointer;transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease;min-height:230px;}
  .promo:hover{transform:translateY(-4px);border-color:var(--line-strong);box-shadow:0 22px 44px -26px rgba(0,0,0,.85);}
  .promo.feature{border-color:var(--line-strong);}
  .promo-media{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center;opacity:.14;transform:scale(1.01);transition:opacity .45s ease,transform .6s ease;}
  .promo-shade{position:absolute;inset:0;z-index:0;background:linear-gradient(165deg,rgba(10,9,8,.62) 0%,rgba(10,9,8,.80) 55%,rgba(10,9,8,.90) 100%);transition:background .4s ease;}
  .promo:hover .promo-media,.promo:focus-within .promo-media,.promo.show-bg .promo-media{opacity:.52;transform:scale(1.07);}
  .promo:hover .promo-shade,.promo.show-bg .promo-shade{background:linear-gradient(165deg,rgba(10,9,8,.34) 0%,rgba(10,9,8,.58) 60%,rgba(10,9,8,.82) 100%);}
  @media(hover:none){.promo-media{opacity:.30;}}
  .promo-body{position:relative;z-index:1;padding:30px 28px;display:flex;flex-direction:column;height:100%;min-height:230px;}
  .promo .kicker{font-family:var(--body);font-weight:700;text-transform:uppercase;letter-spacing:.18em;font-size:.66rem;color:var(--gold);margin-bottom:.55rem;}
  .promo h3{font-family:var(--display);text-transform:uppercase;font-size:1.16rem;letter-spacing:.02em;color:var(--text);line-height:1.2;}
  .promo .when{margin-top:.55rem;color:var(--gold-bright);font-weight:600;font-size:.96rem;}
  .promo p{margin:.55rem 0 0;color:var(--text);opacity:.86;font-size:.97rem;}
  .promo .price-badge{position:absolute;top:0;right:0;font-family:var(--display);font-size:1.05rem;color:var(--gold-bright);}
  .promo .promo-link{margin-top:auto;padding-top:1.2rem;}
  .promo .promo-link a{display:inline-flex;align-items:center;gap:.4em;color:var(--gold);font-weight:600;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid var(--line-strong);padding-bottom:2px;transition:color .18s,border-color .18s;}
  .promo .promo-link a:hover{color:var(--gold-bright);border-color:var(--gold);}
  .tap-hint{position:absolute;bottom:12px;right:14px;z-index:1;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);opacity:.6;display:none;}
  @media(hover:none){.tap-hint{display:block;}}
  .menu-note{color:var(--muted);font-size:.86rem;margin-top:14px;}
  .tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:40px;border-bottom:1px solid var(--line);padding-bottom:18px;}
  .tab{font-family:var(--body);font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:.78rem;color:var(--muted);background:transparent;border:1px solid var(--line);padding:.7em 1.15em;border-radius:999px;cursor:pointer;transition:all .18s ease;}
  .tab:hover{color:var(--text);border-color:var(--line-strong);}
  .tab[aria-selected="true"]{background:var(--gold);color:#0A0908;border-color:var(--gold);}
  .menu-cat{margin-bottom:46px;}
  .menu-cat:last-child{margin-bottom:0;}
  .menu-cat > h3{font-family:var(--display);text-transform:uppercase;letter-spacing:.06em;font-size:1.05rem;color:var(--gold);margin-bottom:.4rem;}
  .menu-cat .cat-note{color:var(--muted);font-size:.85rem;font-style:italic;margin:0 0 1.4rem;max-width:60ch;}
  .menu-cat .cat-rule{height:1px;background:var(--line);margin-bottom:1.6rem;}
  .items{display:grid;grid-template-columns:1fr;gap:1.5rem 56px;}
  @media(min-width:760px){.items{grid-template-columns:1fr 1fr;}}
  .item-head{display:flex;align-items:baseline;gap:.6rem;}
  .item-name{font-weight:600;font-size:1.06rem;color:var(--text);}
  .item-name .tag{display:inline-block;font-family:var(--body);font-weight:700;font-size:.58rem;letter-spacing:.08em;color:var(--gold);border:1px solid var(--line-strong);border-radius:3px;padding:.12em .4em;margin-left:.35em;vertical-align:middle;text-transform:uppercase;}
  .item-dots{flex:1;border-bottom:1px dotted var(--line-strong);transform:translateY(-4px);min-width:18px;}
  .item-price{font-weight:600;color:var(--gold-bright);font-size:1rem;white-space:nowrap;}
  .item-desc{margin:.25rem 0 0;color:var(--muted);font-size:.9rem;line-height:1.5;}
  .item.has-photo{appearance:none;-webkit-appearance:none;background:transparent;border:0;font:inherit;color:inherit;text-align:left;width:100%;display:grid;grid-template-columns:60px 1fr;gap:15px;align-items:center;cursor:pointer;border-radius:9px;padding:8px;margin:-8px;transition:background .2s ease;}
  .item.has-photo:hover{background:rgba(201,162,76,.07);}
  .thumb-wrap{position:relative;display:block;width:60px;height:60px;flex:none;}
  .item.has-photo .thumb{width:60px;height:60px;border-radius:8px;object-fit:cover;border:1px solid var(--line-strong);display:block;transition:transform .2s ease,border-color .2s ease;}
  .item.has-photo:hover .thumb{transform:scale(1.05);border-color:var(--gold);}
  .thumb-zoom{position:absolute;right:-6px;bottom:-6px;width:21px;height:21px;border-radius:50%;background:var(--gold);color:#0A0908;font-size:14px;font-weight:700;line-height:21px;text-align:center;border:2px solid var(--bg-2);}
  .item.has-photo .content{min-width:0;}
  .item.has-photo .item-desc{display:block;}
  .panel[hidden]{display:none;}
  .panel-intro{background:linear-gradient(160deg,#1a1408,var(--bg-3));border:1px solid var(--line-strong);border-radius:4px;padding:20px 24px;margin-bottom:34px;}
  .panel-intro strong{color:var(--gold-bright);}
  .panel-intro span{color:var(--muted);}
  .lightbox{position:fixed;inset:0;z-index:200;background:rgba(6,6,5,.92);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .25s ease;}
  .lightbox[hidden]{display:none;}
  .lightbox.open{opacity:1;}
  .lightbox-fig{margin:0;max-width:900px;display:flex;flex-direction:column;align-items:center;gap:14px;}
  .lightbox-fig img{max-width:100%;max-height:76vh;border-radius:6px;border:1px solid var(--line-strong);box-shadow:0 30px 70px -20px #000;}
  .lightbox-fig figcaption{font-family:var(--display);text-transform:uppercase;letter-spacing:.04em;color:var(--gold-bright);font-size:1rem;text-align:center;}
  .lightbox-close{position:absolute;top:18px;right:22px;width:46px;height:46px;border-radius:50%;background:rgba(201,162,76,.12);border:1px solid var(--line-strong);color:var(--gold);font-size:1.7rem;line-height:1;cursor:pointer;transition:background .2s,color .2s;}
  .lightbox-close:hover{background:var(--gold);color:#0A0908;}
  .visit-band{background:var(--bg-2);}
  .visit-grid{display:grid;gap:50px;grid-template-columns:1fr;}
  @media(min-width:900px){.visit-grid{grid-template-columns:1fr 1.05fr;gap:70px;}}
  .hours{border-top:1px solid var(--line);}
  .hours .row{display:flex;justify-content:space-between;align-items:flex-start;gap:1.4rem;padding:1.05rem 0;border-bottom:1px solid var(--line);}
  .hours .day{font-family:var(--display);text-transform:uppercase;font-size:.86rem;letter-spacing:.04em;color:var(--text);}
  .hours .times{text-align:right;color:var(--muted);font-size:.96rem;}
  .hours .times span{display:block;}
  .hours .row.today .day{color:var(--gold-bright);}
  .hours .row.today .day::after{content:"Today";margin-left:.6em;font-family:var(--body);font-weight:700;font-size:.58rem;letter-spacing:.12em;color:#0A0908;background:var(--gold);padding:.2em .55em;border-radius:999px;vertical-align:middle;}
  .happy{margin-top:18px;font-size:.9rem;color:var(--muted);}
  .happy b{color:var(--gold);}
  .find p{margin:0 0 1.05rem;color:var(--text);font-size:1.04rem;}
  .find .label{display:block;font-family:var(--body);font-weight:700;text-transform:uppercase;letter-spacing:.16em;font-size:.66rem;color:var(--gold);margin-bottom:.18rem;}
  .find a{color:var(--text);text-decoration:none;border-bottom:1px solid var(--line-strong);transition:color .18s;}
  .find a:hover{color:var(--gold-bright);}
  .map{margin-top:1.5rem;border-radius:6px;overflow:hidden;border:1px solid var(--line-strong);aspect-ratio:16/10;background:var(--bg-3);}
  .map iframe{width:100%;height:100%;border:0;display:block;filter:grayscale(.3) contrast(1.05);}
  .visit-cta{display:flex;flex-wrap:wrap;gap:.7em;margin-top:1.6rem;}
  footer.site{background:#070706;border-top:1px solid var(--line);padding:62px 0 38px;}
  .foot-top{display:flex;flex-wrap:wrap;gap:42px;justify-content:space-between;align-items:flex-start;}
  .foot-brand{max-width:34ch;}
  .foot-brand img{width:240px;margin-bottom:1rem;}
  .foot-brand p{color:var(--muted);font-size:.96rem;margin:0;}
  .foot-col h4{font-family:var(--body);font-weight:700;text-transform:uppercase;letter-spacing:.16em;font-size:.68rem;color:var(--gold);margin-bottom:1rem;}
  .foot-col a{display:block;color:var(--muted);text-decoration:none;margin-bottom:.55rem;font-size:.96rem;transition:color .18s;}
  .foot-col a:hover{color:var(--gold-bright);}
  .foot-bottom{margin-top:46px;padding-top:24px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:.6rem 1.5rem;justify-content:space-between;font-size:.8rem;color:#6f6857;letter-spacing:.02em;}
  .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease;}
  .reveal.in{opacity:1;transform:none;}
  .reviews-band .reviews-cta{display:flex;flex-wrap:wrap;align-items:center;gap:.9em;margin-bottom:30px;}
  .reviews-cta .stars{color:var(--gold-bright);letter-spacing:3px;font-size:1.05rem;}
  .reviews-cta .muted-line{color:var(--muted);font-size:.9rem;}
  .sk-widget{border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--bg-3);}
  .sk-widget iframe{width:100%;height:560px;border:0;display:block;}
  .contact-form{max-width:760px;}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  @media(max-width:640px){.form-grid{grid-template-columns:1fr;}}
  .form-field{display:flex;flex-direction:column;gap:6px;}
  .form-field.full{grid-column:1/-1;}
  .form-field label{font-family:var(--body);font-weight:600;text-transform:uppercase;letter-spacing:.12em;font-size:.66rem;color:var(--gold);}
  .form-field input,.form-field textarea{font-family:var(--body);font-size:1rem;color:var(--text);background:var(--bg-3);border:1px solid var(--line);border-radius:6px;padding:.8em .9em;transition:border-color .18s;}
  .form-field input:focus,.form-field textarea:focus{outline:none;border-color:var(--gold);}
  .form-field textarea{min-height:130px;resize:vertical;}
  .hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0;}
  .contact-actions{margin-top:18px;}
  .form-status{margin-top:12px;font-size:.96rem;min-height:1.2em;color:var(--muted);}
  .form-status.ok{color:#7BD17F;}
  .form-status.err{color:#E08B6A;}
  .contact-alt{margin-top:18px;color:var(--muted);font-size:.95rem;}
  .contact-alt a{color:var(--gold-bright);text-decoration:none;border-bottom:1px solid var(--line-strong);}
  @media(prefers-reduced-motion:reduce){*{animation:none!important;scroll-behavior:auto!important;}.reveal{opacity:1;transform:none;transition:none;}.btn:hover,.promo:hover{transform:none;}}
  `;

  function buildIndexHtml(content) {
    var c = content.contact || {};
    var h = content.hero || {};
    var telHref = c.telHref || "";
    var addr = c.address || "";
    var mapSearch = "https://www.google.com/maps/search/?api=1&amp;query=" + enc(addr);
    var mapDir = "https://www.google.com/maps/dir/?api=1&amp;destination=" + enc(addr);
    var mapEmbed = "https://www.google.com/maps?q=" + enc(addr) + "&output=embed";

    function tagsHtml(tags) {
      return (tags || []).map(function (t) { return ' <span class="tag">' + esc(t) + "</span>"; }).join("");
    }
    function itemHtml(it) {
      var nameHtml = esc(it.name) + tagsHtml(it.tags);
      if (it.img) {
        return '<button class="item has-photo" data-img="' + attr(it.img) + '" data-label="' + attr(it.name) + '">' +
          '<span class="thumb-wrap"><img class="thumb" src="' + attr(it.img) + '" alt="' + attr(it.name) + '" loading="lazy"><span class="thumb-zoom" aria-hidden="true">+</span></span>' +
          '<span class="content"><span class="item-head"><span class="item-name">' + nameHtml + '</span><span class="item-dots"></span><span class="item-price">' + esc(it.price) + "</span></span>" +
          (it.desc ? '<span class="item-desc">' + esc(it.desc) + "</span>" : "") +
          "</span></button>";
      }
      return '<div class="item"><div class="item-head"><span class="item-name">' + nameHtml + '</span><span class="item-dots"></span><span class="item-price">' + esc(it.price) + "</span></div>" +
        (it.desc ? '<p class="item-desc">' + esc(it.desc) + "</p>" : "") + "</div>";
    }
    function catHtml(cat) {
      return '<div class="menu-cat"><h3>' + esc(cat.name) + "</h3>" +
        (cat.note ? '<p class="cat-note">' + esc(cat.note) + "</p>" : "") +
        '<div class="cat-rule"></div><div class="items">' + (cat.items || []).map(itemHtml).join("") + "</div></div>";
    }
    function introHtml(intro) {
      var i = intro.indexOf(". ");
      var bold = i === -1 ? intro : intro.slice(0, i + 1);
      var rest = i === -1 ? "" : intro.slice(i + 2);
      return "<strong>" + esc(bold) + "</strong>" + (rest ? " <span>" + esc(rest) + "</span>" : "");
    }
    function tabsHtml(tabs) {
      return '<div class="tabs reveal" role="tablist" aria-label="Menu categories">' +
        tabs.map(function (t, i) {
          return '<button class="tab" role="tab" id="tab-' + attr(t.id) + '" aria-controls="panel-' + attr(t.id) +
            '" aria-selected="' + (i === 0 ? "true" : "false") + '">' + esc(t.label) + "</button>";
        }).join("") + "</div>";
    }
    function panelsHtml(tabs) {
      return tabs.map(function (t, i) {
        return '<div class="panel reveal" id="panel-' + attr(t.id) + '" role="tabpanel" aria-labelledby="tab-' + attr(t.id) +
          '" tabindex="0"' + (i === 0 ? "" : " hidden") + ">" +
          (t.intro ? '<div class="panel-intro">' + introHtml(t.intro) + "</div>" : "") +
          (t.categories || []).map(catHtml).join("") + "</div>";
      }).join("");
    }
    function promosHtml(promos) {
      return (promos || []).map(function (p) {
        var link = "";
        if (p.linkType === "tel" && p.linkText) link = '<div class="promo-link"><a href="tel:' + attr(telHref) + '">' + esc(p.linkText) + "</a></div>";
        else if (p.linkType === "tab" && p.linkText) link = '<div class="promo-link"><a href="#menu" data-menu data-tab="' + attr(p.linkValue) + '">' + esc(p.linkText) + "</a></div>";
        return '<article class="promo' + (p.feature ? " feature" : "") + ' reveal">' +
          '<div class="promo-media" style="background-image:url(\'' + attr(p.img) + '\')"></div>' +
          '<div class="promo-shade"></div>' +
          '<div class="promo-body">' +
          (p.price ? '<span class="price-badge">' + esc(p.price) + "</span>" : "") +
          '<span class="kicker">' + esc(p.kicker) + "</span>" +
          "<h3>" + esc(p.title) + "</h3>" +
          '<div class="when">' + esc(p.when) + "</div>" +
          "<p>" + esc(p.body) + "</p>" + link +
          "</div><span class=\"tap-hint\">Tap for photo</span></article>";
      }).join("");
    }
    function hoursHtml(rows) {
      return (rows || []).map(function (r) {
        return '<div class="row" data-days="' + attr((r.days || []).join(",")) + '"><span class="day">' + esc(r.day) +
          '</span><span class="times">' + (r.lines || []).map(function (l) { return "<span>" + esc(l) + "</span>"; }).join("") + "</span></div>";
      }).join("");
    }

    var SCRIPT =
      '(function(){"use strict";' +
      'var HOURS=' + JSON.stringify(content.hoursData || {}) + ';' +
      "var DAY_NAMES=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];" +
      "function fmt(t){if(t>=24)return'midnight';var h=Math.floor(t),m=Math.round((t-h)*60),ap=h>=12?'pm':'am',h12=h%12;if(h12===0)h12=12;return m?(h12+':'+(m<10?'0'+m:m)+ap):(h12+ap);}" +
      "function melNow(){try{return new Date(new Date().toLocaleString('en-US',{timeZone:'Australia/Melbourne'}));}catch(e){return new Date();}}" +
      "function nextOpen(day,time){for(var i=0;i<=7;i++){var d=(day+i)%7,info=HOURS[d];if(!info||!info.bar)continue;var o=info.bar[0];if(i===0&&time>=o)continue;var w=(i===0)?'today':(i===1)?'tomorrow':DAY_NAMES[d];return w+' from '+fmt(o);}return'soon';}" +
      "function compute(){var now=melNow(),day=now.getDay(),time=now.getHours()+now.getMinutes()/60,info=HOURS[day],open=false,text='';var bar=info&&info.bar&&time>=info.bar[0]&&time<info.bar[1],serv=null;if(info&&info.kitchen){for(var k=0;k<info.kitchen.length;k++){var s=info.kitchen[k];if(time>=s[0]&&time<s[1]){serv={label:(s[0]<15?'lunch':'dinner'),close:s[1]};break;}}}if(bar){open=true;if(serv){text=\"Open now \\u2014 kitchen's serving \"+serv.label+\" till \"+fmt(serv.close);}else{var up=null;if(info.kitchen){for(var j=0;j<info.kitchen.length;j++){if(time<info.kitchen[j][0]){up=info.kitchen[j];break;}}}text=up?(\"Open now \\u2014 kitchen's on at \"+fmt(up[0])+\", bar till \"+fmt(info.bar[1])):(\"Open now \\u2014 bar's on till \"+fmt(info.bar[1]));}}else{text=\"Closed now \\u2014 open \"+nextOpen(day,time);}return{open:open,text:text,day:day};}" +
      "function renderStatus(){var s=compute(),box=document.getElementById('status'),txt=document.getElementById('status-text');if(box&&txt){box.classList.remove('open','closed');box.classList.add(s.open?'open':'closed');txt.textContent=s.text;}document.querySelectorAll('#hours .row').forEach(function(r){var d=(r.getAttribute('data-days')||'').split(',');r.classList.toggle('today',d.indexOf(String(s.day))!==-1);});}" +
      "renderStatus();setInterval(renderStatus,60000);" +
      "var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();" +
      "var header=document.querySelector('header.site');function onScroll(){header.classList.toggle('scrolled',window.scrollY>24);}onScroll();window.addEventListener('scroll',onScroll,{passive:true});" +
      "var tabs=Array.prototype.slice.call(document.querySelectorAll('.tab'));var panels=Array.prototype.slice.call(document.querySelectorAll('.panel'));" +
      "function activateTab(tab,focus){var target=tab.getAttribute('aria-controls');tabs.forEach(function(t){t.setAttribute('aria-selected',t===tab?'true':'false');});panels.forEach(function(p){p.hidden=(p.id!==target);if(!p.hidden)p.classList.add('in');});if(focus)tab.focus();}" +
      "tabs.forEach(function(tab,i){tab.addEventListener('click',function(){activateTab(tab);});tab.addEventListener('keydown',function(e){var idx=i;if(e.key==='ArrowRight')idx=(i+1)%tabs.length;else if(e.key==='ArrowLeft')idx=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')idx=0;else if(e.key==='End')idx=tabs.length-1;else return;e.preventDefault();activateTab(tabs[idx],true);});});" +
      "var cur=document.querySelector('.tab[aria-selected=\"true\"]')||tabs[0];if(cur)activateTab(cur);" +
      "function tabById(id){return document.getElementById('tab-'+id.replace('panel-',''));}" +
      "document.querySelectorAll('[data-menu]').forEach(function(link){link.addEventListener('click',function(){var w=link.getAttribute('data-tab');if(w){var t=tabById(w);if(t)activateTab(t);}});});" +
      "document.querySelectorAll('.promo').forEach(function(p){p.addEventListener('click',function(e){if(e.target.closest('a'))return;p.classList.toggle('show-bg');});});" +
      "var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lightbox-img'),lbCap=document.getElementById('lightbox-cap'),lbClose=document.getElementById('lightbox-close'),lastFocus=null,closeTimer=null;" +
      "function openLb(src,label){if(closeTimer){clearTimeout(closeTimer);closeTimer=null;}lbImg.src=src;lbImg.alt=label||'';lbCap.textContent=label||'';lastFocus=document.activeElement;lb.hidden=false;requestAnimationFrame(function(){lb.classList.add('open');});document.body.style.overflow='hidden';lbClose.focus();}" +
      "function closeLb(){lb.classList.remove('open');document.body.style.overflow='';closeTimer=setTimeout(function(){lb.hidden=true;lbImg.src='';},250);if(lastFocus&&lastFocus.focus)lastFocus.focus();}" +
      "document.querySelectorAll('.item.has-photo').forEach(function(it){it.addEventListener('click',function(){openLb(it.getAttribute('data-img'),it.getAttribute('data-label'));});});" +
      "lbClose.addEventListener('click',closeLb);lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)closeLb();});" +
      "var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var reveals=document.querySelectorAll('.reveal');" +
      "if(reduce||!('IntersectionObserver'in window)){reveals.forEach(function(el){el.classList.add('in');});}else{var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});reveals.forEach(function(el){io.observe(el);});}" +
      "var cf=document.getElementById('contactForm');if(cf){cf.addEventListener('submit',function(e){e.preventDefault();var st=cf.querySelector('.form-status');var keyI=cf.querySelector('input[name=access_key]');var key=keyI&&keyI.value?keyI.value:'';var fd=new FormData(cf);if(fd.get('botcheck')){return;}st.className='form-status';st.textContent='Sending\\u2026';if(key){fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Accept':'application/json'},body:fd}).then(function(r){return r.json();}).then(function(j){if(j.success){cf.reset();st.className='form-status ok';st.textContent=cf.getAttribute('data-ok')||'Thanks, we will be in touch.';}else{st.className='form-status err';st.textContent=j.message||'Something went wrong, please call us.';}}).catch(function(){st.className='form-status err';st.textContent='Could not send, please call or email us directly.';});}else{var to=cf.getAttribute('data-email')||'';var b='Name: '+(fd.get('name')||'')+'\\nEmail: '+(fd.get('email')||'')+'\\nPhone: '+(fd.get('phone')||'')+'\\n\\n'+(fd.get('message')||'');window.location.href='mailto:'+to+'?subject='+encodeURIComponent('Website enquiry')+'&body='+encodeURIComponent(b);st.className='form-status';st.textContent='Opening your email app\\u2026';}});}" +
      "})();";

    var rv = content.reviews || {};
    var cfm = content.contactForm || {};
    var reviewUrl = rv.googleReviewUrl ? rv.googleReviewUrl : ("https://www.google.com/maps/search/?api=1&query=" + enc(addr));
    var skId = rv.sociablekitId ? String(rv.sociablekitId).replace(/[^0-9]/g, "") : "";
    var reviewsHtml = (rv.enabled === false) ? "" : (
      '<section class="band reviews-band" id="reviews"><div class="wrap"><div class="band-head reveal"><div class="gold-rule"></div>' +
      '<span class="eyebrow">Reviews</span><h2 class="section-title">' + esc(rv.heading || "What people say") + "</h2>" +
      (rv.intro ? "<p>" + esc(rv.intro) + "</p>" : "") + "</div>" +
      '<div class="reviews-cta reveal"><a class="btn btn-gold" href="' + attr(reviewUrl) + '" target="_blank" rel="noopener">Leave a Google review</a>' +
      '<span class="stars" aria-hidden="true">\u2605\u2605\u2605\u2605\u2605</span><span class="muted-line">on Google</span></div>' +
      (skId ? '<div class="sk-widget reveal"><iframe title="Google reviews for ' + attr(c.name) + '" src="https://widgets.sociablekit.com/google-reviews/iframe/' + attr(skId) + '" frameborder="0" loading="lazy" scrolling="no"></iframe></div>' : "") +
      "</div></section>\n"
    );
    var contactHtml = (cfm.enabled === false) ? "" : (
      '<section class="band alt contact-band" id="contact"><div class="wrap"><div class="band-head reveal"><div class="gold-rule"></div>' +
      '<span class="eyebrow">Get In Touch</span><h2 class="section-title">' + esc(cfm.heading || "Send us a message") + "</h2>" +
      (cfm.intro ? "<p>" + esc(cfm.intro) + "</p>" : "") + "</div>" +
      '<form class="contact-form reveal" id="contactForm" data-email="' + attr(c.email) + '" data-ok="' + attr(cfm.successMessage || "Thanks for your message.") + '">' +
      (cfm.web3formsKey ? '<input type="hidden" name="access_key" value="' + attr(cfm.web3formsKey) + '">' : "") +
      '<input type="hidden" name="subject" value="New enquiry from the ' + attr(c.name) + ' website">' +
      '<input type="hidden" name="from_name" value="' + attr(c.name) + ' website">' +
      '<div class="form-grid">' +
      '<div class="form-field"><label for="cf-name">Name</label><input id="cf-name" type="text" name="name" autocomplete="name" required></div>' +
      '<div class="form-field"><label for="cf-email">Email</label><input id="cf-email" type="email" name="email" autocomplete="email" required></div>' +
      '<div class="form-field full"><label for="cf-phone">Phone (optional)</label><input id="cf-phone" type="text" name="phone" autocomplete="tel"></div>' +
      '<div class="form-field full"><label for="cf-msg">Message</label><textarea id="cf-msg" name="message" required></textarea></div>' +
      "</div>" +
      '<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div class="contact-actions"><button class="btn btn-gold" type="submit">Send message</button></div>' +
      '<div class="form-status" role="status" aria-live="polite"></div>' +
      "</form>" +
      '<p class="contact-alt">Prefer to call? <a href="tel:' + attr(telHref) + '">' + esc(c.telDisplay) + '</a> \u00b7 <a href="mailto:' + attr(c.email) + '">' + esc(c.email) + "</a></p>" +
      "</div></section>\n"
    );

    return '<!DOCTYPE html>\n<html lang="en-AU">\n<head>\n' +
      '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      "<title>" + esc(c.name) + " \u2014 Country pub, bistro &amp; bottle shop in Gordon, VIC</title>\n" +
      '<meta name="description" content="A quaint country pub with old-fashioned hospitality. Cold beer, hearty counter meals, hot pizza and a drive-through bottle shop. Parma nights, happy hour, kids eat free and takeaway. ' + attr(addr) + '">\n' +
      '<meta name="theme-color" content="#0A0908">\n' +
      '<meta property="og:title" content="' + attr(c.name) + ' \u2014 Gordon, VIC">\n' +
      '<meta property="og:description" content="Old-fashioned country hospitality. Cold beer, hearty meals, hot pizza, a drive-through bottle shop, parma nights and happy hour.">\n' +
      '<meta property="og:type" content="website">\n<meta property="og:image" content="logo-gold.png">\n' +
      "<link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%230A0908'/%3E%3Crect x='2.5' y='2.5' width='59' height='59' rx='10' fill='none' stroke='%23C9A24C' stroke-width='2'/%3E%3Ctext x='32' y='45' font-family='Arial,sans-serif' font-size='38' font-weight='700' text-anchor='middle' fill='%23D4AC52'%3EG%3C/text%3E%3C/svg%3E\">\n" +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Michroma&amp;family=Saira:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet">\n' +
      "<style>" + CSS + "</style>\n</head>\n<body>\n" +
      '<a href="#main" class="skip">Skip to content</a>\n' +
      '<header class="site" id="top"><div class="wrap nav">' +
      '<a href="#top" class="brand" aria-label="' + attr(c.name) + ', home"><img src="logo-gold.png" alt="' + attr(c.name) + '"></a>' +
      '<nav class="nav-links" aria-label="Primary"><a href="#whats-on">What\'s On</a><a href="#menu">Menu</a><a href="#visit">Hours &amp; Find Us</a><a href="#reviews">Reviews</a><a href="#contact">Contact</a></nav>' +
      '<div class="nav-actions"><a class="btn btn-ghost menu-only" href="#menu" data-menu>View Menu</a><a class="btn btn-gold" href="tel:' + attr(telHref) + '">Order Now</a></div>' +
      "</div></header>\n<main id=\"main\">\n" +
      '<section class="hero" aria-labelledby="hero-title"><div class="hero-inner">' +
      '<span class="eyebrow">' + esc(h.eyebrow) + "</span>" +
      '<img class="hero-logo" src="logo-gold.png" alt="' + attr(c.name) + '">' +
      '<h1 id="hero-title">' + esc(c.name) + ' \u2014 Gordon, Victoria</h1>' +
      '<p class="tagline">' + esc(h.taglineLead) + "<b>" + esc(h.taglineBold) + "</b>.</p>" +
      '<p class="hero-sub">' + esc(h.sub) + "</p>" +
      '<div class="status closed" id="status" role="status" aria-live="polite"><span class="dot"></span><span id="status-text">Checking the hours\u2026</span></div>' +
      '<div class="hero-cta"><a class="btn btn-ghost" href="#menu" data-menu>View Menu</a><a class="btn btn-gold" href="tel:' + attr(telHref) + '">Order Now</a></div>' +
      '<p class="hero-note">' + esc(h.note) + "</p>" +
      "</div></section>\n" +
      '<section class="band" id="whats-on"><div class="wrap"><div class="band-head reveal"><div class="gold-rule"></div>' +
      '<span class="eyebrow">What\'s On</span><h2 class="section-title">Specials &amp; pub nights</h2>' +
      "<p>" + esc((content.whatsOn || {}).intro) + "</p></div>" +
      '<div class="promos">' + promosHtml(content.promos) + "</div></div></section>\n" +
      '<section class="band alt" id="menu"><div class="wrap"><div class="band-head reveal"><div class="gold-rule"></div>' +
      '<span class="eyebrow">The Menu</span><h2 class="section-title">A proper feed, every time</h2>' +
      "<p>" + esc((content.menuMeta || {}).intro) + "</p>" +
      '<p class="menu-note">' + esc((content.menuMeta || {}).note) + "</p></div>" +
      tabsHtml(content.menu) + panelsHtml(content.menu) + "</div></section>\n" +
      '<section class="band visit-band" id="visit"><div class="wrap"><div class="band-head reveal"><div class="gold-rule"></div>' +
      '<span class="eyebrow">Drop In</span><h2 class="section-title">Hours &amp; find us</h2></div><div class="visit-grid">' +
      '<div class="reveal"><div class="hours" id="hours">' + hoursHtml(content.hoursRows) + "</div>" +
      '<p class="happy"><b>Happy Hour</b> \u2014 ' + esc(content.happyHourLine) + "</p></div>" +
      '<div class="find reveal">' +
      '<p><span class="label">Where</span><a href="' + mapSearch + '" target="_blank" rel="noopener">' + esc(addr) + "</a></p>" +
      '<p><span class="label">Phone</span><a href="tel:' + attr(telHref) + '">' + esc(c.telDisplay) + "</a></p>" +
      '<p><span class="label">Email</span><a href="mailto:' + attr(c.email) + '">' + esc(c.email) + "</a></p>" +
      '<div class="map"><iframe title="Map showing ' + attr(c.name) + " at " + attr(addr) + '" src="' + mapEmbed + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>' +
      '<div class="visit-cta"><a class="btn btn-gold" href="' + mapDir + '" target="_blank" rel="noopener">Get Directions</a><a class="btn btn-ghost" href="tel:' + attr(telHref) + '">Call to Book</a></div>' +
      "</div></div></div></section>\n" + reviewsHtml + contactHtml + "</main>\n" +
      '<footer class="site"><div class="wrap"><div class="foot-top">' +
      '<div class="foot-brand"><img src="logo-white.png" alt="' + attr(c.name) + '"><p>A quaint country pub with old-fashioned hospitality. Cold beer, hearty meals and a warm welcome \u2014 every day of the week.</p></div>' +
      '<div class="foot-col"><h4>Visit</h4><a href="' + mapSearch + '" target="_blank" rel="noopener">' + esc(c.addressShort || addr) + "</a>" +
      '<a href="tel:' + attr(telHref) + '">' + esc(c.telDisplay) + "</a><a href=\"mailto:" + attr(c.email) + '">' + esc(c.email) + "</a></div>" +
      '<div class="foot-col"><h4>Explore</h4><a href="#whats-on">What\'s On</a><a href="#menu" data-menu>Menu</a><a href="#visit">Hours</a>' +
      '<a href="' + attr(c.facebook) + '" target="_blank" rel="noopener">Facebook</a></div>' +
      '</div><div class="foot-bottom"><span>&copy; <span id="year">2026</span> ' + esc(c.name) + ', Gordon VIC.</span><span>Please enjoy responsibly.</span></div></div></footer>\n' +
      '<div class="lightbox" id="lightbox" hidden><button class="lightbox-close" id="lightbox-close" aria-label="Close photo">&times;</button>' +
      '<figure class="lightbox-fig" role="dialog" aria-modal="true" aria-label="Dish photo"><img id="lightbox-img" src="" alt=""><figcaption id="lightbox-cap"></figcaption></figure></div>\n' +
      "<scr" + "ipt>" + SCRIPT + "</scr" + "ipt>\n</body>\n</html>\n";
  }

  var api = { buildIndexHtml: buildIndexHtml, esc: esc };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.SiteGen = api;
})(typeof window !== "undefined" ? window : this);
