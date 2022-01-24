import { CellTypes, GameConfig, StonePutConfig, StonePutResult } from "./definition";
import { OthelloBoardManager } from "./structure/board";
import { GameStatus } from "./structure/gamestate";
import { StoneStatus } from "./structure/stonestate";
/**
 * Represents current game event
 */
export declare type GameEvent = CellTypes | "finish";
/**
 * Main game class
 */
export declare class Game {
    private _board;
    private _state;
    private _config;
    private _listener;
    /**
     * Instantiate game object.
     * @param config configuration of new game
     */
    constructor(config: GameConfig);
    /**
     * Current white stone status
     */
    get white(): StoneStatus;
    /**
     * Current black stone status
     */
    get black(): StoneStatus;
    /**
     * Current game status
     */
    get state(): GameStatus;
    /**
     * Set current game status
     * DO NOT USE this accessor in you application.
     */
    set state(value: GameStatus);
    /**
     * Current othello board
     */
    get board(): OthelloBoardManager;
    /**
     * Put a stone
     * @param config the configuration of this action
     * @returns the result of this action
     */
    put(config: StonePutConfig): StonePutResult;
    /**
     * Write current board image to console.
     * You shoudn't use this in production.
     * You can use this for the debug purpose only.
     */
    logBoard(): void;
    /**
     * Add a listener of game event.
     * @param fn the listener you'd like to add.
     */
    addListener(fn: (event: GameEvent) => void): void;
    /**
     * Remove a listener of game event.
     * @param fn the listener you'd like to remove.
     * @returns Result of removal. If it's successful, true, otherwise false.
     */
    removeListener(fn: (event: GameEvent) => void): boolean;
    /**
     * Emit a game event.
     * You shouldn't use this method.
     * @param event the event you'd like to emit.
     */
    emit(event: GameEvent): void;
}
