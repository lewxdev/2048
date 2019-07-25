const data = {
	board: [],
	score: 0,
	prevBoardState: null,
	win: 0,
	egg: function () {
		let baseValue = 131072;
		for (let i = 0; i < 4; i++) {
			if (i % 2 === 0) {
				data.board[0][i].dataset.value = baseValue / Math.pow(16, i);
				for (let j = 0; j < 4; j++)
					if (j !== 3) data.board[j + 1][i].dataset.value = data.board[j][i].dataset.value / 2;
			} else {
				data.board[3][i].dataset.value = baseValue / Math.pow(16, i);
				for (let j = 3; j >= 0; j--)
					if (j !== 0) data.board[j - 1][i].dataset.value = data.board[j][i].dataset.value / 2;
			}
		}
	}
}

function drawBoard() {
	const board = document.createElement('div');
	board.classList.add('board');
	document.body.appendChild(board);
	for (let colIndex = 0; colIndex < 4; colIndex++) {
		let col = document.createElement('div');
		col.classList.add('col');
		board.appendChild(col);
		data.board.push([]);
		for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
			let cell = document.createElement('div');
			cell.classList.add('cell', '_' + colIndex + '-' + cellIndex);
			cell.dataset.value = '0';
			col.appendChild(cell);
			data.board[colIndex].push(cell);
		}
	}
	const scoreBox = document.createElement('div'),
		undoButton = document.createElement('div'),
		resetButton = document.createElement('div'),
		infoContainer = document.createElement('div');
	scoreBox.classList.add('score', 'box');
	undoButton.classList.add('undo', 'button', 'box');
	resetButton.classList.add('reset', 'button', 'box');
	infoContainer.classList.add('info', 'container');
	document.body.appendChild(infoContainer);
	infoContainer.appendChild(scoreBox);
	infoContainer.appendChild(resetButton);
	infoContainer.appendChild(undoButton);
	scoreBox.textContent = data.score;
	undoButton.textContent = String.fromCharCode(8635);
	resetButton.textContent = String.fromCharCode(916);
}

function findEmptyCells(findType) {
	let condition = [],
		location = [];
	for (let colIndex = 0; colIndex < 4; colIndex++) {
		condition.push([]);
		data.board[colIndex].forEach(cell => {
			if (cell.dataset.value !== '0') condition[colIndex].push(false);
			else condition[colIndex].push(true);
		});
		condition[colIndex].forEach((cell, cellIndex) => {
			if (cell) location.push('_' + colIndex + '-' + cellIndex);
		});
	}
	if (findType === 1) return condition;
	else return location;
}

function randomTileGenerator(cell) {
	let randomLogic = Math.floor(Math.random() * 10);
	if (randomLogic < 9) cell.dataset.value = '2';
	else cell.dataset.value = '4';
}

function addTiles() {
	let randomCellIdentifier = findEmptyCells()[Math.floor(Math.random() * (findEmptyCells().length - 1))];
	randomTileGenerator(document.querySelector('.' + randomCellIdentifier));
}

