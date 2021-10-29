import { CellNums, CellTypes } from "../definition";

export class CellStatus {
  constructor(public type:CellTypes, public x:CellNums, public y:CellNums){
    //
  }
}