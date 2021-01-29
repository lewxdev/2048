import Game from "./classes/game.js"

const game = new Game()

document.addEventListener("keyup", event => {
	if (event.key.startsWith("Arrow")) {
		const moveDirection = event.key.substring("Arrow".length).toLowerCase()
		const tilesMoved = game.moveTiles(moveDirection)

		if (tilesMoved) game.generateTile()
	}
})

document.querySelector(".undo.button").addEventListener("click", () => {
	if (game.prevState.board.length)
		game.setPrevState()
})

document.querySelector(".reset.button").addEventListener("click", () => {
	game.resetBoard()
})
