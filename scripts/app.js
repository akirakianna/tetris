function gameSetup() {
  const grid = document.querySelector('.grid')
  const gridMini = document.querySelector('.gridMini')
  const startButton = document.querySelector('.startOrPause')
  const scoreDisplay = document.querySelector('.scoreDisplay')
  const width = 10
  const widthMini = 4
  const tilesMini = []
  const displayIndex = 0
  const colors = [
    '#FD5F00',
    '#ff6ec7',
    '#ccff00',
    '#08f7fe',
    '#9d72ff'
  ]
  
  let tiles = []
  let timerId 
  let nextRandom = 0
  let score = 0
 
  //* PLACING THE PIECES FOR GAME *//

  //* Creating tiles on the grid.

  for (let i = 0; i < width ** 2 * 2; i++) {
    const tile = document.createElement('div')
    tile.classList.add('tile')
    grid.appendChild(tile)
    tiles.push(tile)
  }
  
  //* Creating end (hidden) tiles.

  for (let i = 200; i <= 209; i++) {
    const taken = document.createElement('div')
    taken.classList.add('taken')
    grid.appendChild(taken)
    tiles.push(taken)
  }

  //* Creating mini grid tiles.

  for (let i = 0; i < widthMini ** 2; i ++) {
    const tileMini = document.createElement('div')
    tileMini.classList.add('tileMini')
    gridMini.appendChild(tileMini)
    tilesMini.push(tileMini)
  }
  
  //next up mini grid tetrominos without rotations - as only need to display next shape.

  const nextTetrisPiece = [
    [1, widthMini + 1, widthMini * 2 + 1, 2], // orangeRicky,
    [1, widthMini + 1, widthMini * 2 + 1, widthMini * 3 + 1],//hero,
    [0, widthMini, widthMini + 1, widthMini * 2 + 1], //rhodeIsland,
    [1, widthMini, widthMini + 1, widthMini + 2], // teewee,
    [0, 1, widthMini, widthMini + 1] //smashboy
  ]

  //* Creating Tetris pieces * //
  //* Each is an array of arrays of their 4 possible positions (rotations).
  //* Never changing these values, only updating the current position. (data representation)

  //! L (Orange Ricky)

  const orangeRicky = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  //! I (Hero)
  const hero = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  //! Z (Rhode Island)

  const rhodeIsland = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  //! Reverse Z (Cleveland)

  // const cleveland = [
  //   [width, width + 1, width * 2, width * 2 + 1],
  //   [1, width, width + 1, width * 2],
  //   [width, width + 1, width * 2, width * 2 + 1],
  //   [1, width, width + 1, width * 2]
  // ]

  //! T (TeeWee)

  const teewee = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  //! O (Smashboy)

  const smashboy = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const tetrisPieces = [
    orangeRicky,
    hero,
    rhodeIsland,
    // cleveland,
    teewee,
    smashboy
  ]

  //* Creating a starting position
  let currentPosition = 4
  //* Starting from the first rotation in a single Tetris piece's array.
  let currentRotation = 0
  //! This selects a random item in my tetrisPieces array,
  //! AND the first rotation from the selected Tetris piece.
  let randomTetromino = Math.floor(Math.random() * tetrisPieces.length)

  let currentTetromino = tetrisPieces[randomTetromino][currentRotation]

  const leftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0)
  const rightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1)

  //* Place the tetromino on board

  function placeTetromino() {
    currentTetromino.forEach((index) => {
      tiles[currentPosition + index].classList.add('tetromino')
      tiles[currentPosition + index].style.backgroundColor = colors[randomTetromino]
    })
  }

  placeTetromino()

  //* Remove the tetromino from board

  function removeTetromino() {
    currentTetromino.forEach((index) => {
      tiles[currentPosition + index].classList.remove('tetromino')
      tiles[currentPosition + index].style.backgroundColor = ''
    })
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      moveLeft()
    } else if (e.key === 'ArrowRight') {
      moveRight()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      rotateTetromino()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveDown()
    }
  })
  

  //! Diff way of doing this section ?

  function stopTetromino() {
    if (currentTetromino.some(index => tiles[currentPosition + index + width].classList.contains('taken'))) {
      currentTetromino.forEach(index => tiles[currentPosition + index].classList.add('taken'))
      // Next tetromino falling
      // addScore()
      randomTetromino = nextRandom
      nextRandom = Math.floor(Math.random() * tetrisPieces.length)
      currentTetromino = tetrisPieces[randomTetromino][currentRotation]
      currentPosition = 4
      placeTetromino()
      displayTetrimino()
      addScore()
      gameOver()
    }
  }

  //* MOVING TETRIMINO ON GRID

  function moveLeft() {
    removeTetromino()
    // logic to make sure the tetromino can't go off of the left side of grid
    // indexes are 10, 20, 30 and so on - so if they have a remainder of 0.
    const leftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0)
    if (!leftEdge) currentPosition -= 1
    // logic to account for if there is another tetromino already in those tiles.
    if (currentTetromino.some(index => tiles[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    placeTetromino()
  }

  function moveRight() {
    removeTetromino()
    // if index is divisible by width and deeply equals width - 1, means you are at the right edge.
    const rightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1)
    if (!rightEdge) currentPosition += 1
    if (currentTetromino.some(index => tiles[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    placeTetromino()
  }

  function moveDown() {
    removeTetromino()
    currentPosition = currentPosition += width
    placeTetromino()
    stopTetromino()
  }

  startButton.addEventListener('click', () => {
    //* If timerId is true, clear interval and set to null
    //* Else when start button is clicked, draw tetromino in current position 
    //* and move down every second.
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      placeTetromino()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * tetrisPieces.length)
      displayTetrimino()
      
    }
  })
  
  function addScore() {
    for (let i = 0; i < tiles.length; i += width) {
      //* selecting a full row (all tiles in a single row)
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
      if (row.every(i => tiles[i].classList.contains('tetromino'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(i => {
          tiles[i].classList.remove('tetromino')
          tiles[i].style.backgroundColor = ''
        })
        //! remove the row using splice
        const removedTiles = tiles.splice(i, width)
        removedTiles.forEach((tile) => tile.classList.remove('taken'))
        //* adding row back to the top of grid
        tiles = removedTiles.concat(tiles)
        tiles.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //! FIX

  //* Rotating the tetrominos
  function rotateTetromino() {
  
    removeTetromino()
    currentRotation ++

    // if current rotation index is equal to amount of rotations in our current shape (4),
    // go back to first shape in array.
    if (currentRotation === currentTetromino.length) {
      currentRotation = 0
    }
    currentTetromino = tetrisPieces[randomTetromino][currentRotation]
    
    //* if conditional for left edge update current position
    placeTetromino()
    
  }

  //* Displaying next up Tetromino
  function displayTetrimino() {
    tilesMini.forEach(tile => {
      tile.classList.remove('tetromino')
      tile.style.backgroundColor = ''
    })
    nextTetrisPiece[nextRandom].forEach(index => {
      tilesMini[displayIndex + index].classList.add('tetromino')
      tilesMini[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }  
  
  //* Game over!

  function gameOver() {
    if (currentTetromino.some(index => tiles[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game over'
      clearInterval(timerId)
    }
  }


}


window.addEventListener('load', gameSetup)
