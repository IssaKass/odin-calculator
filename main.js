/**
 * Adds two numbers together.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of the two numbers.
 */
function add(a, b) {
	return a + b;
}

/**
 * Subtracts the second number from the first number.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The result of the subtraction.
 */
function subtract(a, b) {
	return a - b;
}

/**
 * Multiplies two numbers together.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns The product of the two numbers.
 */
function multiply(a, b) {
	return a * b;
}

/**
 * Divides the first number by the second number.
 *
 * @param {number} a - The dividend.
 * @param {number} b - The divisor.
 * @returns {number} The quotient of the division.
 * @throws {Error} If division by zero is attempted.
 */
function divide(a, b) {
	if (b === 0) {
		throw new Error("Cannot divide by zero");
	}
	return a / b;
}

/**
 *
 * @param {string} operator - The operator to use ("+", "-", "*", "/")
 * @param {*} a - The first operand.
 * @param {*} b - The second operand.
 * @returns {number} The result of the operation.
 * @throws {Error} If an invalid operator is provided.
 */
function operate(operator, a, b) {
	switch (operator) {
		case "+":
			return add(a, b);
		case "-":
			return subtract(a, b);
		case "*":
			return multiply(a, b);
		case "/":
			return divide(a, b);
		default:
			throw new Error(`Invalid operator: ${operator}`);
	}
}
