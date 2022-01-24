import { CellStatus } from "./structure/cellstate";
export declare type StoneTypes = "black" | "white";
export declare type CellTypes = StoneTypes | "none";
export declare type CellNums = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare type CellPoint = {
    x: CellNums;
    y: CellNums;
};
export declare type GameConfig = {
    firstMove?: StoneTypes;
};
export declare const defaultGameConfig: GameConfig;
export declare type StonePutConfig = {
    x: CellNums;
    y: CellNums;
    type: "put";
    current: StoneTypes;
} | {
    type: "pass";
    current: StoneTypes;
};
export declare type StonePutResult = StonePutConfig & {
    winner: StoneTypes | null | "draw";
    modified: CellStatus[];
};
