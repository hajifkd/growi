import { Container } from 'unstated';

import io from 'socket.io-client';

import loggerFactory from '~/utils/logger';

const logger = loggerFactory('growi:cli:SocketIoContainer');

/**
 * Service container related to options for WebSocket
 * @extends {Container} unstated Container
 */
export default class SocketIoContainer extends Container {

  constructor(appContainer, namespace) {
    super();

    this.appContainer = appContainer;
    this.appContainer.registerContainer(this);

    const ns = namespace || '/';

    this.socket = io(ns, {
      transports: ['websocket'],
    });

    this.socket.on('connect_error', (error) => {
      logger.error(error);
    });
    this.socket.on('error', (error) => {
      logger.error(error);
    });

    this.state = {
    };

  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'SocketIoContainer';
  }

  getSocket() {
    return this.socket;
  }

}
