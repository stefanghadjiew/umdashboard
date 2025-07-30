import { Game, Champion } from '../../db/db';
import { Socket } from 'socket.io';

interface Data {
    createdBy: string;
}

export const onCreateGame = async (data : Data, callback: ({gameId} : {gameId : string}) => void, socket: Socket) => {
    const { createdBy } = data;
    if(!createdBy) return;
    try {
        const champions = await Champion.aggregate([{$sample: { size: 25}}]);
        const newGame = await Game.create({ players: [{name: createdBy}], createdBy, status: 'Active', championPool: champions })
        socket.join(newGame._id.toString());
        callback({gameId: newGame._id.toString()})
    } catch (err) {
        throw new Error(`Failed in: onCreateGame with error: ${err}`)
    }
}