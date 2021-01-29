import * as helper from "../helper.js"

export default class Game {
	constructor() {
		this.score = 0
		this.boardSize = 4
		this.prevState = {
			score: 0,
			board: []
		}

		this.drawBoard()
		this.generateTile()
	}

	/** Programatically generates the game board and info based on
	 * `this.boardSize` */
	drawBoard() {
		if (!document.querySelector(".board")) {
			const board = helper.createDiv("board")
			document.body.appendChild(board)

			for (let colIndex = 0; colIndex < this.boardSize; colIndex++) {
				const col = helper.createDiv("col")
				board.appendChild(col)

				for (let cellIndex = 0; cellIndex < this.boardSize; cellIndex++) {
					col.appendChild(helper.createDiv("cell", {
						column: colIndex,
						cell: cellIndex
					}))
				}
			}
		} else console.warn("board already generated")

		if (!document.querySelector(".info.container")) {
			const infoContainer = helper.createDiv("info container")
			document.body.appendChild(infoContainer)

			const scoreBox = helper.createDiv("score box", null, this.score)
			infoContainer.appendChild(scoreBox)
			const undoButton = helper.createDiv("undo button box", null, String.fromCharCode(8635))
			infoContainer.appendChild(undoButton)
			const resetButton = helper.createDiv("reset button box", null, String.fromCharCode(916))
			infoContainer.appendChild(resetButton)
		} else console.warn("info already generated")
	}

	/**
	 * Returns the cell Element associated with a given column and cell
	 * index
	 * @param {number} colIndex - The cell's column index
	 * @param {number} cellIndex - The cell's index
	 * @return {HTMLDivElement} The cell element
	 */
	getCell(colIndex, cellIndex) {
		const errorMessage = value => `Value should be <${this.boardSize}, got '${value}'`

		if (colIndex < this.boardSize) {
			if (cellIndex < this.boardSize) {
				return document.querySelector(
					`[data-column="${colIndex}"][data-cell="${cellIndex}"]`
				)
			} else throw Error(errorMessage(cellIndex))
		} else throw Error(errorMessage(colIndex))
	}

	/** Randomly generates a game tile and its value on an empty space on
	 * the board */
	generateTile() {
		const emptyCells = document.querySelectorAll(`.cell:empty`)

		if (emptyCells.length) {
			const randomCell = helper.getRandomChoice(emptyCells)
			const roll = helper.generateRandomNumber(10)
			const newTile = helper.createDiv("tile", { value: roll < 9 ? 2 : 4 })

			randomCell.appendChild(newTile)
		} else throw Error("board full")
	}

	/**
	 * Increments the game score by a given `amount` and updates the
	 * scoreboard accordingly
	 * @param {(number|string)} amount - the integer amount to increment by
	 */
	addScore(amount) {
		this.score += parseInt(amount)
		document.querySelector(".score.box").textContent = this.score
	}

	/**
	 * Performs a callback function during the navigation of the full game
	 * board, wrapping the values for the current `cell` and `tile`
	 * dynamically
	 * @param {number} colIndex - the currently navuigated column index
	 * @param {number} cellIndex - the currently navigated cell index
	 * @param {function} callback - the callback function to run in context
	 */
	navigateContextually(colIndex, cellIndex, callback = (tile, cell) => {}) {
		const cell = this.getCell(colIndex, cellIndex)
		const tile = cell.querySelector(".tile")
		callback(tile, cell)
	}

	/**
	 * Performs a move operation on a `tile` to a given cell. This will
	 * return a boolean representing the operation success
	 * @param {HTMLDivElement} tile - tile element
	 * @param {HTMLDivElement} cell - cell element
	 * @return {boolean} the operation result
	 */
	performMoveOperation(tile, cell) {
		const cellTile = cell.querySelector(".tile")

		if (!cellTile) {
			cell.appendChild(tile)
			return true
		} else {
			if (cellTile.dataset.value === tile.dataset.value) {
				cellTile.dataset.value *= 2
				this.addScore(cellTile.dataset.value)
				tile.remove()
				return true
			} else return false
		}
	}

