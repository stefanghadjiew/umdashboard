import { Server, Socket } from "socket.io";
import { 
    onCreateGame,
    onSelectMode, 
    onJoinGame, 
    onSelectTeam, 
    onGetPlayers, 
    onJoinGameboard, 
    onPickChampions, 
    onGetChampions, 
    onGetChampionsAfterRefresh, 
    onExcludeChampionTiers, 
    onBanChampions, 
    onGetCurrentActiveGames,
    onPlayerPickingChampions,
    onPlayerFinalPick,
    onGetFinalPicksByPlayers,
    onResetGame 
} from "./handlers/game";
import { on } from "events";



export enum GAME_ACTIONS {
    CREATE_GAME = 'create-game',
    SELECT_MODE = 'select-mode',
    JOIN_GAME = 'join-game',
    JOIN_TEAM = 'join-team',
    GET_PLAYERS = 'get-players',
    JOIN_GAMEBOARD = 'join-gameboard',
    EXCLUDE_CHAMPION_TIERS = 'exclude-champion-tiers',//only GM
    CHAMPION_TIERS_EXCLUDED ='champion-tiers-excluded',
    PICK_CHAMPIONS = 'pick-champions',
    GET_CHAMPIONS = 'get-champions',
    TEAM_PICKS_UPDATED = 'team-picks-updated',
    GET_TEAM_PICKS_AFTER_REFRESH = 'team-picks-refresh',
    SEND_TEAM_PICKS_AFTER_REFRESH = 'send-team-picks-refresh',
    GET_EXCLUDED_CHAMPIONS = 'get-excluded-champions',
    RECIEVE_EXCLUDED_CHAMPIONS = 'recieve-excluded-champions',
    BAN_CHAMPIONS = 'ban-champions', //only GM
    CHAMPIONS_BANNED = 'champions-banned',
    RESET_GAME = 'reset-game',
    GAME_RESET = 'game-reset',
    GET_CURRENT_ACTIVE_GAMES = 'get-active-games',
    PLAYER_PICKING_CHAMPIONS = 'player-picking-champions',
    CHAMPIONS_PICKED_BY_PLAYER = 'champions-picked-by-player',
    PLAYER_FINAL_PICKED = 'player-final-pick',
    FINAL_PICKS_BY_PLAYERS = 'final-picks-by-players',
    GET_FINAL_PICKS_BY_PLAYERS = 'get-final-picks-by-players',
    START_GAME_REVEAL_PICKS = 'start-game-reveal-picks'
}

export const registerSocketHandlers = (socket: Socket, io: Server) => {

    socket.on(GAME_ACTIONS.CREATE_GAME, async (data, callback) => await onCreateGame(data, callback, socket));
    socket.on(GAME_ACTIONS.SELECT_MODE, async (data) => await onSelectMode(data));
    socket.on(GAME_ACTIONS.GET_CURRENT_ACTIVE_GAMES, async (_, callback) => await onGetCurrentActiveGames(callback));

    // From here we join all players and we can emit events to the specific game(via gameId);
    //TODO: Figure out why after refresh emitting to the gameId doesn't work !!!!
    socket.on(GAME_ACTIONS.JOIN_GAME, async (data, callback) => await onJoinGame(data,callback, socket)); 
    socket.on(GAME_ACTIONS.JOIN_TEAM, async (data, callback) => await onSelectTeam(data, callback));
    socket.on(GAME_ACTIONS.GET_PLAYERS, async ({ gameId }, callback) => await onGetPlayers(gameId, callback));
    socket.on(GAME_ACTIONS.JOIN_GAMEBOARD, async({gameId},callback) => await onJoinGameboard(gameId,callback));
    socket.on(GAME_ACTIONS.EXCLUDE_CHAMPION_TIERS, async({ gameId, excludedTiers }) => await onExcludeChampionTiers(gameId, excludedTiers, io));
    socket.on(GAME_ACTIONS.BAN_CHAMPIONS, async({ gameId, champions }) => await onBanChampions(gameId, champions, io));
    socket.on(GAME_ACTIONS.PLAYER_PICKING_CHAMPIONS, async ({ gameId,champions, player, team }) => await onPlayerPickingChampions(gameId,champions,player,team, io));
    socket.on(GAME_ACTIONS.PLAYER_FINAL_PICKED, async ({ gameId, champion,player, team }) => await onPlayerFinalPick(gameId,champion,player,team, io));
    socket.on(GAME_ACTIONS.GET_FINAL_PICKS_BY_PLAYERS, async({ gameId }) => await onGetFinalPicksByPlayers(gameId, io));
    socket.on(GAME_ACTIONS.RESET_GAME, async({gameId}) => await onResetGame(gameId, io));
    
    //TODO: Probably need to remove this ( and FE part as well )
    socket.on(GAME_ACTIONS.PICK_CHAMPIONS, async (data) => await onPickChampions(data, io));
    socket.on(GAME_ACTIONS.GET_CHAMPIONS, async ({ gameId }, callback) => await onGetChampions(gameId, callback));
    socket.on(GAME_ACTIONS.GET_TEAM_PICKS_AFTER_REFRESH, async({gameId}) => await onGetChampionsAfterRefresh(gameId, socket));
    
}