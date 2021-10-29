import { GameConfig } from "..";
import { CellNums, CellTypes, StonePutConfig, StonePutResult, StoneTypes } from "../definition";
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

  put(config:StonePutConfig):StonePutResult{
    let winner = null as StoneTypes|null;
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
      // TODO: 裏返す処理
    }
    const result = {
      ...config,
      winner
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

  private getCell(x:CellNums, y:CellNums):CellStatus{
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
    return this._data[x];
  }

  private getRow(y:CellNums){
    return [...Array(8)].map((_, i) => this._data[i][y]);
  }

  private getPlusDiagonals(center:{x:CellNums, y:CellNums}){
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

  private getMinusDiagnals(center:{x:CellNums, y:CellNums}){
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
      return this._config.firstMove;
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
}