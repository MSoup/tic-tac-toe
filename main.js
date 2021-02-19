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

  const writeToCell = (cell, mark) => {
    if (gameboard[cell][1]) {
      messageDisplay.textContent = "Cannot place there!";
      throw "Non empty cell!";
    }

    gameboard[cell][1] = mark;
    isGameOver();
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
        messageDisplay.textContent = "Winner is X";
        break;
      } else if (
        winningCombinations[i].every((num) => gameboard[num][1] === "O")
      ) {
        messageDisplay.textContent = "Winner is O";
        break;
      }
    }

    if (!gameboard.some((group) => group[1] === null)) {
      console.log("Draw");
    }
  };

  const resetGame = () => {
    gameboard.forEach((cell) => (cell[1] = null));
    renderPage();
  };

  return { renderPage, writeToCell, isGameOver, resetGame };
})();

const Player = (name, mark) => {
  const getName = () => console.log("Hi I'm " + name);
  const makeMove = (cell) => gameboard.writeToCell(cell, mark);
  return { getName, makeMove };
};

const P1 = Player("Mark", "O");
const P2 = Player("Jim", "X");

const controller = (() => {
  let activePlayer = "X";
  const middleCell = document.querySelector(".cell-4");
  const cells = document.querySelector(".game-board");

  handlePlaceMark = function (event) {
    const cellClass = event.target.className;
    const cellNumber = cellClass[cellClass.length - 1];
    gameboard.writeToCell(cellNumber, activePlayer);
    activePlayer = activePlayer === "X" ? "O" : "X";
  };

  cells.addEventListener("click", handlePlaceMark);
})();

// P1.makeMove(0);
// P2.makeMove(4);
// P1.makeMove(1);
// P2.makeMove(5);
// P1.makeMove(2);
