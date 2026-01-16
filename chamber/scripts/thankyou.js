   function getQueryParam(name) {
      const params = new URLSearchParams(window.location.search);
      return params.get(name) || '';
    }

    document.getElementById('currentyear').textContent = new Date().getFullYear();

    document.getElementById('out-firstname').textContent = getQueryParam('firstname');
    document.getElementById('out-lastname').textContent = getQueryParam('lastname');
    document.getElementById('out-email').textContent = getQueryParam('email');
    document.getElementById('out-phone').textContent = getQueryParam('phone');
    document.getElementById('out-organization').textContent = getQueryParam('organization');

    const ts = getQueryParam('timestamp');

    let formatted = ts;
    if (ts) {
      try {
        const d = new Date(ts);
        if (!isNaN(d)) formatted = d.toLocaleString();
      } catch (e) {}
    }
    document.getElementById('out-timestamp').textContent = formatted;