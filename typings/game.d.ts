import { CellTypes, GameConfig, StonePutConfig, StonePutResult } from "./definition";
import { OthelloBoardManager } from "./structure/board";
import { GameStatus } from "./structure/gamestate";
import { StoneStatus } from "./structure/stonestate";
export declare type GameEvent = CellTypes | "finish";
export declare class Game {
    private _board;
    private _state;
    private _config;
    private _listener;
    constructor(config: GameConfig);
    get white(): StoneStatus;
    get black(): StoneStatus;
    get state(): GameStatus;
    set state(value: GameStatus);
    get board(): OthelloBoardManager;
    put(config: StonePutConfig): StonePutResult;
    logBoard(): void;
    addListener(fn: (event: GameEvent) => void): void;
    removeListener(fn: (event: GameEvent) => void): boolean;
    emit(event: GameEvent): void;
}
