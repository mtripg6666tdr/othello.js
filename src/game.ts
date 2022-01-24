import { CellNums, CellTypes, defaultGameConfig, GameConfig, StonePutConfig, StonePutResult } from "./definition";
import { OthelloBoardManager } from "./structure/board";
import { GameStatus } from "./structure/gamestate";
import { StoneStatus } from "./structure/stonestate";

/**
 * Represents current game event
 */
export type GameEvent = CellTypes|"finish";

/**
 * Main game class
 */
export class Game {
  private _board = null as OthelloBoardManager;
  private _state:GameStatus = {
    status: "ready"
  };
  private _config:GameConfig = null;
  private _listener:((event:GameEvent)=>void)[] = [];
  /**
   * Instantiate game object.
   * @param config configuration of new game
   */
  constructor(config: GameConfig){
    this._config = {...config, ...defaultGameConfig};
    this._board = new OthelloBoardManager(this._config);
  }

  /**
   * Current white stone status
   */
  get white(): StoneStatus {
    return this._board.getInfo("white");
  }

  /**
   * Current black stone status
   */
  get black(): StoneStatus {
    return this._board.getInfo("black");
  }

  /**
   * Current game status
   */
  get state(): GameStatus {
    return this._state;
  }
  
  /**
   * Set current game status  
   * DO NOT USE this accessor in you application.
   */
  set state(value:GameStatus) {
    this._state = value;
  }

  /**
   * Current othello board
   */
  get board(): OthelloBoardManager{
    return this._board;
  }

  /**
   * Put a stone
   * @param config the configuration of this action
   * @returns the result of this action
   */
  put(config: StonePutConfig){
    const result = this._board["put"](config) as StonePutResult;
    this.emit(this._board.nextStone);
    if(result.winner){
      this.emit("finish");
    }
    return result;
  }

  /**
   * Write current board image to console.  
   * You shoudn't use this in production.  
   * You can use this for the debug purpose only.  
   */
  logBoard(){
    console.log("  ０１２３４５６７");
    console.log("  ――――――――");
    for(let y = 0; y < 8; y++){
      const line = y + "|" + [...Array(8)].map((_,x) => {
        const type = this._board.getCell(x as CellNums, y as CellNums).type;
        switch(type){
          case "black": return "●";
          case "white": return "○";
          case "none": return "　";
        }
      }).join("") + "|";
      console.log(line);
    }
    console.log("  ――――――――");
    console.log("Next: " + (this._board.nextStone === "black" ? "●" : "○") + this._board.nextStone);
    console.log("Turn count: " +  this.board.putLog.length);
  }

  /**
   * Add a listener of game event.
   * @param fn the listener you'd like to add.
   */
  addListener(fn:(event:GameEvent)=>void){
    this._listener.push(fn);
  }

  /**
   * Remove a listener of game event.
   * @param fn the listener you'd like to remove.
   * @returns Result of removal. If it's successful, true, otherwise false.
   */
  removeListener(fn:(event:GameEvent)=>void){
    const index = this._listener.findIndex(l => l === fn);
    if(!index) return false;
    this._listener.splice(index, 1);
    return true;
  }

  /**
   * Emit a game event.  
   * You shouldn't use this method.
   * @param event the event you'd like to emit.
   */
  emit(event:GameEvent){
    this._listener.forEach(listener => listener(event));
  }
}