import { GameConfig } from "..";
import { CellNums, CellPoint, CellTypes, StonePutConfig, StonePutResult, StoneTypes } from "../definition";
import { CellStatus } from "./cellstate";
import { StoneStatus } from "./stonestate";

/* 
  初期状態
    0 1 2 3 4 5 6 7
  0
  1
  2
  3       o x
  4       x o
  5
  6
  7
 */

  /**
   * Represents the othello board and a manager of it.
   */
export class OthelloBoardManager {
  private _data = null as CellStatus[][];
  private _log = [] as StonePutResult[];

  /**
   * The log of turns
   */
  get putLog(): readonly StonePutResult[] {
    return this._log;
  }

  /**
   * Initialize the board manager
   * @param _config the game config of the parent game.
   */
  constructor(private _config:GameConfig) {
    this.init();
  }

  private init(){
    this._data = [...Array(8)].map((_, x) => [...Array(8)].map((_, y) => new CellStatus("none", x as CellNums, y as CellNums)));
    this
      .setCell("black", {x: 3, y: 3}, {x: 4, y: 4})
      .setCell("white", {x: 3, y: 4}, {x: 4, y: 3})
      ;
  }

  /**
   * Returns the status of the specific stone.
   * @param type 
   * @returns 
   */
  getInfo(type:StoneTypes):StoneStatus{
    return new StoneStatus(this.sumCell(cell => cell.type === type));
  }

  /**
   * Represents the stone type of the next turn.
   */
  get nextStone():StoneTypes{
    return this.getLastMover() === "black" ? "white" : "black";
  }

  private get log():readonly StonePutResult[]{
    return this._log;
  }

  /**
   * Puts a stone  
   * DO NOT use this method directly. You should call put method of the game class.  
   * If not in dry-run and failed, will throw an error.
   * @param config the config of this action
   * @param dryrun If you only check the result of put, true, otherwise false.
   * @returns the result of the action. If in dry-run and failed, false, otherwise, the result object
   * @internal This method cannot use directly by user.
   */
  private put(config:StonePutConfig, dryrun:boolean = false):StonePutResult|false{
    if(this.log[this.log.length - 1] && this.log[this.log.length - 1].winner){
      if(dryrun){
        return false;
      }
      throw new Error("the game has already finished");
    }
    let winner = null as StoneTypes|null|"draw";
    const modified = [] as CellStatus[];
    if(config.type === "put"){
      const target = this.getCell(config.x, config.y);
      if(!dryrun && this.getLastMover() === config.current){
        // ２ユーザー連続
        throw new Error("two consecutive mover");
      }else if(target.type !== "none"){
        // すでに置かれているセル
        if(dryrun) return false;
        throw new Error("the cell has already been put a stone on");
      }
      const arrounds = this.getAroundCells(config.x, config.y);
      if(arrounds.length === 0){
        // まわりに石がないセル
        if(dryrun) return false;
        throw new Error("the cell surrounded by no stone");
      }else if(arrounds.filter(c => c.type !== target.type).length === 0){
        // まわりに種類の異なる(裏されうる)石がないセル
        if(dryrun) return false;
        throw new Error("the cell surrounded by no stone of the other type");
      }
      
      const turnCells = {
        row: false,
        column: false,
        plusdiagonal: false,
        minusdiagonal: false
      };
      const cellsCache = {
        row: null as CellStatus[],
        column: null as CellStatus[],
        plusdiagonal: null as CellStatus[],
        minusdiagonal: null as CellStatus[]
      }
      // 横方向
      const row = cellsCache.row = this.getRow(config.y)
      turnCells.row = this.replaceCells(config, config.x, row, "plus")
                    || this.replaceCells(config, config.x, row, "minus");
      // 縦方向
      const column = cellsCache.column = this.getColumn(config.x);
      turnCells.column = this.replaceCells(config, config.y, column, "plus")
                      || this.replaceCells(config, config.y, column, "minus");
      // +斜め方向
      const plusdiagonal = cellsCache.plusdiagonal = this.getPlusDiagonals(config);
      turnCells.plusdiagonal = this.replaceCells(config, plusdiagonal.findIndex(cell => config.x === cell.x) as CellNums, plusdiagonal, "plus")
                            || this.replaceCells(config, plusdiagonal.findIndex(cell => config.x === cell.x) as CellNums, plusdiagonal, "minus");
      // -斜め方向
      const minusdiagonal = cellsCache.minusdiagonal = this.getMinusDiagnals(config);
      turnCells.minusdiagonal = this.replaceCells(config, minusdiagonal.findIndex(cell => config.x === cell.x) as CellNums, minusdiagonal, "plus")
                              || this.replaceCells(config, minusdiagonal.findIndex(cell => config.x === cell.x) as CellNums, minusdiagonal, "minus");
      // 全体で裏返す部分あるか
      const existsTurnCell = turnCells.row || turnCells.column || turnCells.plusdiagonal || turnCells.minusdiagonal;
      // なければ
      if(!existsTurnCell){
        if(dryrun) return false;
        throw new Error("no cell to turn");
      }
      // 裏返しを反映
      if(!dryrun){
        (["row", "column", "plusdiagonal", "minusdiagonal"] as (keyof typeof turnCells)[]).forEach(direction => {
          if(turnCells[direction]){
            cellsCache[direction].forEach(cell => {
              if(this.getCell(cell.x, cell.y) !== cell){
                this._data[cell.x][cell.y] = cell;
                modified.push(cell);
              }
            });
          }
        });
        this.setCell(config.current, config);
      }
    }
    if(this.sumCell(cell => cell.type === "none") === 0 || (!dryrun && this.getAbleToPut("black").length + this.getAbleToPut("white").length === 0)){
      const white = this.sumCell(cell => cell.type === "white");
      const black = this.sumCell(cell => cell.type === "black");
      winner = white > black ? "white" : white === black ? "draw" : white < black ? "black" : null;
    }
    const result:StonePutResult = {
      ...config,
      winner,
      modified
    };
    if(!dryrun){
      this._log.push(result);
    }
    return result;
  }