function moveTiles(direction) {
	if (direction == 0) { // top
		for (let colIndex = 0; colIndex < 4; colIndex++) {
			let tilesExistInCol = false,
				transfer = [];
			for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
				let currentCellValue = data.board[colIndex][cellIndex].dataset.value;
				if (currentCellValue !== '0') {
					tilesExistInCol = true;
					transfer.push(currentCellValue);
				}
			}
			let transferer = [];
			for (let transIndex = 0; transIndex < transfer.length; transIndex++) {
				if (transfer[transIndex] === transfer[transIndex + 1]) {
					let score = Number(transfer[transIndex] * 2);
					data.score += score;
					document.querySelector('.score.box').textContent = data.score;
					transferer.push(String(score));
					transIndex++;
				} else {
					transferer.push(transfer[transIndex])
				}
			}
			transfer = transferer;
			if (tilesExistInCol) {
				for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
					if (typeof transfer[cellIndex] !== 'undefined') {
						data.board[colIndex][cellIndex].dataset.value = transfer[cellIndex];
					} else {
						data.board[colIndex][cellIndex].dataset.value = '0';
					}
				}
			}
		}
	} else if (direction == 1) { // right
		for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
			let tilesExistInRow = false,
				transfer = [];
			for (let colIndex = 3; colIndex >= 0; colIndex--) {
				let currentCellValue = data.board[colIndex][cellIndex].dataset.value;
				if (currentCellValue !== '0') {
					tilesExistInRow = true;
					transfer.push(currentCellValue);
				}
			}
			let transferer = [];
			for (let transIndex = 0; transIndex < transfer.length; transIndex++) {
				if (transfer[transIndex] === transfer[transIndex + 1]) {
					let score = Number(transfer[transIndex] * 2);
					data.score += score;
					document.querySelector('.score.box').textContent = data.score;
					transferer.push(String(score));
					transIndex++;
				} else {
					transferer.push(transfer[transIndex])
				}
			}
			transfer = transferer;
			if (tilesExistInRow) {
				for (let colIndex = 3, transIndex = 0; colIndex >= 0, transIndex < 4; colIndex-- , transIndex++) {
					if (typeof transfer[transIndex] !== 'undefined') {
						data.board[colIndex][cellIndex].dataset.value = transfer[transIndex];
					} else {
						data.board[colIndex][cellIndex].dataset.value = '0';
					}
				}
			}
		}
	} else if (direction == 2) { // bottom
		for (let colIndex = 0; colIndex < 4; colIndex++) {
			let tilesExistInCol = false,
				transfer = [];
			for (let cellIndex = 3; cellIndex >= 0; cellIndex--) {
				let currentCellValue = data.board[colIndex][cellIndex].dataset.value;
				if (currentCellValue !== '0') {
					tilesExistInCol = true;
					transfer.push(currentCellValue);
				}
			}
			let transferer = [];
			for (let transIndex = 0; transIndex < transfer.length; transIndex++) {
				if (transfer[transIndex] === transfer[transIndex + 1]) {
					let score = Number(transfer[transIndex] * 2);
					data.score += score;
					document.querySelector('.score.box').textContent = data.score;
					transferer.push(String(score));
					transIndex++;
				} else {
					transferer.push(transfer[transIndex])
				}
			}
			transfer = transferer;
			if (tilesExistInCol) {
				for (let cellIndex = 3, transIndex = 0; cellIndex >= 0, transIndex < 4; cellIndex-- , transIndex++) {
					if (typeof transfer[transIndex] !== 'undefined') {
						data.board[colIndex][cellIndex].dataset.value = transfer[transIndex];
					} else {
						data.board[colIndex][cellIndex].dataset.value = '0';
					}
				}
			}
		}
	} else if (direction == 3) { // left
		for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
			let tilesExistInRow = false,
				transfer = [];
			for (let colIndex = 0; colIndex < 4; colIndex++) {
				let currentCellValue = data.board[colIndex][cellIndex].dataset.value;
				if (currentCellValue !== '0') {
					tilesExistInRow = true;
					transfer.push(currentCellValue);
				}
			}
			let transferer = [];
			for (let transIndex = 0; transIndex < transfer.length; transIndex++) {
				if (transfer[transIndex] === transfer[transIndex + 1]) {
					let score = Number(transfer[transIndex] * 2);
					data.score += score;
					document.querySelector('.score.box').textContent = data.score;
					transferer.push(String(score));
					transIndex++;
				} else {
					transferer.push(transfer[transIndex])
				}
			}
			transfer = transferer;
			if (tilesExistInRow) {
				for (let colIndex = 0; colIndex < 4; colIndex++) {
					if (typeof transfer[colIndex] !== 'undefined') {
						data.board[colIndex][cellIndex].dataset.value = transfer[colIndex];
					} else {
						data.board[colIndex][cellIndex].dataset.value = '0';
					}
				}
			}
		}
	} else throw Error('Invalid direction parameter for moveTiles()');
}

function savePrevBoardState() {
	let prevBoardState = [];
	for (let colIndex = 0; colIndex < 4; colIndex++) {
		prevBoardState.push([]);
		for (let cellIndex = 0; cellIndex < 4; cellIndex++)
			prevBoardState[colIndex].push(data.board[colIndex][cellIndex].dataset.value)
	}
	data.prevBoardState = prevBoardState;
}

