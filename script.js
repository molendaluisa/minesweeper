//Game UI
import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose
} from './minesweeper.js';


const boardElement = document.querySelector('.board');
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnBeginner = document.querySelector('.beginner');
const btnIntermediate = document.querySelector('.intermediate');
const btnExpert = document.querySelector('.expert');
const btnRestart = document.querySelector('.restart');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const clearGame = function () {
  location.reload();
};


function listMinesLeft(board, qtyOfMines) {
  const markedTilesCount = board.reduce((count, row) => {
    return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
  }, 0)

  minesLeftText.textContent = qtyOfMines - markedTilesCount
}

function checkEndGame(board) {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true })
    boardElement.addEventListener('contextmenu', stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = 'You Win'
  }
  if (lose) {
    messageText.textContent = 'You Lose'
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED) {
          markTile(tile)
        }
        if (tile.mine) {
          revealTile(board, tile)
        }
      })
    })
  }
}

function stopProp(e) {
  e.stopImmediatePropagation()
}

function startGame(boardSize, qtyOfMines) {
  const board = createBoard(boardSize, qtyOfMines);

  board.forEach(row => {
    row.forEach(tile => {
      boardElement.append(tile.element)
      tile.element.addEventListener('click', () => {
        revealTile(board, tile)
        checkEndGame(board, tile)
      })
      tile.element.addEventListener('contextmenu', e => {
        e.preventDefault()
        markTile(tile)
        listMinesLeft(board, qtyOfMines)
      })
    })
  })

  boardElement.style.setProperty("--size", boardSize)
  minesLeftText.textContent = qtyOfMines
  closeModal()
}

// Set event listerner for Game Start buttons
btnRestart.addEventListener('click', () => clearGame())
btnBeginner.addEventListener('click', () => startGame(10, 10));
btnIntermediate.addEventListener('click', () => startGame(15, 40));
btnExpert.addEventListener('click', () => startGame(20, 99));

// Open Game Start modal
openModal();