  /**
   * Recover the board from the log.
   */
  reset(log:StonePutResult[]){
    this.init();
    log.forEach(l => {
      if(l.type === "pass"){
        this.put({
          type: l.type,
          current: l.current,
        });
      }else{
        this.put({
          type: l.type,
          current: l.current,
          x: l.x, y: l.y
        })
      }
    })
  }

  private setCell(type: CellTypes, ...positions: {x: CellNums, y: CellNums}[]){
    positions.forEach(p => {
      this._data[p.x][p.y] = new CellStatus(type, p.x, p.y);
    });
    return this;
  }

  /**
   * Returns the cell status of the specified coordinate.
   * @param x x-coordinate of the cell you'd like to know.
   * @param y y-coordinate of the cell you'd like to know.
   * @returns the cell status of the specified coordinate.
   */
  getCell(x:CellNums, y:CellNums):CellStatus{
    return Object.assign(new CellStatus(), this._data[x][y]);
  }

  private getAroundCells(x:CellNums, y:CellNums){
    const cells = [] as CellStatus[];
    const columns = [this._data[x - 1], this._data[x], this._data[x + 1]].filter(col => Boolean(col));
    columns.forEach(col => {
      cells.push(...([col[y - 1], col[y], col[y + 1]].filter(cel => Boolean(cel))));
    });
    return cells;
  }

  /**
   * Returns the all cell coordinates you can put on.
   * @param current the current turn
   * @returns the array of the complete list of the cells you can put on.
   */
  getAbleToPut(current:StoneTypes):CellPoint[]{
    const points = [] as CellPoint[];
    for(let x = 0 as CellNums; x < 8; x++){
      for(let y = 0 as CellNums; y < 8; y++){
        if(this.put({type: "put", current, x, y}, /* dryrun */ true)){
          points.push({x, y});
        }
      }
    }
    return points;
  }

  /**
   * Returns a array of the complete list of the cell on the column the specified x-coordinate.
   * @param x x-coordinate
   * @returns a array of the complete list of the cell on the column the specified x-coordinate.
   */
  getColumn(x:CellNums){
    return [...this._data[x]];
  }

  /**
   * Returns a array of the complete list of the cell on the column the specified y-coordinate.
   * @param y y-coordinate
   * @returns a array of the complete list of the cell on the column the specified y-coordinate.
   */
  getRow(y:CellNums){
    return [...Array(8)].map((_, i) => this._data[i][y]);
  }

  private getPlusDiagonals(center: CellPoint){
    const intercept = center.x + center.y;
    const result = [] as CellStatus[];
    for(let i = 0; i <= 7; i++){
      const column = this.getColumn(i as CellNums);
      if(column){
        result.push(column[intercept - i as CellNums]);
      }
    }
    return result.filter(cell => Boolean(cell));
  }

  private getMinusDiagnals(center: CellPoint){
    const intercept = center.x - center.y;
    const result = [] as CellStatus[];
    for(let i = 0; i <= 7; i++){
      const column = this.getColumn(i as CellNums);
      if(column){
        result.push(column[i - intercept as CellNums]);
      }
    }
    return result.filter(cell => Boolean(cell));
  }

  private getLastMover():StoneTypes{
    if(this._log.length > 0){
      return this._log[this._log.length - 1].current
    }else{
      return this._config.firstMove === "black" ? "white" : "black";
    }
  }

  private sumCell(validator:(stat:CellStatus)=>boolean){
    let result = 0;
    this._data.forEach(column => {
      column.forEach(row => {
        if(validator(row)) result++;
      });
    });
    return result;
  }

  private replaceCells(config:StonePutConfig, center: CellNums, target: CellStatus[], direction:"plus"|"minus"):boolean {
    if(
      target.length === center + 1 && direction === "plus" 
      || center === 0 && direction === "minus"
      ){
        return false;
      }
    if(direction === "plus"){
      let start = -1;
      let end = -1;
      for(let i = center + 1; i < target.length; i++){
        if(target[i].type === "none") break;
        if(target[i].type === config.current) break;
        if(start === -1){
          start = i;
          end = i;
        }else if(end + 1 === i){
          end = i;
        }else{
          break;
        }
      }
      if(start === -1 || !target[end + 1] || target[end + 1].type !== config.current){
        return false;
      }
      for(let i = start; i <= end; i++){
        target[i] = new CellStatus(config.current, target[i].x, target[i].y);
      }
      return true;
    }else{
      let start = -1;
      let end = -1;
      for(let i = center - 1; i >= 0; i--){
        if(target[i].type === "none") break;
        if(target[i].type === config.current) break;
        if(start === -1){
          start = i;
          end = i;
        }else if(end - 1 === i){
          end = i;
        }else{
          break;
        }
      }
      if(start === -1 || !target[end - 1] || target[end - 1].type !== config.current){
        return false;
      }
      for(let i = start; i >= end; i--){
        target[i] = new CellStatus(config.current, target[i].x, target[i].y);
      }
      return true;
    }
  }
}