function returnPrevBoardState() {
	for (let colIndex = 0; colIndex < 4; colIndex++)
		for (let cellIndex = 0; cellIndex < 4; cellIndex++)
			data.board[colIndex][cellIndex].dataset.value = data.prevBoardState[colIndex][cellIndex];
}

function checkForWin() {
	let winExists = false;
	for (let colIndex = 0; colIndex < 4; colIndex++)
		for (let cellIndex = 0; cellIndex < 4; cellIndex++)
			if (data.board[colIndex][cellIndex].dataset.value === '2048') winExists = true;
	return winExists;
}

function checkForGameOver() {
	for (let colIndex = 0; colIndex < 4; colIndex++) // top
		for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
			if (data.board[colIndex][cellIndex].dataset.value === '0') return false;
			else if (cellIndex !== 3)
				if (data.board[colIndex][cellIndex].dataset.value === data.board[colIndex][cellIndex + 1].dataset.value) return false;
		}
	for (let cellIndex = 0; cellIndex < 4; cellIndex++) // left
		for (let colIndex = 0; colIndex < 4; colIndex++) {
			if (data.board[colIndex][cellIndex].dataset.value === '0') return false;
			else if (colIndex !== 3)
				if (data.board[colIndex][cellIndex].dataset.value === data.board[colIndex + 1][cellIndex].dataset.value) return false;
		}
	return true;
}

function checkIfTilesMoved() {
	let tilesMoved = false;
	for (let colIndex = 0; colIndex < 4; colIndex++)
		for (let cellIndex = 0; cellIndex < 4; cellIndex++)
			if (data.board[colIndex][cellIndex].dataset.value !== data.prevBoardState[colIndex][cellIndex])
				tilesMoved = true;
	return tilesMoved;
}

function resetBoard() {
	for (let colIndex = 0; colIndex < 4; colIndex++)
		for (let cellIndex = 0; cellIndex < 4; cellIndex++)
			data.board[colIndex][cellIndex].dataset.value = '0';
	data.score = 0;
	document.querySelector('.score.box').textContent = data.score;
	for (let rep = 0; rep < 2; rep++) addTiles();
	data.prevBoardState = null;
}

function displayPopup(text, optArray) {
	if (!document.querySelector('.modal')) {
		let modal = document.createElement('div'),
			popup = document.createElement('div'),
			optionsContainer = document.createElement('div');
		modal.classList.add('modal');
		popup.classList.add('popup');
		popup.textContent = text;
		optionsContainer.classList.add('options', 'container');
		for (let i = 0; i < optArray.length; i++) {
			let indexedOptionsButton = document.createElement('div');
			indexedOptionsButton.classList.add('opt', '_' + i, 'button', 'box');
			indexedOptionsButton.textContent = optArray[i].text;
			indexedOptionsButton.addEventListener('click', () => {
				if (optArray[i].fn === 0) modal.remove();
				else {
					optArray[i].fn();
					modal.remove();
				}
			});
			optionsContainer.appendChild(indexedOptionsButton);
		}
		document.body.appendChild(modal);
		modal.appendChild(popup);
		modal.appendChild(optionsContainer);
	}
}

document.addEventListener('keydown', (e) => {
	if ([37, 38, 39, 40, 65, 68, 83, 87].includes(e.keyCode)) {
		savePrevBoardState();
		if ([38, 87].includes(e.keyCode)) moveTiles(0);
		else if ([39, 68].includes(e.keyCode)) moveTiles(1);
		else if ([40, 83].includes(e.keyCode)) moveTiles(2);
		else if ([37, 65].includes(e.keyCode)) moveTiles(3);
		if (checkIfTilesMoved()) addTiles();
		if (checkForWin() && data.win < 1) {
			displayPopup('you win!', [
				{
					text: 'again?',
					fn: resetBoard
				},
				{
					text: 'continue',
					fn: 0
				}
			]);
			data.win++;
		} else if (checkForGameOver()) displayPopup('game over.', [
			{
				text: 'again?',
				fn: resetBoard
			}
		]);
	}
	if (e.ctrlKey || e.metaKey) {
		if (e.keyCode === 90) returnPrevBoardState();
		else if (e.keyCode === 88) resetBoard();
	}
});

drawBoard(), resetBoard();

document.querySelector('.undo.button').addEventListener('click', returnPrevBoardState);
document.querySelector('.reset.button').addEventListener('click', resetBoard);