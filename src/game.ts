import { CellNums, CellTypes, defaultGameConfig, GameConfig, StonePutConfig, StonePutResult } from "./definition";
import { OthelloBoardManager } from "./structure/board";
import { GameStatus } from "./structure/gamestate";
import { StoneStatus } from "./structure/stonestate";

export type GameEvent = CellTypes|"finish";
export class Game {
  private _board = null as OthelloBoardManager;
  private _state:GameStatus = {
    status: "ready"
  };
  private _config:GameConfig = null;
  private _listener:((event:GameEvent)=>void)[] = [];
  constructor(config: GameConfig){
    this._config = {...config, ...defaultGameConfig};
    this._board = new OthelloBoardManager(this._config);
  }
  get white(): StoneStatus {
    return this._board.getInfo("white");
  }
  get black(): StoneStatus {
    return this._board.getInfo("black");
  }
  get state(): GameStatus {
    return this._state;
  }
  set state(value:GameStatus) {
    this._state = value;
  }
  get board(): OthelloBoardManager{
    return this._board;
  }
  put(config: StonePutConfig){
    const result = this._board.put(config) as StonePutResult;
    this.emit(this._board.nextStone);
    if(result.winner){
      this.emit("finish");
    }
    return result;
  }
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
    console.log("Turn count: " +  this.board.log.length);
  }
  addListener(fn:(event:GameEvent)=>void){
    this._listener.push(fn);
  }
  removeListener(fn:(event:GameEvent)=>void){
    const index = this._listener.findIndex(l => l === fn);
    if(!index) return false;
    this._listener.splice(index, 1);
    return true;
  }
  emit(event:GameEvent){
    this._listener.forEach(listener => listener(event));
  }
}