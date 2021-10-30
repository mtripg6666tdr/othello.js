import { CellStatus } from "./structure/cellstate";

export type StoneTypes = "black"|"white";
export type CellTypes = StoneTypes|"none";
export type CellNums = 0|1|2|3|4|5|6|7;
export type CellPoint = {x: CellNums, y: CellNums};

export type GameConfig = {
  firstMove?:StoneTypes;
}
export const defaultGameConfig = {
  firstMove: "white"
} as GameConfig;

export type StonePutConfig = {
  x: CellNums;
  y: CellNums;
  type: "put";
  current:StoneTypes;
} | {
  type: "pass";
  current:StoneTypes;
}
export type StonePutResult = StonePutConfig & {
  winner: StoneTypes|null|"draw";
  modified: CellStatus[];
}