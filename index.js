let game = new (require("./dist")).Game();
game.put({type:"put",x:3,y:2,current:"white"})
game.put({type:"put",x:2,y:2,current:"black"})
game.put({type:"put",x:2,y:3,current:"white"})
game.put({type:"put",x:2,y:4,current:"black"})
game.put({type:"put",x:3,y:5,current:"white"})
game.put({type:"put",x:4,y:2,current:"black"})
game.put({type:"put",x:3,y:1,current:"white"})
game.put({type:"put",x:2,y:1,current:"black"})
game.logBoard();