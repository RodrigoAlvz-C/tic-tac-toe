const gameboard = (() => {
  let board = [];

  const generate = () => {
    for (let i = 0; i < 9; i++) {
      board[i] = { position: i, value: null };
    }
  };

  const getBoard = () => board;
  const getCell = (position) => board[position];
  const addCell = (position, mark) => (board[position].value = mark);

  return { generate, getBoard, getCell, addCell };
})();
const Player = (name, mark) => {
  let cells = [];

  const getName = () => name;
  const getMark = () => mark;
  const getCells = () => cells;
  const addCell = (value) => cells.push(value);

  return { getName, getMark, getCells, addCell };
};

const displayController = (() => {
  const board = document.getElementById("board");
  const boardTop = document.getElementById("board-top");
  const boardBot = document.getElementById("board-bot");

  const printBoard = (pOne, pTwo) => {
    board.textContent = "";
    boardTop.textContent = "";
    gameboard.getBoard().forEach((cell) => {
      const div = document.createElement("div");
      if (cell.value === null) {
        div.textContent = "";
      } else {
        div.textContent = cell.value;
      }
      div.classList.add("cell");
      div.addEventListener("click", () =>
        gameController.playerMove(cell.position)
      );
      board.appendChild(div);
    });
    if (boardTop.textContent === "") {
      const playerOneName = document.createElement("div");
      playerOneName.textContent = `${pOne.getName()} (${pOne.getMark()})`
      const playerTwoName = document.createElement("div");
      playerTwoName.textContent = `${pTwo.getName()} (${pTwo.getMark()})`
      boardTop.style = "justify-content: space-between;";
      boardTop.appendChild(playerOneName);
      boardTop.appendChild(playerTwoName);
    }
    if (boardBot.textContent === "") {
      const resetBtn = document.createElement("button");
      resetBtn.textContent = "Reset";
      resetBtn.id = "reset-btn";
      resetBtn.addEventListener("click", () => gameController.startNewGame());
      boardBot.appendChild(resetBtn);
    }
  };

  const printWinner = (winComb, winner) => {
    board.textContent = "";
    boardTop.textContent = "";

    const winMessage = document.createElement("div");
    winMessage.textContent = `${winner} Wins!`;
    boardTop.style = "justify-content: center;";
    boardTop.appendChild(winMessage);

    gameboard.getBoard().forEach((cell, index) => {
      const div = document.createElement("div");
      div.style = "pointer-events: none;";
      div.textContent = cell.value;
      if (winComb.includes(index)) {
        div.classList.add("win-cell");
        div.classList.add("cell");
      } else {
        div.classList.add("cell");
      }
      div.addEventListener("click", () =>
        gameController.playerMove(cell.position)
      );

      board.appendChild(div);
    });
  };

  return { printBoard, printWinner };
})();

const gameController = (() => {
  let playerOne;
  let playerTwo;
  let currentPlayer;
  let result;

  const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const startNewGame = () => {
    gameboard.generate();
    playerOne = Player("Player One", "X");
    playerTwo = Player("Player Two", "O");
    currentPlayer = playerOne;
    result = null;
    displayController.printBoard(playerOne, playerTwo);
  };

  const checkWinner = () => {
    for (let i = 0; i < combinations.length; i++) {
      const combination = combinations[i];
      if (
        combination.every((cell) => currentPlayer.getCells().includes(cell))
      ) {
        return {
          hasWinner: true,
          winner: currentPlayer.getName(),
          combination: combination,
        };
      }
    }
    return {
      hasWinner: false,
      winner: null,
      combination: null,
    };
  };

  const changeCurrentPlayer = () =>
    playerOne === currentPlayer
      ? (currentPlayer = playerTwo)
      : (currentPlayer = playerOne);

  const isValid = (cell) => gameboard.getCell(cell).value === null;

  const playerMove = (cell) => {
    if (isValid(cell)) {
      gameboard.addCell(cell, currentPlayer.getMark());
      currentPlayer.addCell(cell);
      result = checkWinner();
      if (result.hasWinner) {
        displayController.printWinner(result.combination, result.winner);
        return;
      }
      displayController.printBoard(playerOne, playerTwo);
      changeCurrentPlayer();
    }
  };
  startNewGame();
  return { playerMove, startNewGame };
})();
