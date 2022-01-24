import { GameConfig } from "..";
import { CellNums, CellPoint, StonePutConfig, StonePutResult, StoneTypes } from "../definition";
import { CellStatus } from "./cellstate";
import { StoneStatus } from "./stonestate";
export declare class OthelloBoardManager {
    private _config;
    private _data;
    private _log;
    get putLog(): readonly StonePutResult[];
    constructor(_config: GameConfig);
    private init;
    getInfo(type: StoneTypes): StoneStatus;
    get nextStone(): StoneTypes;
    get log(): readonly StonePutResult[];
    put(config: StonePutConfig, dryrun?: boolean): StonePutResult | false;
    reset(log: StonePutResult[]): void;
    private setCell;
    getCell(x: CellNums, y: CellNums): CellStatus;
    private getAroundCells;
    getAbleToPut(current: StoneTypes): CellPoint[];
    getColumn(x: CellNums): CellStatus[];
    getRow(y: CellNums): CellStatus[];
    private getPlusDiagonals;
    private getMinusDiagnals;
    private getLastMover;
    private sumCell;
    private replaceCells;
}
