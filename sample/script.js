// @ts-check
(function(_this){
  /**
   * @type {(...arg:Parameters<(typeof Document.prototype.createElement)>)=>ReturnType<typeof Document.prototype.createElement>}
   */
  const create = (e) => document.createElement(e);
  const eget = (id) => document.getElementById(id);
  /**
   * @type {HTMLDivElement[][]}
   */
  const cells = [];
  /**
   * @type {import("../src/webpack").Game}
   */
  let game = null;
  /**
   * @type {import("../src/definition").StoneTypes|"draw"}
   */
  let winner = null;
  /**
   * @type {HTMLSpanElement}
   */
  const nextElemT = create("span");
  /**
   * @type {HTMLSpanElement}
   */
  const countT = create("span");
  /**
   * @type {HTMLButtonElement}
   */
  // @ts-ignore
  const pass = create("button");
  /**
   * @type {HTMLSpanElement}
   */
  const messageT = create("span");
  /**
   * @type {HTMLButtonElement}
   */
  // @ts-ignore
  const reset = create("button");
  /**
   * @type {HTMLSpanElement}
   */
  const blackCount = create("span");
  /**
   * @type {HTMLSpanElement}
   */
  const whiteCount = create("span");
  const storageKey = "othello.session";
  /**
   * @type {HTMLAudioElement}
   */
  // @ts-ignore
  const audioPlayer = create("audio");

  function initDOM (){
    const app_container = create("div");
    app_container.id = "app_container";

    const app = create("div");
    app.id = "app";
    app_container.appendChild(app);

    audioPlayer.src = "spo_ge_osero02.mp3";
    audioPlayer.classList.add("hidden");
    audioPlayer.preload = "auto";
    app_container.appendChild(audioPlayer);

    document.body.appendChild(app_container);
    const thead = create("div");
    const sumi = create("div");
    sumi.classList.add("sumi");
    thead.append(sumi);
    for(let i = 0; i < 8; i++){
      const cell = create("div");
      const cellt = create("span");
      cellt.textContent = i.toString();
      cell.append(cellt);
      cell.classList.add("thead");
      thead.append(cell);
    }
    app.append(thead);
    for(let i = 0; i < 8; i++){
      /**
       * @type {HTMLDivElement[]}
       */
      const row = [];
      const rowElem = create("div");
      const lhead = create("div");
      lhead.classList.add("lhead");
      const lheadt = create("span");
      lheadt.textContent = i.toString();
      lhead.append(lheadt);
      rowElem.append(lhead);
      for(let j = 0; j < 8; j++){
        /**
         * @type {HTMLDivElement}
         */
        // @ts-ignore
        const cell = create("div");
        cell.classList.add("cell");
        cell.dataset.x = j.toString();
        cell.dataset.y = i.toString();
        cell.addEventListener("click", (ev) => {
          /**
           * @type {HTMLDivElement}
           */
          // @ts-ignore
          const elem = ev.target;
          try{
            const result = game.put({
              // @ts-ignore
              current: nextElemT.dataset.next,
              type: "put",
              // @ts-ignore
              x: Number(elem.dataset.x),
              // @ts-ignore
              y: Number(elem.dataset.y)
            });
            if(result.winner){
              winner = result.winner;
              _this.alert(winner + " won!");
              reset.className = "";
            }else{
              reset.classList.add("hidden");
            }
            updateBoard();
            updateUI();
            messageT.textContent = "";
            audioPlayer.currentTime = 0;
            audioPlayer.play();
          }
          catch(e){
            console.error(e);
            messageT.textContent = e.message;
          }
        })
        row.push(cell);
        rowElem.append(cell);
      }
      cells.push(row);
      app.append(rowElem);
    }

    const container = eget("app_container");

    const nextElem = create("div");
    nextElem.append(nextElemT);
    container.append(nextElem);

    const count = create("div");
    count.append(countT);
    container.append(count);

    const passc = create("div");
    pass.textContent = "Pass";
    pass.addEventListener("click", () => {
      try{
        game.put({
          type: "pass",
          // @ts-ignore
          current: nextElemT.dataset.next
        });
        updateUI();
        updateBoard();
      }
      catch{}
    });
    passc.append(pass);
    container.append(passc);

    const resetc = create("div");
    reset.textContent = "Reset";
    reset.addEventListener("click", () => {
      _this.localStorage.removeItem(storageKey);
      initGame();
      updateBoard();
      updateUI();
    });
    resetc.append(reset);
    container.append(resetc);

    const statc = create("div");
    statc.classList.add("stat");
    const separater = create("span");
    separater.textContent = "/";
    statc.append(whiteCount, separater, blackCount);
    container.append(statc);

    const darkmodec = create("div");
    /**
     * @type {HTMLInputElement}
     */
    // @ts-ignore
    const darkmode = create("input");
    darkmode.type = "checkbox";
    document.body.className = (darkmode.checked = _this.localStorage.getItem("othello.dark") === "true") ? "dark" : "";
    darkmode.addEventListener("change", () => {
      document.body.className = darkmode.checked ? "dark" : "";
      _this.localStorage.setItem("othello.dark", String(darkmode.checked));
    });
    darkmode.id = "dark_chbx"
    darkmodec.appendChild(darkmode);
    /**
     * @type {HTMLLabelElement}
     */
    // @ts-ignore
    const darkmodel = create("label");
    darkmodel.htmlFor = "dark_chbx";
    darkmodel.textContent = "Darkmode";
    darkmodec.appendChild(darkmodel);
    container.appendChild(darkmodec);

    const message = create("div");
    message.classList.add("msg_container");
    messageT.textContent = "";
    messageT.classList.add("red");
    message.append(messageT);
    container.append(message);
  }
  function initGame() {
    // @ts-ignore
    game = new othello.Game({});
    // Restore
    const session = _this.localStorage.getItem(storageKey);
    if(session){
      try{
        game.board.reset(JSON.parse(session));
        winner = game.board.log[game.board.log.length - 1].winner;
      }
      catch{}
    }
  }
  function updateBoard() {
    for(let x = 0; x < 8; x++){
      for(let y = 0; y < 8; y++){
        const cls = ["cell"];
        // @ts-ignore
        cls.push(game.board.getCell(x, y).type);
        if(game.board.put({
          type: "put",
          current: game.board.nextStone,
          // @ts-ignore
          x, y
        }, true)){
          cls.push(game.board.nextStone + "_point");
        }
        cells[y][x].className = cls.join(" ");
      }
    }
    _this.localStorage.setItem(storageKey, JSON.stringify(game.board.log));
  }
  function updateUI(){
    nextElemT.textContent = "Next: " + (!winner ? game.board.nextStone : "-");
    nextElemT.dataset.next = game.board.nextStone;
    countT.textContent = "Count: " + game.board.log.length;
    if(winner){
      pass.disabled = true;
    }
    whiteCount.textContent = "White: " + game.board.getInfo("white").count;
    blackCount.textContent = "Black: " + game.board.getInfo("black").count;
  }
  (function(){
    initDOM();
    initGame();
    updateBoard();
    updateUI();
  })();
})(window);