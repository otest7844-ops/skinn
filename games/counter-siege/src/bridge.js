const namespace = 'counter-siege';
const protocolVersion = 1;

function getParentOrigin() {
  try {
    return document.referrer ? new URL(document.referrer).origin : window.location.origin;
  } catch {
    return window.location.origin;
  }
}

class CounterSiegeBridge {
  constructor() {
    this.parentOrigin = getParentOrigin();
    this.game = null;
    window.addEventListener('message', (event) => this.handleMessage(event));
    window.addEventListener(`${namespace}:bridge-message`, (event) => {
      this.handleMessageData(event.detail);
    });
  }

  setGame(game) {
    this.game = game;
    this.post(`${namespace}:ready`, {
      protocol: protocolVersion,
      capabilities: ['solo', 'room', 'action', 'sync', 'pause', 'leave']
    });
  }

  post(type, data = {}) {
    if (window.parent === window) return;
    window.parent.postMessage({ type, ...data }, this.parentOrigin);
  }

  sendPacket(packet) {
    if (packet.type === 'state') {
      this.post(`${namespace}:state`, { state: packet });
    } else {
      this.post(`${namespace}:input`, { input: packet });
    }
  }

  sendPause(paused) {
    this.post(`${namespace}:pause`, { paused });
  }

  sendLeave() {
    this.post(`${namespace}:leave`);
  }

  handleMessage(event) {
    if (event.source !== window.parent || event.origin !== this.parentOrigin) return;
    if (typeof event.data?.type === 'string'
      && event.data.type.startsWith(`${namespace}:`)) return;
    this.handleMessageData(event.data);
  }

  handleMessageData(message) {
    if (!message || typeof message.type !== 'string') return;

    if (message.type.startsWith(`${namespace}:`)) {
      const type = message.type.slice(namespace.length + 1);
      switch (type) {
        case 'solo':
          this.game?.startSolo();
          return;
        case 'enable':
          this.game?.network.startExternalMatch(message.slot === 0 ? 'host' : 'guest');
          return;
        case 'remote-input':
          if (message.input && typeof message.input.type === 'string') {
            this.game?.network.handlePacket(message.input);
          }
          return;
        case 'state':
          if (message.state && typeof message.state.type === 'string') {
            this.game?.network.handlePacket(message.state);
          }
          return;
        case 'pause':
          this.game?.setPaused(true);
          return;
        case 'resume':
          this.game?.setPaused(false);
          return;
        default:
          return;
      }
    }

    if (message.namespace !== namespace) return;

    switch (message.type) {
      case 'start':
        if (message.mode === 'solo') {
          this.game?.startSolo();
        } else if (message.mode === 'room') {
          this.game?.network.startExternalMatch(message.role);
        }
        break;
      case 'action':
      case 'sync':
        if (message.packet && typeof message.packet.type === 'string') {
          this.game?.network.handlePacket(message.packet);
        }
        break;
      case 'pause':
        if (typeof message.paused === 'boolean') this.game?.setPaused(message.paused);
        break;
      case 'leave':
        this.game?.returnToMenu(false);
        break;
      default:
        break;
    }
  }
}

export const bridge = new CounterSiegeBridge();
