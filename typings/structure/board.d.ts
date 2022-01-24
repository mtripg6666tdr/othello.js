import { GameConfig } from "..";
import { CellNums, CellPoint, StonePutResult, StoneTypes } from "../definition";
import { CellStatus } from "./cellstate";
import { StoneStatus } from "./stonestate";
/**
 * Represents the othello board and a manager of it.
 */
export declare class OthelloBoardManager {
    private _config;
    private _data;
    private _log;
    /**
     * The log of turns
     */
    get putLog(): readonly StonePutResult[];
    /**
     * Initialize the board manager
     * @param _config the game config of the parent game.
     */
    constructor(_config: GameConfig);
    private init;
    /**
     * Returns the status of the specific stone.
     * @param type
     * @returns
     */
    getInfo(type: StoneTypes): StoneStatus;
    /**
     * Represents the stone type of the next turn.
     */
    get nextStone(): StoneTypes;
    private get log();
    /**
     * Puts a stone
     * DO NOT use this method directly. You should call put method of the game class.
     * If not in dry-run and failed, will throw an error.
     * @param config the config of this action
     * @param dryrun If you only check the result of put, true, otherwise false.
     * @returns the result of the action. If in dry-run and failed, false, otherwise, the result object
     * @internal This method cannot use directly by user.
     */
    private put;
    /**
     * Recover the board from the log.
     */
    reset(log: StonePutResult[]): void;
    private setCell;
    /**
     * Returns the cell status of the specified coordinate.
     * @param x x-coordinate of the cell you'd like to know.
     * @param y y-coordinate of the cell you'd like to know.
     * @returns the cell status of the specified coordinate.
     */
    getCell(x: CellNums, y: CellNums): CellStatus;
    private getAroundCells;
    /**
     * Returns the all cell coordinates you can put on.
     * @param current the current turn
     * @returns the array of the complete list of the cells you can put on.
     */
    getAbleToPut(current: StoneTypes): CellPoint[];
    /**
     * Returns a array of the complete list of the cell on the column the specified x-coordinate.
     * @param x x-coordinate
     * @returns a array of the complete list of the cell on the column the specified x-coordinate.
     */
    getColumn(x: CellNums): CellStatus[];
    /**
     * Returns a array of the complete list of the cell on the column the specified y-coordinate.
     * @param y y-coordinate
     * @returns a array of the complete list of the cell on the column the specified y-coordinate.
     */
    getRow(y: CellNums): CellStatus[];
    private getPlusDiagonals;
    private getMinusDiagnals;
    private getLastMover;
    private sumCell;
    private replaceCells;
}
