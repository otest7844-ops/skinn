(() => {
  const allowedTypes = new Set(['ghasaq:enable', 'ghasaq:state', 'ghasaq:remote-input', 'ghasaq:pause', 'ghasaq:resume']);
  window.ghasaqNetwork = {
    send(input) {
      window.parent.postMessage({ type: 'ghasaq:input', input }, window.location.origin);
    },
  };
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin
      || !event.data || !allowedTypes.has(event.data.type)) return;
    window.dispatchEvent(new CustomEvent('ghasaq:network', { detail: event.data }));
  });
})();
