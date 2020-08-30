function gameSetup() {
  const grid = document.querySelector('.grid')
  const width = 10
  const tiles = []

  //* Creating base grid.

  //* PLACING THE PIECES FOR GAME *//

  //* Creating tiles on the grid.

  for (let i = 0; i < width ** 2 * 2; i++) {
    const tile = document.createElement('div')
    tile.classList.add('tile')
    grid.appendChild(tile)
    tiles.push(tile)
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

  const cleveland = [
    [width, width + 1, width * 2, width * 2 + 1],
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2, width * 2 + 1],
    [1, width, width + 1, width * 2]
  ]

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
    cleveland,
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

  const currentTetromino = tetrisPieces[randomTetromino][currentRotation]

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

  const timerId = setInterval(autoMove, 1000)

  function autoMove() {
    removeTetromino()
    currentPosition += width
    placeTetromino()
    freeze()
  }

  //* Ask about this
  function freeze() {
    if (currentTetromino.some(index => tiles[currentPosition + index + width] > 189)) {
      console.log('hello')
      clearInterval(timerId)
    }
  }
}

  // function stopTetromino() {
  //   if (currentTetromino.some(index => tiles[currentPosition + index + width].contains('taken'))) {
  //     currentTetromino.forEach(index => tiles[currentPosition + index].classList.add('taken'))
  //     randomTetromino = Math.floor(Math.random() * tetrisPieces.length)
  //     currentTetromino = tetrisPieces[randomTetromino][currentRotation]
  //     currentPosition = 4
  //     placeTetromino()
  //   }
  // }





window.addEventListener('load', gameSetup)
