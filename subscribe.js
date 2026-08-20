/* THETA AUDIO RESEARCH: newsletter subscribe block
   ------------------------------------------------
   Drop <div data-th-subscribe></div> anywhere on a page and include this file.
   Renders a THETA-styled inline form that posts to the Kit newsletter form.

   Optional attributes on the div:
     data-kicker  override the "// MAILING_LIST" label
     data-title   override the headline
     data-blurb   override the one-line description
     data-align   "center" (default) or "left"

   The Kit form has double opt-in on, so the success state tells them to
   confirm. That is deliberate: a stranger typing an address should confirm it.
   ------------------------------------------------ */
(function () {
  var FORM_ID = '9822893';
  var ENDPOINT = 'https://app.kit.com/forms/' + FORM_ID + '/subscriptions';

  var C = {
    gold: '#C8A86B', cream: '#DCCDBF', silver: '#B0B2B7',
    dim: '#81848A', faint: '#6E6764', line: '#3A3534', err: '#C98A7A'
  };

  function el(tag, style, text) {
    var n = document.createElement(tag);
    if (style) n.setAttribute('style', style);
    if (text != null) n.textContent = text;
    return n;
  }

  function build(host) {
    if (host.getAttribute('data-th-built') === '1' && host.firstChild) return;
    host.setAttribute('data-th-built', '1');
    host.textContent = '';
    var align = host.getAttribute('data-align') === 'left' ? 'left' : 'center';
    var kicker = host.getAttribute('data-kicker') || '// MAILING_LIST';
    var title = host.getAttribute('data-title') || 'Release notes from the lab';
    var blurb = host.getAttribute('data-blurb') ||
      'New instruments, free modules, and the occasional note on why something was built the way it was. No schedule, nothing else.';

    host.setAttribute('style', 'width:100%;max-width:760px;margin:0 auto;text-align:' + align +
      ';border-top:1px solid ' + C.line + ';padding-top:44px');

    host.appendChild(el('div', 'font-family:Montserrat,sans-serif;font-size:9px;font-weight:700;letter-spacing:6px;text-transform:uppercase;color:' + C.faint + ';margin-bottom:18px', kicker));
    host.appendChild(el('div', 'font-family:Montserrat,sans-serif;font-weight:300;font-size:22px;letter-spacing:4px;text-transform:uppercase;color:' + C.silver + ';margin-bottom:16px', title));
    host.appendChild(el('p', 'font-family:Montserrat,sans-serif;font-weight:300;font-size:13.5px;line-height:1.85;color:' + C.dim + ';margin:0 0 30px 0;text-wrap:pretty', blurb));

    var form = el('form', 'display:flex;flex-wrap:wrap;gap:14px;justify-content:' + (align === 'left' ? 'flex-start' : 'center'));
    form.setAttribute('novalidate', '');

    var input = el('input', 'flex:1 1 260px;min-width:0;box-sizing:border-box;background:rgba(255,255,255,0.03);border:1px solid ' + C.line + ';color:' + C.silver + ';font-family:Montserrat,sans-serif;font-size:13px;font-weight:300;letter-spacing:1px;padding:18px 16px;outline:none;border-radius:0;appearance:none');
    input.type = 'email';
    input.name = 'email_address';
    input.autocomplete = 'email';
    input.placeholder = 'you@studio.com';
    input.setAttribute('aria-label', 'Email address');
    input.addEventListener('focus', function () { input.style.borderColor = C.gold; });
    input.addEventListener('blur', function () { input.style.borderColor = C.line; });

    var submit = el('button', 'flex:0 0 auto;background:none;border:1px solid ' + C.gold + ';color:' + C.cream + ';font-family:Montserrat,sans-serif;font-weight:700;font-size:10px;letter-spacing:5px;text-transform:uppercase;padding:18px 34px;cursor:pointer;transition:0.3s', 'Subscribe');
    submit.type = 'submit';
    submit.addEventListener('mouseenter', function () { if (!submit.disabled) { submit.style.background = C.gold; submit.style.color = '#0C1519'; } });
    submit.addEventListener('mouseleave', function () { submit.style.background = 'none'; submit.style.color = C.cream; });

    form.appendChild(input);
    form.appendChild(submit);
    host.appendChild(form);

    var note = el('p', 'font-family:Montserrat,sans-serif;font-weight:400;font-size:9px;line-height:1.8;letter-spacing:2px;text-transform:uppercase;color:' + C.faint + ';margin:18px 0 0 0', 'One-click unsubscribe in every email. We never share your address.');
    host.appendChild(note);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        note.textContent = 'That email doesn\u2019t look right';
        note.style.color = C.err;
        input.focus();
        return;
      }
      note.style.color = C.faint;
      submit.textContent = 'Sending\u2026';
      submit.disabled = true;
      submit.style.opacity = '0.6';

      var body = new URLSearchParams();
      body.append('email_address', v);

      fetch(ENDPOINT, { method: 'POST', body: body, mode: 'cors' })
        .catch(function (err) { console.warn('[theta] subscribe failed', err); })
        .then(function () {
          form.remove();
          note.remove();
          host.appendChild(el('div', 'font-family:Montserrat,sans-serif;font-size:9px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:' + C.gold + ';margin-bottom:14px', 'Check your inbox'));
          host.appendChild(el('p', 'font-family:Montserrat,sans-serif;font-weight:300;font-size:13px;line-height:1.85;color:' + C.dim + ';margin:0', 'Confirm your address and you are on the list. Nothing reaches you until you do.'));
        });
    });
  }

  function sweep() {
    var hosts = document.querySelectorAll('[data-th-subscribe]');
    for (var i = 0; i < hosts.length; i++) build(hosts[i]);
  }

  function init() {
    if (window.__thSubscribeInit) return;
    window.__thSubscribeInit = true;
    sweep();
    // hosts arrive later than this script: the template renders after
    // </helmet> mounts, and React may re-render the subtree afterwards.
    if (window.MutationObserver) {
      var pending = false;
      var obs = new MutationObserver(function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () { pending = false; sweep(); });
      });
      var start = function () { obs.observe(document.body, { childList: true, subtree: true }); };
      if (document.body) start();
      else document.addEventListener('DOMContentLoaded', start);
    }
    document.addEventListener('DOMContentLoaded', sweep);
    window.addEventListener('load', sweep);
  }

  init();
})();
