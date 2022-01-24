declare type GameStatusBase = {};
export declare type GamePlayingStatus = GameStatusBase & {
    status: "playing";
};
export declare type GameReadyStatus = GameStatusBase & {
    status: "ready";
};
export declare type GameFinishStatus = GameStatusBase & {
    status: "finish";
};
export declare type GameStatus = GamePlayingStatus | GameReadyStatus | GameFinishStatus;
export {};
