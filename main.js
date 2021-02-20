const gameboard = (() => {
  let board = document.querySelector(".game-board");
  let messageDisplay = document.querySelector(".message");

  const gameboard = [];

  for (let i = 0; i < 9; i++) {
    gameboard.push([i, null]);
    const cell = document.createElement("div");
    cell.className = "cell cell-" + i;
    cell.textContent = " ";
    board.appendChild(cell);
  }

  // display Start Game in Middle
  board.querySelector(".cell-4").textContent = "Start Game";

  const displayMessage = (message) => {
    messageDisplay.textContent = message;
  };

  const writeToCell = (cell, mark) => {
    if (gameboard[cell][1]) {
      displayMessage("Cannot place there!");
      throw "Non empty cell!";
    }

    gameboard[cell][1] = mark;
    renderPage();
  };

  const renderPage = () => {
    gameboard.forEach((cell) => {
      const nodeMapping = board.querySelector(".cell-" + cell[0]);

      nodeMapping.textContent = cell[1];
    });
  };

  const isGameOver = () => {
    const winningCombinations = [
      // horizontals
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // verticals
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // diag
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (i = 0; i < winningCombinations.length; i++) {
      if (winningCombinations[i].every((num) => gameboard[num][1] === "X")) {
        displayMessage("Winner is X");
        P1.incScore();
        return true;
      } else if (
        winningCombinations[i].every((num) => gameboard[num][1] === "O")
      ) {
        displayMessage("Winner is O");
        P2.incScore();
        return true;
      }
    }

    if (!gameboard.some((group) => group[1] === null)) {
      console.log("Draw");
      return true;
    }
    return false;
  };

  const resetGame = () => {
    gameboard.forEach((cell) => (cell[1] = null));
    displayMessage("Game Reset");

    renderPage();
  };

  const placeRandMove = (mark) => {
    let availableCells = gameboard.filter((cell) => cell[1] === null);
    if (!availableCells) {
      return displayMessage("No more available moves");
    }
    let choice = Math.floor(Math.random() * Math.floor(availableCells.length));
    writeToCell(availableCells[choice][0], mark);
  };
  return {
    renderPage,
    writeToCell,
    isGameOver,
    resetGame,
    displayMessage,
    placeRandMove,
  };
})();

const Player = (name, mark) => {
  let score = 0;
  const getName = () => console.log("Hi I'm " + name);
  const makeMove = (cell) => gameboard.writeToCell(cell, mark);
  const incScore = () => score++;
  const getScore = () => score;
  return { getName, makeMove, incScore, getScore };
};

const P1 = Player("Mark", "O");
const P2 = Player("Jim", "X");

const controller = (() => {
  let activePlayer = "X";
  const cells = document.querySelector(".game-board");
  // buttons
  const resetButton = document.querySelector(".reset");
  const undoButton = document.querySelector(".undo");
  const randMoveButton = document.querySelector(".randMove");

  handleReset = function () {
    gameboard.resetGame();
    cells.addEventListener("click", handlePlaceMark);
    randMoveButton.addEventListener("click", handleRandomMove);
  };

  handlePlaceMark = function (event) {
    const cellClass = event.target.className;
    const cellNumber = cellClass[cellClass.length - 1];
    gameboard.writeToCell(cellNumber, activePlayer);
    activePlayer = activePlayer === "X" ? "O" : "X";
    gameboard.displayMessage("Current Player: " + activePlayer);
    if (gameboard.isGameOver()) {
      document.querySelector(".score1").textContent = P1.getScore();
      document.querySelector(".score2").textContent = P2.getScore();

      cells.removeEventListener("click", handlePlaceMark);
      randMoveButton.removeEventListener("click", handleRandomMove);
    }
  };

  handleRandomMove = function () {
    gameboard.placeRandMove(activePlayer);
    activePlayer = activePlayer === "X" ? "O" : "X";
    if (gameboard.isGameOver()) {
      console.log("Game over");
      document.querySelector(".score1").textContent = P1.getScore();
      document.querySelector(".score2").textContent = P2.getScore();

      cells.removeEventListener("click", handlePlaceMark);
      randMoveButton.removeEventListener("click", handleRandomMove);
    }
  };

  cells.addEventListener("click", handlePlaceMark);
  resetButton.addEventListener("click", handleReset);
  randMoveButton.addEventListener("click", handleRandomMove);
})();
