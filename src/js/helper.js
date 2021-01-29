/**
 * Creates a new <div/> element with the given `className`, `dataset`
 * attributes, and `textContent`
 * @param {string} className - the new element's class value
 * @param {Object} dataset - an object mapping of dataset attributes
 * @param {string} textContent - the new element's text value
 * @return {HTMLDivElement}
 */
export const createDiv = (className = "", dataset = {}, textContent = "") => {
	const element = document.createElement("div")
	element.textContent = textContent
	element.className = className

	for (const attribute in dataset)
		element.dataset[attribute] = dataset[attribute]
	return element
}

/**
 * Produces a random integer x such that 1 ≤ x ≤ n
 * @param {number} n - an integer for the upper limit of the return value
 * @return {number} a ranom integer satisfying the given condition
 */
export const generateRandomNumber = n => Math.floor(Math.random() * n) + 1

/**
 * Produces a random entry from the given array
 * @param {array} array - the simple array to pull an entry from
 */
export const getRandomChoice = array => array[generateRandomNumber(array.length) - 1]