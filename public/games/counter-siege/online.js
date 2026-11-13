(() => {
  const gameId = 'counter-siege';
  const messageTypes = new Set([
    `${gameId}:solo`,
    `${gameId}:enable`,
    `${gameId}:state`,
    `${gameId}:remote-input`,
    `${gameId}:pause`,
    `${gameId}:resume`,
  ]);
  let parentOrigin;

  try {
    parentOrigin = document.referrer ? new URL(document.referrer).origin : window.location.origin;
  } catch {
    parentOrigin = window.location.origin;
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== parentOrigin
      || !event.data || !messageTypes.has(event.data.type)) return;
    window.dispatchEvent(new CustomEvent(`${gameId}:bridge-message`, { detail: event.data }));
  });
})();
