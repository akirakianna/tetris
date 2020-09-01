function gameSetup() {
  const grid = document.querySelector('.grid')
  const gridMini = document.querySelector('.gridMini')
  const startButton = document.querySelector('.startOrPause')
  const width = 10
  const widthMini = 4
  const tiles = []
  const tilesMini = []

  let timerId 
  let nextRandom = 0
 
  //* PLACING THE PIECES FOR GAME *//

  //* Creating tiles on the grid.

  for (let i = 0; i < width ** 2 * 2; i++) {
    const tile = document.createElement('div')
    tile.classList.add('tile')
    grid.appendChild(tile)
    tiles.push(tile)
  }
  
  //* Creating end (hidden) tiles.

  for (let i = 200; i < 209; i++) {
    const taken = document.createElement('div')
    taken.classList.add('taken')
    grid.appendChild(taken)
    tiles.push(taken)
  }

  //* Creating Tetris pieces * //
  //* Each is an array of arrays of their 4 possible positions (rotations).

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
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1]
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

  //* Place the tetromino on board

  function placeTetromino() {
    currentTetromino.forEach((index) => {
      tiles[currentPosition + index].classList.add('tetromino')
    })
  }

  placeTetromino()

  //* Remove the tetromino from board

  function removeTetromino() {
    currentTetromino.forEach((index) => {
      tiles[currentPosition + index].classList.remove('tetromino')
    })
  }

  //* Tetris board automation 
  //* Moves the tetris piece down a row every second.

  // timerId = setInterval(moveDown, 1000)

  // function autoMove() {
  //   removeTetromino()
  //   currentPosition += width
  //   placeTetromino()
  //   stopTetromino()
    
  // }
 
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      moveLeft()
    } else if (e.key === 'ArrowRight') {
      moveRight()
    } else if (e.key === 'ArrowUp') {
      rotateTetromino()
    } else if (e.key === 'ArrowDown') {
      moveDown()
    }
  })
  

  //! Diff way of doing this?

  function stopTetromino() {
    if (currentTetromino.some(index => tiles[currentPosition + index + width].classList.contains('taken'))) {
      currentTetromino.forEach(index => tiles[currentPosition + index].classList.add('taken'))
      // Next tetromino falling
      randomTetromino = nextRandom
      nextRandom = Math.floor(Math.random() * tetrisPieces.length)
      currentTetromino = tetrisPieces[randomTetromino][currentRotation]
      currentPosition = 4
      placeTetromino()
      displayTetrimino()
    }
  }

  //* MOVING TETRIMINO ON GRID

  //! Diff way of doing this?

  function moveLeft() {
    removeTetromino()
    // logic to make sure the tetromino can't go off of the left side of grid
    // indexes are 10, 20, 30 and so on - so if they a remainder of 0.
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
      // displayTetrimino()
    }
  })

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
    placeTetromino()
  }


  // MINI GRID LOGIC - doesn't work.

  //* Mini grid

  const displayTiles = document.querySelectorAll('.gridMini div')
  const displayIndex = 0


  for (let i = 0; i < widthMini ** 2; i ++) {
    const tileMini = document.createElement('div')
    tileMini.classList.add('tileMini')
    gridMini.appendChild(tileMini)
    tilesMini.push(tileMini)
  }

  //tetrominos without rotations - as only need to display next shape.

  const nextTetrisPiece = [
    [1, widthMini + 1, widthMini * 2 + 1, 2], // orangeRicky,
    [1, widthMini + 1, widthMini * 2 + 1, widthMini * 3 + 1],//hero,
    [0, widthMini, widthMini + 1, widthMini * 2 + 1], //rhodeIsland,
    [1, widthMini, widthMini + 1, widthMini + 2], // teewee,
    [0, 1, widthMini, widthMini + 1] //smashboy
  ]

  function displayTetrimino() {
    displayTiles.forEach(tile => {
      tile.classList.remove('tetromino')
    })
    nextTetrisPiece[nextRandom].forEach(index => {
      displayTiles[displayIndex + index].classList.add('tetromino')
    })
  }  

}


window.addEventListener('load', gameSetup)
