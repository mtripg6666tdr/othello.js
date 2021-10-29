type GameStatusBase = {}
export type GamePlayingStatus = GameStatusBase & {
  status: "playing"
}
export type GameReadyStatus = GameStatusBase & {
  status: "ready"
}
export type GameFinishStatus = GameStatusBase & {
  status: "finish"
}
export type GameStatus = GamePlayingStatus | GameReadyStatus | GameFinishStatus;