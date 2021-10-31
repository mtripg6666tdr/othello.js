let game = new (require("./dist")).Game();
game.put({type:"put",x:3,y:2,current:"white"}) // 1
game.put({type:"put",x:2,y:2,current:"black"}) // 2
game.put({type:"put",x:2,y:3,current:"white"}) // 3
game.put({type:"put",x:2,y:4,current:"black"}) // 4
game.put({type:"put",x:3,y:5,current:"white"}) // 5
game.put({type:"put",x:4,y:2,current:"black"}) // 6
game.put({type:"put",x:3,y:1,current:"white"}) // 7
game.put({type:"put",x:2,y:1,current:"black"}) // 8
game.put({type:"put",x:5,y:3,current:"white"}) // 9
game.put({type:"put",x:5,y:4,current:"black"}) // 10
game.put({type:"put",x:1,y:3,current:"white"}) // 11
game.put({type:"put",x:2,y:5,current:"black"}) // 12
game.put({type:"put",x:4,y:5,current:"white"}) // 13
game.put({type:"put",x:5,y:1,current:"black"}) // 14
game.put({type:"put",x:1,y:2,current:"white"}) // 15
game.put({type:"put",x:4,y:6,current:"black"}) // 16
game.put({type:"put",x:2,y:6,current:"white"}) // 17
game.put({type:"put",x:2,y:7,current:"black"}) // 18
game.put({type:"put",x:4,y:7,current:"white"}) // 19
game.put({type:"put",x:6,y:2,current:"black"}) // 20
game.put({type:"put",x:5,y:2,current:"white"}) // 21
game.put({type:"put",x:0,y:2,current:"black"}) // 22
game.put({type:"put",x:0,y:3,current:"white"}) // 23
game.put({type:"put",x:3,y:0,current:"black"}) // 24
game.put({type:"put",x:2,y:0,current:"white"}) // 25
game.put({type:"put",x:1,y:4,current:"black"}) // 26
game.logBoard();