	/**
	 * Performs a move operation on all the board tiles in a particular
	 * `direction`: "up", "down", "left", or "right"
	 * @param {string} direction - the direction of movement
	 */
	moveTiles(direction) {
		this.savePrevState()
		let tilesMoved = false

		if (direction === "up")
			for (let colIndex = 0; colIndex < this.boardSize; colIndex++)
				for (let cellIndex = 0; cellIndex < this.boardSize; cellIndex++)
					this.navigateContextually(colIndex, cellIndex, (tile, cell) => {
						if (tile)
							for (let move = 1; move <= cellIndex; move++) {
								const nextCell = this.getCell(colIndex, cellIndex - move)
								if (this.performMoveOperation(tile, nextCell))
									tilesMoved = true
							}
					})

		else if (direction === "down")
			for (let colIndex = 0; colIndex < this.boardSize; colIndex++)
				for (let cellIndex = this.boardSize - 1; cellIndex >= 0; cellIndex--)
					this.navigateContextually(colIndex, cellIndex, (tile, cell) => {
						if (tile) {
							const numMoves = (this.boardSize - 1) - cellIndex

							for (let move = 1; move <= numMoves; move++) {
								const nextCell = this.getCell(colIndex, cellIndex + move)
								if (this.performMoveOperation(tile, nextCell))
									tilesMoved = true
							}
						}
					})

		else if (direction === "left")
			for (let cellIndex = 0; cellIndex < this.boardSize; cellIndex++)
				for (let colIndex = 0; colIndex < this.boardSize; colIndex++)
					this.navigateContextually(colIndex, cellIndex, (tile, cell) => {
						if (tile)
							for (let move = 1; move <= colIndex; move++) {
								const nextCell = this.getCell(colIndex - move, cellIndex)
								if (this.performMoveOperation(tile, nextCell))
									tilesMoved = true
							}
					})

		else if (direction === "right")
			for (let cellIndex = 0; cellIndex < this.boardSize; cellIndex++)
				for (let colIndex = this.boardSize - 1; colIndex >= 0; colIndex--)
					this.navigateContextually(colIndex, cellIndex, (tile, cell) => {
						if (tile) {
							const numMoves = (this.boardSize - 1) - colIndex

							for (let move = 1; move <= numMoves; move++) {
								const nextCell = this.getCell(colIndex + move, cellIndex)
								if (this.performMoveOperation(tile, nextCell))
									tilesMoved = true
							}
						}
					})

		return tilesMoved
	}

	savePrevState() {
		this.prevState.score = this.score
		this.prevState.board = []

		for (let colIndex = 0; colIndex < this.boardSize; colIndex++) {
			this.prevState.board.push([])

			for (let cellIndex = 0; cellIndex < this.boardSize; cellIndex++) {
				this.navigateContextually(colIndex, cellIndex, tile => {
					if (tile)
						this.prevState.board[colIndex].push(parseInt(tile.dataset.value))
					else this.prevState.board[colIndex].push(0)
				})
			}
		}
	}

	setPrevState() {
		for (let colIndex = 0; colIndex < this.boardSize; colIndex++)
			for (let cellIndex = 0; cellIndex < this.boardSize; cellIndex++)
				this.navigateContextually(colIndex, cellIndex, (tile, cell) => {
					const prevValue = this.prevState.board[colIndex][cellIndex]

					if (prevValue) {
						if (tile) tile.dataset.value = prevValue
						else cell.appendChild(helper.createDiv("tile", { value: prevValue }))
					} else {
						if (tile) tile.remove()
					}
				})

		this.score = this.prevState.score
		document.querySelector(".score.box").textContent = this.score
		this.prevState.board = []
	}

	resetBoard() {
		this.score = 0
		this.prevState = {
			score: 0,
			board: []
		}

		for (let colIndex = 0; colIndex < this.boardSize; colIndex++)
			for (let cellIndex = 0; cellIndex < this.boardSize; cellIndex++)
				this.navigateContextually(colIndex, cellIndex, (tile, cell) => {
					cell.innerHTML = null
				})

		this.generateTile()
	}
}