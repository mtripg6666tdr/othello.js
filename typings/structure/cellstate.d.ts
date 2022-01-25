import type { CellNums, CellTypes } from "../definition";
/**
 * The status of a cell.
 */
export declare class CellStatus {
    type?: CellTypes;
    x?: CellNums;
    y?: CellNums;
    constructor(type?: CellTypes, x?: CellNums, y?: CellNums);
}
