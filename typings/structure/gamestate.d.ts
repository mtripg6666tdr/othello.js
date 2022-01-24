/**
 * Represents the common properties of the game status.
 */
declare type GameStatusBase = {};
/**
 * Represents the game is now played.
 */
export declare type GamePlayingStatus = GameStatusBase & {
    status: "playing";
};
/**
 * Represents the game is now ready.
 */
export declare type GameReadyStatus = GameStatusBase & {
    status: "ready";
};
/**
 * Represents the game is now finished.
 */
export declare type GameFinishStatus = GameStatusBase & {
    status: "finish";
};
/**
 * Represents the game status.
 */
export declare type GameStatus = GamePlayingStatus | GameReadyStatus | GameFinishStatus;
export {};
