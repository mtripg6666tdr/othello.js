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

export class OthelloBoardManager {
  private _data = null as CellStatus[][];
  private _log = [] as StonePutResult[];

  get putLog(): readonly StonePutResult[] {
    return this._log;
  }

  constructor(private _config:GameConfig) {
    this._data = [...Array(8)].map((_, x) => [...Array(8)].map((_, y) => new CellStatus("none", x as CellNums, y as CellNums)));
    this
      .setCell("black", {x: 3, y: 3}, {x: 4, y: 4})
      .setCell("white", {x: 3, y: 4}, {x: 4, y: 3})
      ;
  }

  getInfo(type:StoneTypes):StoneStatus{
    return new StoneStatus(this.sumCell(cell => cell.type === type));
  }

  get nextStone():StoneTypes{
    return this.getLastMover() === "black" ? "white" : "black";
  }

  get log():readonly StonePutResult[]{
    return this._log;
  }

  put(config:StonePutConfig):StonePutResult{
    let winner = null as StoneTypes|null|"draw";
    const modified = [] as CellStatus[];
    if(config.type === "put"){
      const target = this.getCell(config.x, config.y);
      if(this.getLastMover() === config.current){
        // ２ユーザー連続
        throw new Error("two consecutive mover");
      }else if(target.type !== "none"){
        // すでに置かれているセル
        throw new Error("the cell has already been put a stone on");
      }
      const arrounds = this.getAroundCells(config.x, config.y);
      if(arrounds.length === 0){
        // まわりに石がないセル
        throw new Error("the cell surrounded by no stone");
      }else if(arrounds.filter(c => c.type !== target.type).length === 0){
        // まわりに種類の異なる(裏されうる)石がないセル
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
        throw new Error("no cell to turn");
      }
      // 裏返しを反映
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
    if(this.sumCell(cell => cell.type === "none") === 0){
      const white = this.sumCell(cell => cell.type === "white");
      const black = this.sumCell(cell => cell.type === "black");
      winner = white > black ? "white" : white === black ? "draw" : white < black ? "black" : null;
    }
    const result:StonePutResult = {
      ...config,
      winner,
      modified
    };
    this._log.push(result);
    return result;
  }

  private setCell(type: CellTypes, ...positions: {x: CellNums, y: CellNums}[]){
    positions.forEach(p => {
      this._data[p.x][p.y] = new CellStatus(type, p.x, p.y);
    });
    return this;
  }

  getCell(x:CellNums, y:CellNums):CellStatus{
    return this._data[x][y];
  }

  private getAroundCells(x:CellNums, y:CellNums){
    const cells = [] as CellStatus[];
    const columns = [this._data[x - 1], this._data[x], this._data[x + 1]].filter(col => Boolean(col));
    columns.forEach(col => {
      cells.push(...([col[y - 1], col[y], col[y + 1]].filter(cel => Boolean(cel))));
    });
    return cells;
  }

  private getColumn(x:CellNums){
    return [...this._data[x]];
  }

  private getRow(y:CellNums){
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