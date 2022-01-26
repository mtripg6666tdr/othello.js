# othello.js
An easy-to-use othello game implementation in TypeScript.  
[Example usage](https://mtripg6666tdr.github.io/othello.js/sample/)  
[Documentation](https://mtripg6666tdr.github.io/othello.js/docs/modules.html)  

**This project is still under construction**

# Installation
- via CDN
```html
<script defer src="https://cdn.jsdelivr.net/npm/othello.js@v0.0.0-rc3/lib/othello.min.js"></script>
```
- via package manager
```bash
npm i othello.js
```

# Usage
```ts
import { Game } from "othello.js";

const game = new Game({});
game.addListener("black", () => console.log("Black's turn"));
game.addListener("white", () => console.log("White's turn"));
game.addListener("finish", (result) => console.log("Finish! Wiiner is " + result.winner));

game.put({
  current: "white",
  type: "put",
  x: 2, y: 3
});
game.put({
  current: "black",
  type: "put",
  x: 4, y: 2
});
game.logBoard();
```
# API
See [documentation](https://mtripg6666tdr.github.io/othello.js/docs/modules.html) to see more available api.

# License
See [LICENSE](LICENSE) for more info.
