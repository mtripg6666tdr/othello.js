import { EventEmitter } from "events";
import { defaultGameConfig, GameConfig, StonePutConfig } from "./definition";
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
}