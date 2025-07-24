import { Server, Socket } from "socket.io";
import { onCreateGame } from "./handlers/game/createGame";
import { onSelectMode } from "./handlers/game/selectMode";
import { onJoinGame } from "./handlers/game/joinGame";
import { onSelectTeam } from "./handlers/game/selectTeam";
import { onGetPlayers } from "./handlers/game/getPlayers";
import { onJoinGameboard } from "./handlers/game/joinGameboard";
import { onPickChampions } from "./handlers/game/pickChampions";
import { onGetChampions } from "./handlers/game/getChampions";
import { onGetChampionsAfterRefresh } from "./handlers/game/getChampionsAfterRefresh";
import { onExcludeChampions } from "./handlers/game/excludeChampions";
import { onBanChampions } from "./handlers/game/banChampions";
import { onGetExcludedChampions } from "./handlers/game/getExcludedChampions";

export enum GAME_ACTIONS {
    CREATE_GAME = 'create-game',
    SELECT_MODE = 'select-mode',
    JOIN_GAME = 'join-game',
    JOIN_TEAM = 'join-team',
    GET_PLAYERS = 'get-players',
    JOIN_GAMEBOARD = 'join-gameboard',
    PICK_CHAMPIONS = 'pick-champions',
    GET_CHAMPIONS = 'get-champions',
    TEAM_PICKS_UPDATED = 'team-picks-updated',
    GET_TEAM_PICKS_AFTER_REFRESH = 'team-picks-refresh',
    SEND_TEAM_PICKS_AFTER_REFRESH = 'send-team-picks-refresh',
    EXCLUDE_CHAMPIONS = 'exclude-champions',//only GM
    CHAMPIONS_EXCLUDED ='champions-excluded',
    GET_EXCLUDED_CHAMPIONS = 'get-excluded-champions',
    RECIEVE_EXCLUDED_CHAMPIONS = 'recieve-excluded-champions',
    BAN_CHAMPIONS = 'ban-champions', //only GM
    CHAMPIONS_BANNED = 'champions-banned',
    RESET_GAME = 'reset-game',
    GAME_RESET = 'game-reset'
}

export const registerSocketHandlers = (socket: Socket, io: Server) => {

    socket.on(GAME_ACTIONS.CREATE_GAME, async (data, callback) => await onCreateGame(data, callback, socket));

    socket.on(GAME_ACTIONS.SELECT_MODE, async (data) => await onSelectMode(data));

    socket.on(GAME_ACTIONS.JOIN_GAME, async (data, callback) => await onJoinGame(data,callback, socket));
    socket.on(GAME_ACTIONS.JOIN_TEAM, async (data, callback) => await onSelectTeam(data, callback));
    socket.on(GAME_ACTIONS.GET_PLAYERS, async ({ gameId }, callback) => await onGetPlayers(gameId, callback));
    socket.on(GAME_ACTIONS.JOIN_GAMEBOARD, async(_,callback) => await onJoinGameboard(callback))
    socket.on(GAME_ACTIONS.PICK_CHAMPIONS, async (data) => await onPickChampions(data, io));
    socket.on(GAME_ACTIONS.GET_CHAMPIONS, async ({ gameId }, callback) => await onGetChampions(gameId, callback));
    socket.on(GAME_ACTIONS.GET_TEAM_PICKS_AFTER_REFRESH, async({gameId}) => await onGetChampionsAfterRefresh(gameId, socket))
    socket.on(GAME_ACTIONS.EXCLUDE_CHAMPIONS, async({ gameId, excludedTiers }) => await onExcludeChampions(gameId, excludedTiers, io))
    socket.on(GAME_ACTIONS.GET_EXCLUDED_CHAMPIONS, async({ gameId }) => await onGetExcludedChampions(gameId, socket))
    socket.on(GAME_ACTIONS.BAN_CHAMPIONS, async({ gameId, champions, excludedTiers }) => await onBanChampions(gameId, champions, excludedTiers, io))
    socket.on(GAME_ACTIONS.RESET_GAME, () => { io.emit(GAME_ACTIONS.GAME_RESET) })
}