import { CellStatus } from "./structure/cellstate";
/**
 * Represents stone types
 * black or white
 */
export declare type StoneTypes = "black" | "white";
/**
 * Represents the cell status
 * black: a black stone on the cell
 * white: a white stone on the cell
 * none:  none on the cell
 */
export declare type CellTypes = StoneTypes | "none";
/**
 * Represents one cell location labels, that is on horizonal or vertical axes.
 */
export declare type CellNums = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
/**
 * Represents a coordinate of one cell.
 */
export declare type CellPoint = {
    x: CellNums;
    y: CellNums;
};
/**
 * Represents a config of the othello game.
 */
export declare type GameConfig = {
    /**
     * The player who has a first move.
     */
    firstMove?: StoneTypes;
};
/**
 * Represents a default game config.
 */
export declare const defaultGameConfig: GameConfig;
/**
 * Represents a config of the the action of putting a stone.
 */
export declare type StonePutConfig = {
    /**
     * The x-coordinate of the cell you'd like to put on.
     */
    x: CellNums;
    /**
     * The y-coordinate of the cell you'd like to put on.
     */
    y: CellNums;
    /**
     * The type of the action of putting a stone.
     * If you'd like to put any stone, this will be "put".
     */
    type: "put";
    /**
     * The stone type you'd like to put.
     */
    current: StoneTypes;
} | {
    /**
     * The type of the action of putting a stone.
     * If you'd like to pass this turn, this will be "pass".
     */
    type: "pass";
    /**
     * The stone type you are playing in.
     */
    current: StoneTypes;
};
/**
 * The result of the action of putting a stone.
 */
export declare type StonePutResult = StonePutConfig & {
    /**
     * Represents the winner of the game.
     */
    winner: StoneTypes | null | "draw";
    /**
     * Represents the cells that were changed by you putting stone.
     */
    modified: CellStatus[];
};
