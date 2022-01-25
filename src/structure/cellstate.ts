import type { CellNums, CellTypes } from "../definition";

/**
 * The status of a cell.
 */
export class CellStatus {
  constructor(public type?:CellTypes, public x?:CellNums, public y?:CellNums){
    //
  }
}