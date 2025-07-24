import type { Socket } from 'socket.io-client';

import type { GAME_ACTIONS } from 'pages/GameAction';

export const useAsyncEmits = () => (socket: Socket, action: GAME_ACTIONS, data?: any) =>
  new Promise((resolve, reject) => {
    socket.emit(action, data, (response: any) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });
