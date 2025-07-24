import { Game } from '../../db/db';


type Data = {
    gameId: string;
    player: string;
    team: 'Team1' | 'Team2';
}

export const onSelectTeam = async (data: Data, callback: ({error}: { error?: string }) => void) => {
    const { gameId,player,team } = data;
    try {
        const currentGame = await Game.findById(gameId)
        if(!currentGame) return callback({error: 'Game not found!'});
        
        const currentPlayer = currentGame.players.find((p) => p.name === player);
        if(!currentPlayer) return callback({error: 'Current player not found !'})
        const currentTeamPlayers = currentGame.players.filter((p) => p.team === team);
        
        if(currentTeamPlayers.length === 2) return callback({error: 'Current team is full !'})
        if(currentPlayer?.team === team) return;
        
        currentPlayer.team = team;
        await currentGame.save();
    } catch (err) {
        throw new Error(`Failed in: onSelectTeam with error: ${err}` )
    }

}