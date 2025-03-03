/**
 * Adds two numbers and returns the result.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of a and b.
 */
export function add(a, b) {
	return a + b;
}

/**
 * Subtracts the second number from the first and returns the result.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The result of a - b.
 */
export function subtract(a, b) {
	return a - b;
}

/**
 * Multiplies two numbers and returns the result.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The product of a and b.
 */
export function multiply(a, b) {
	return a * b;
}

/**
 * Divides the first number by the second and returns the result.
 * Throws an error if attempting to divide by zero.
 * @param {number} a - The numerator.
 * @param {number} b - The denominator.
 * @returns {number} The quotient of a / b.
 * @throws {Error} If b is zero.
 */
export function divide(a, b) {
	if (b === 0) {
		throw new Error("Cannot divide by zero");
	}
	return a / b;
}

/**
 * Performs a mathematical operation on two numbers based on the given operator.
 * @param {string} operator - The operator ('+', '-', '*', '/').
 * @param {number|string} a - The first operand (converted to a number if needed).
 * @param {number|string} b - The second operand (converted to a number if needed).
 * @returns {number|null} The result of the operation, or null if the operator is invalid.
 */
export function operate(operator, a, b) {
	a = Number(a);
	b = Number(b);

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
			return null;
	}
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param {number} number - The number to round.
 * @param {number} [fractionDigits=6] - The number of decimal places (default is 6).
 * @returns {number} The rounded number.
 */
export function round(number, fractionDigits = 6) {
	return Number(number.toFixed(fractionDigits));
}
