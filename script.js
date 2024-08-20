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
    playerOne = Player("One", "X");
    playerTwo = Player("Two", "O");
    currentPlayer = playerOne;
    result = null;
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

  const isValid = (cell) => cell < 9 && gameboard.getCell(cell).value === null;

  const playerMove = (cell) => {
    if (isValid(cell)) {
      gameboard.addCell(cell, currentPlayer.getMark());
      currentPlayer.addCell(cell);
      result = checkWinner();
      if (result.hasWinner) {
        console.log(`Winner: ${result.winner} : ${result.combination}`);
        startNewGame();
        return;
      }
      changeCurrentPlayer();
    }
  };
  startNewGame();
  return { playerMove, startNewGame };
})();