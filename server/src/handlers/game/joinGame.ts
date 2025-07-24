import { Game } from '../../db/db';
import { Socket } from 'socket.io';

type Data = {
    gameId: string;
    player: string;
}

type ModeType = '1vs1' | '2vs2' | null | undefined;

type ModeCallback = (args: { mode: ModeType }) => void;

export const onJoinGame = async (data: Data, callback: ModeCallback, socket: Socket) => {
    const { gameId, player } = data;
    try {
        const currentGame = await Game.findById(gameId)
        if(!currentGame) return;
        currentGame?.players.push({name: player});
        await currentGame?.save();
        socket.join(gameId);
        callback({mode: currentGame?.mode})
    } catch (err) {
        throw new Error(`There was a problem creating a new game: ${err}`)
    }
}