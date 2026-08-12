/* THETA AUDIO RESEARCH: email gate (downloads + launch waitlist)
   ---------------------------------------------------------------
   Two modes, one modal:
     <a data-gate="PLUGIN" href="...dmg">    free download, collects, then releases the file
     <a data-notify="PLUGIN" href="mailto:"> launch waitlist, collects, no file

   Waitlist signups land in Kit with fields[plugin] = "PLUGIN (waitlist)",
   so they can be segmented and mailed when that instrument ships.

   >>> CONNECT YOUR LIST HERE <<<
   Until ENDPOINT is set, submissions are stored in the browser only
   (and the download still works). Run  thetaLeads()  in the browser
   console on this site to download everything collected so far as a
   CSV: nothing is lost while the service is being set up.

   Kit (ConvertKit):  https://app.kit.com/forms/<FORM_ID>/subscriptions
   Buttondown:        https://buttondown.email/api/emails/embed-subscribe/<USERNAME>
   Formspree:         https://formspree.io/f/<FORM_ID>
   --------------------------------------------------------------- */
(function () {
  var CONFIG = {
    ENDPOINT: 'https://app.kit.com/forms/9746211/subscriptions',
    PROVIDER: 'kit',       // 'kit' | 'buttondown' | 'formspree'
    STORAGE: 'theta_lead'
  };

  var C = {
    bg: '#0C1519', panel: '#080F12', line: '#283B28', lineDim: '#3A3534',
    cream: '#DCCDBF', silver: '#B0B2B7', dim: '#81848A',
    green: '#6E9B6E', greenLt: '#A6DCA6', greenDim: '#87B387'
  };

  var CREAM = {
    accent: C.cream, accentLt: C.cream, accentDim: C.cream, line: C.lineDim
  };
  var GREEN = {
    accent: C.green, accentLt: C.greenLt, accentDim: C.greenDim, line: C.line
  };

  var ROLES = ['Composer', 'Mixer / re-recording', 'Sound designer / editor', 'Producer / artist', 'Post supervisor', 'Hobbyist', 'Other'];
  var SOURCES = ['A friend or colleague', 'Instagram', 'YouTube', 'A forum or Reddit', 'Search', 'At work / on a show', 'Other'];

  function el(tag, style, text) {
    var n = document.createElement(tag);
    if (style) n.setAttribute('style', style);
    if (text != null) n.textContent = text;
    return n;
  }

  var LABEL = 'display:block;font-family:Montserrat,sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:' + C.cream + ';opacity:0.75;margin:0 0 8px 0';
  var FIELD = 'width:100%;box-sizing:border-box;background:rgba(255,255,255,0.03);border:1px solid ' + C.lineDim + ';color:' + C.silver + ';font-family:Montserrat,sans-serif;font-size:13px;font-weight:300;letter-spacing:1px;padding:13px 14px;outline:none;border-radius:0;appearance:none';

  function field(labelText, node) {
    var w = el('div', 'margin-bottom:18px;text-align:left');
    var l = el('label', LABEL, labelText);
    l.setAttribute('for', node.id);
    w.appendChild(l); w.appendChild(node);
    return w;
  }

  function select(id, options, placeholder) {
    var s = el('select', FIELD + ';cursor:pointer');
    s.id = id;
    var o0 = el('option', null, placeholder); o0.value = '';
    s.appendChild(o0);
    options.forEach(function (t) { var o = el('option', null, t); o.value = t; s.appendChild(o); });
    s.addEventListener('focus', function () { s.style.borderColor = window.__thAccent || C.green; });
    s.addEventListener('blur', function () { s.style.borderColor = C.lineDim; });
    return s;
  }

  function input(id, type, placeholder) {
    var i = el('input', FIELD);
    i.id = id; i.type = type; i.placeholder = placeholder;
    if (type === 'email') { i.autocomplete = 'email'; i.name = 'email'; }
    if (id === 'th-name') { i.autocomplete = 'given-name'; i.name = 'first_name'; }
    i.addEventListener('focus', function () { i.style.borderColor = window.__thAccent || C.green; });
    i.addEventListener('blur', function () { i.style.borderColor = C.lineDim; });
    return i;
  }

  // ---- storage -------------------------------------------------
  function leads() {
    try { return JSON.parse(localStorage.getItem('theta_leads') || '[]'); } catch (e) { return []; }
  }
  function saveLead(rec) {
    try {
      var all = leads(); all.push(rec);
      localStorage.setItem('theta_leads', JSON.stringify(all));
      localStorage.setItem(CONFIG.STORAGE, JSON.stringify({ email: rec.email, first_name: rec.first_name, role: rec.role, source: rec.source }));
    } catch (e) {}
  }
  function waitlisted(plugin) {
    try { return (JSON.parse(localStorage.getItem('theta_waitlist') || '[]')).indexOf(plugin) > -1; } catch (e) { return false; }
  }
  function addWaitlist(plugin) {
    try {
      var all = JSON.parse(localStorage.getItem('theta_waitlist') || '[]');
      if (all.indexOf(plugin) < 0) all.push(plugin);
      localStorage.setItem('theta_waitlist', JSON.stringify(all));
    } catch (e) {}
  }
  function known() {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE) || 'null'); } catch (e) { return null; }
  }

  window.thetaLeads = function () {
    var all = leads();
    if (!all.length) { console.log('No leads stored yet.'); return; }
    var cols = ['date', 'email', 'first_name', 'role', 'source', 'plugin'];
    var csv = cols.join(',') + '\n' + all.map(function (r) {
      return cols.map(function (c) { return '"' + String(r[c] == null ? '' : r[c]).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'theta-leads-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    console.log(all.length + ' lead(s) exported.');
    return all;
  };

  // ---- submit --------------------------------------------------
  function send(rec) {
    if (!CONFIG.ENDPOINT) return Promise.resolve();
    var body;
    if (CONFIG.PROVIDER === 'buttondown') {
      body = new URLSearchParams({ email: rec.email });
    } else if (CONFIG.PROVIDER === 'formspree') {
      body = new URLSearchParams({
        email: rec.email, first_name: rec.first_name,
        role: rec.role, source: rec.source, plugin: rec.plugin
      });
    } else {
      body = new URLSearchParams();
      body.append('email_address', rec.email);
      body.append('fields[first_name]', rec.first_name);
      if (rec.role) body.append('fields[role]', rec.role);
      if (rec.source) body.append('fields[source]', rec.source);
      body.append('fields[plugin]', rec.plugin);
    }
    return fetch(CONFIG.ENDPOINT, { method: 'POST', body: body, mode: 'cors' })
      .catch(function (e) { console.warn('[theta] list submit failed, lead kept locally', e); });
  }

  // ---- the file ------------------------------------------------
  function deliver(href) {
    var a = document.createElement('a');
    a.href = href; a.download = ''; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---- modal ---------------------------------------------------
  function openGate(plugin, href, notify) {
    if (document.querySelector('[data-th-gate-overlay]')) return;
    var prior = known();
    var T = notify ? CREAM : GREEN;
    window.__thAccent = T.accent;

    var overlay = el('div', 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:2000;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;overflow-y:auto;animation:thGateIn 0.25s ease');
    overlay.setAttribute('data-th-gate-overlay', '');
    var panel = el('div', 'background:' + C.panel + ';border:1px solid ' + T.line + ';max-width:460px;width:100%;padding:38px 36px;box-sizing:border-box;text-align:center;position:relative;margin:auto');

    var close = el('button', 'position:absolute;top:12px;right:14px;background:none;border:none;color:' + C.dim + ';font-size:20px;line-height:1;cursor:pointer;padding:6px;font-family:Montserrat,sans-serif', '\u00d7');
    close.setAttribute('aria-label', 'Close');
    panel.appendChild(close);

    panel.appendChild(el('div', 'font-family:Montserrat,sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:' + T.accentDim + ';opacity:' + (notify ? '0.7' : '1') + ';margin-bottom:12px', notify ? 'Launch Notice' : 'Free Download'));
    panel.appendChild(el('h2', 'font-family:Montserrat,sans-serif;font-weight:300;font-size:26px;letter-spacing:8px;text-transform:uppercase;color:' + T.accentLt + ';margin:0 0 10px 0', plugin));
    panel.appendChild(el('p', 'font-family:Montserrat,sans-serif;font-weight:300;font-size:12px;line-height:1.8;color:' + C.dim + ';margin:0 0 28px 0',
      notify ? 'We\u2019ll email you the moment it ships, and your welcome note carries the THETA instruments that are already free.'
             : 'Tell us where to send it. No account, no unlock, the download starts immediately.'));

    var form = el('form', 'display:block');
    var name = input('th-name', 'text', 'Jordan');
    var email = input('th-email', 'email', 'you@studio.com');
    var role = select('th-role', ROLES, 'Optional');
    var src = select('th-src', SOURCES, 'Optional');

    if (prior) { name.value = prior.first_name || ''; email.value = prior.email || ''; if (prior.role) role.value = prior.role; if (prior.source) src.value = prior.source; }

    form.appendChild(field('First name', name));
    form.appendChild(field('Email', email));
    form.appendChild(field('What do you do?', role));
    form.appendChild(field('How did you hear about THETA?', src));

    var err = el('p', 'font-family:Montserrat,sans-serif;font-size:10px;letter-spacing:2px;color:#C98A7A;margin:0 0 14px 0;display:none;text-transform:uppercase;font-weight:700');
    form.appendChild(err);

    var submit = el('button', 'width:100%;background:none;border:1px solid ' + T.accent + ';color:' + T.accentLt + ';font-family:Montserrat,sans-serif;font-weight:700;font-size:11px;letter-spacing:5px;text-transform:uppercase;padding:19px;cursor:pointer;transition:0.3s', notify ? 'Notify me at launch' : 'Get the download');
    submit.type = 'submit';
    submit.addEventListener('mouseenter', function () { submit.style.background = T.accent; submit.style.color = '#000'; });
    submit.addEventListener('mouseleave', function () { submit.style.background = 'none'; submit.style.color = T.accentLt; });
    form.appendChild(submit);

    form.appendChild(el('p', 'font-family:Montserrat,sans-serif;font-weight:400;font-size:10px;line-height:1.75;letter-spacing:1px;color:' + C.dim + ';margin:18px 0 0 0', notify ? 'You\u2019ll join the THETA mailing list for release notes and new instruments. One-click unsubscribe in every email; we never share your address.'
             : 'By downloading you\u2019ll join the THETA mailing list for release notes and new instruments. One-click unsubscribe in every email; we never share your address.'));

    panel.appendChild(form);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    setTimeout(function () { (prior ? submit : name).focus(); }, 60);

    function shut() {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    }
    function onKey(e) { if (e.key === 'Escape') shut(); }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    close.addEventListener('click', shut);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) shut(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = email.value.trim();
      if (!name.value.trim()) { err.textContent = 'First name, please'; err.style.display = 'block'; name.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { err.textContent = 'That email doesn\u2019t look right'; err.style.display = 'block'; email.focus(); return; }
      err.style.display = 'none';
      submit.textContent = 'Sending\u2026'; submit.disabled = true; submit.style.opacity = '0.6';

      var rec = {
        date: new Date().toISOString(), email: v, first_name: name.value.trim(),
        role: role.value, source: src.value,
        plugin: notify ? plugin + ' (waitlist)' : plugin
      };
      saveLead(rec);
      if (notify) addWaitlist(plugin);

      send(rec).then(function () {
        if (!notify) deliver(href);
        panel.innerHTML = '';
        panel.appendChild(close);
        panel.appendChild(el('div', 'font-family:Montserrat,sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:' + T.accentDim + ';opacity:' + (notify ? '0.7' : '1') + ';margin-bottom:14px', notify ? 'On the list' : 'Downloading'));
        panel.appendChild(el('h2', 'font-family:Montserrat,sans-serif;font-weight:300;font-size:26px;letter-spacing:8px;text-transform:uppercase;color:' + T.accentLt + ';margin:0 0 14px 0', plugin));
        panel.appendChild(el('p', 'font-family:Montserrat,sans-serif;font-weight:300;font-size:12px;line-height:1.8;color:' + C.dim + ';margin:0 0 26px 0',
          notify ? 'You\u2019ll hear from us the moment it ships. Check your inbox and confirm your email so the notice can reach you.'
                 : 'Your download has started. Check your inbox and confirm your email so we can send you release notes, the plug-in is yours either way.'));
        var again;
        if (notify) {
          again = el('a', 'display:block;border:1px solid ' + C.green + ';color:' + C.greenLt + ';font-family:Montserrat,sans-serif;font-weight:700;font-size:10px;letter-spacing:4px;text-transform:uppercase;padding:16px;text-decoration:none', 'Some of the lab is free today');
          again.href = 'free.html';
        } else {
          again = el('a', 'display:block;border:1px solid ' + C.green + ';color:' + C.greenLt + ';font-family:Montserrat,sans-serif;font-weight:700;font-size:10px;letter-spacing:4px;text-transform:uppercase;padding:16px;text-decoration:none', 'Download didn\u2019t start? Click here');
          again.href = href; again.setAttribute('download', '');
        }
        panel.appendChild(again);
      });
    });
  }

  // ---- wire up -------------------------------------------------
  function init() {
    if (window.__thGateInit) return;
    window.__thGateInit = true;
    if (!document.getElementById('th-gate-anim')) {
      var st = el('style'); st.id = 'th-gate-anim';
      st.textContent = '@keyframes thGateIn{from{opacity:0}to{opacity:1}}';
      document.head.appendChild(st);
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-gate],a[data-notify]');
      if (!a) return;
      e.preventDefault();
      var n = a.hasAttribute('data-notify');
      openGate(a.getAttribute(n ? 'data-notify' : 'data-gate'), a.getAttribute('href'), n);
    }, true);

    // a visitor who already signed up sees that reflected on the button
    function markWaitlisted() {
      var list = document.querySelectorAll('a[data-notify]');
      for (var i = 0; i < list.length; i++) {
        if (waitlisted(list[i].getAttribute('data-notify'))) {
          list[i].textContent = 'YOU\u2019RE ON THE LIST';
          list[i].style.opacity = '0.55';
        }
      }
    }
    markWaitlisted();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
