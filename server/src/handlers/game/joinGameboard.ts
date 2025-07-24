import { Champion } from '../../db/db';

export const onJoinGameboard = async ( callback: Function) => {
    try {
        const champions = await Champion.find();
        if(!champions) throw new Error('No champions found!')
        return callback({champions})
    } catch (err) {
        throw new Error(`Failed in: onJoinGameboard with error: ${err}`)
    }
} 