import { Game } from '../../db/db';

type Payload = {
    gameId: string;
    mode: '1vs1' | '2vs2';
}

let cachedMode: Payload['mode'];

export const onSelectMode = async (payload : Payload) => {
    const { mode } = payload;
    if(cachedMode === mode) {
        return;
    } else {
        await assignMode(payload);
    }
    
}

const assignMode = async (payload : Payload) => {
    const { gameId, mode } = payload;
    try {
        const currentGame = await Game.findById(gameId);
        cachedMode = mode;
        if(currentGame) {
            currentGame.mode = mode;
            await currentGame.save();
        }
    } catch(err) {
        throw new Error(`Failed in: onSelectMode with error: ${err}`)
    }
}