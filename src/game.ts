import { EventEmitter } from "events";
import { CellNums, defaultGameConfig, GameConfig, StonePutConfig } from "./definition";
import { OthelloBoardManager } from "./structure/board";
import { GameStatus } from "./structure/gamestate";
import { StoneStatus } from "./structure/stonestate";

export class Game extends EventEmitter {
  private _board = null as OthelloBoardManager;
  private _state:GameStatus = {
    status: "finish"
  };
  private _config:GameConfig = null;
  constructor(config: GameConfig){
    super();
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
    this._board.put(config);
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
}