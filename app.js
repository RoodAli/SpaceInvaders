document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div');
  const resultDisplay = document.querySelector('#result');
  let width = 15;
  let currentShooterIndex = 202;
  let currentInvaderIndex = 0;
  let alienInvadersTakenDown = [];
  let result = 0;
  let direction = 1;
  let invaderId;
  //define the alien invaders
  const alienInvaders = [
    0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70
  ]

  // draw the alien invaders
  alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'))

  // draw the shooter
  squares[currentShooterIndex].classList.add('shooter')

  // move shooter along a line
  function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch (e.keyCode) {
      case 37:
        if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
        break
      case 39:
        if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
        break
    }
    squares[currentShooterIndex].classList.add('shooter')
  }
  document.addEventListener('keydown', moveShooter)

  // move the alien invaders
  function moveInvaders() {
    const leftEdge = alienInvaders[0] % width == 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width == width - 1

    if ((leftEdge && direction == -1) || (rightEdge && direction == 1)) {
      direction = width
    } else if (direction == width) {
      if (leftEdge) direction = 1
      else direction = -1
    }
    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      squares[alienInvaders[i]].classList.remove('invader')
    }
    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      alienInvaders[i] += direction
    }
    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      if (!alienInvadersTakenDown.includes(i)) {
        squares[alienInvaders[i]].classList.add('invader')
      }
    }

    // decide a game over
    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
      resultDisplay.textContent = "Game Over"
      squares[currentShooterIndex].classList.add('boom')
      clearInterval(invaderId)
    }
    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      if (alienInvaders[i] > (squares.length - (width - 1))) {
        resultDisplay.textContent = "Game over"
        clearInterval(invaderId)
      }
    }

    // decide a win
    if (alienInvadersTakenDown.length == alienInvaders.length) {
      resultDisplay.textContent = "You Win"
      clearInterval(invaderId)
    }
  }
  invaderId = setInterval(moveInvaders, 200)

  // shoot at aliens
  function shoot(e) {
    let laserId;
    let currnetLaserIndex = currentShooterIndex

    // move the laser from the shooter to the alien Invader
    function moveLaser() {
      squares[currnetLaserIndex].classList.remove('laser')
      currnetLaserIndex -= width
      squares[currnetLaserIndex].classList.add('laser')
      if (squares[currnetLaserIndex].classList.contains('invader')) {
        squares[currnetLaserIndex].classList.remove('laser')
        squares[currnetLaserIndex].classList.remove('invader')
        squares[currnetLaserIndex].classList.add('boom')
        setTimeout(() => squares[currnetLaserIndex].classList.remove('boom'), 250)
        clearInterval(laserId)
        const alienTakenDown = alienInvaders.indexOf(currnetLaserIndex)
        alienInvadersTakenDown.push(alienTakenDown)
        result++
        resultDisplay.textContent = result
      }
      if (currnetLaserIndex < width) {
        clearInterval(laserId)
        setTimeout(() => squares[currnetLaserIndex].classList.remove('laser'), 100)
      }
    }

    switch (e.keyCode) {
      case 32:
        laserId = setInterval(moveLaser, 100)
        break
    }
  }
  document.addEventListener('keyup', shoot)
});