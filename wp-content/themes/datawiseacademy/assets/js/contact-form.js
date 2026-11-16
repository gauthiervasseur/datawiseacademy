/*
 * Static replacement for Contact Form 7.
 * Posts the form to the URL in its `action` attribute (Formspree) and, on success,
 * redirects to the URL in `data-redirect`. Reuses CF7's CSS classes for states
 * (submitting / invalid / failed) so the existing styling still applies.
 */
(function () {
  document.querySelectorAll('form.js-contact-form').forEach(function (form) {
    var output = form.querySelector('.wpcf7-response-output');
    var submit = form.querySelector('[type="submit"]');

    // Preselect the program when arriving from a program page (?program=<slug>).
    var programSlug = new URLSearchParams(window.location.search).get('program');
    if (programSlug) {
      form.querySelectorAll('select option[data-slug]').forEach(function (option) {
        if (option.getAttribute('data-slug') === programSlug) option.selected = true;
      });
    }

    function setState(state, message) {
      form.classList.remove('init', 'submitting', 'invalid', 'failed', 'sent');
      form.classList.add(state);
      form.setAttribute('data-status', state);
      if (output) {
        output.textContent = message || '';
        output.setAttribute('aria-hidden', message ? 'false' : 'true');
      }
    }

    function clearTips() {
      form.querySelectorAll('.wpcf7-not-valid-tip').forEach(function (t) { t.remove(); });
      form.querySelectorAll('.wpcf7-not-valid').forEach(function (f) {
        f.classList.remove('wpcf7-not-valid');
        f.setAttribute('aria-invalid', 'false');
      });
    }

    function validate() {
      clearTips();
      var ok = true;
      form.querySelectorAll('input, textarea, select').forEach(function (field) {
        if (field.type === 'hidden' || field.type === 'submit' || field.name === '_gotcha') return;
        if (field.checkValidity()) return;
        ok = false;
        field.classList.add('wpcf7-not-valid');
        field.setAttribute('aria-invalid', 'true');
        var tip = document.createElement('span');
        tip.className = 'wpcf7-not-valid-tip';
        tip.setAttribute('aria-hidden', 'true');
        tip.textContent = field.validity.typeMismatch
          ? 'Please enter a valid email address.'
          : field.tagName === 'SELECT'
            ? 'Please select an option.'
            : 'Please fill out this field.';
        field.insertAdjacentElement('afterend', tip);
      });
      return ok;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validate()) {
        setState('invalid', 'One or more fields have an error. Please check and try again.');
        return;
      }
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        setState('failed', 'The contact form is not configured yet. Please email us at info@datawiseacademy.com.');
        return;
      }
      setState('submitting');
      if (submit) submit.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          setState('sent', 'Thank you for your message. It has been sent.');
          form.reset();
          if (form.dataset.redirect) window.location.href = form.dataset.redirect;
        })
        .catch(function () {
          setState('failed', 'There was an error trying to send your message. Please try again later or email us at info@datawiseacademy.com.');
        })
        .finally(function () {
          if (submit) submit.disabled = false;
        });
    });
  });
})();
