/**
 * Represents the common properties of the game status.
 */
type GameStatusBase = {}

/**
 * Represents the game is now played.
 */
export type GamePlayingStatus = GameStatusBase & {
  status: "playing"
}

/**
 * Represents the game is now ready.
 */
export type GameReadyStatus = GameStatusBase & {
  status: "ready"
}

/**
 * Represents the game is now finished.
 */
export type GameFinishStatus = GameStatusBase & {
  status: "finish"
}

/**
 * Represents the game status.
 */
export type GameStatus = GamePlayingStatus | GameReadyStatus | GameFinishStatus;