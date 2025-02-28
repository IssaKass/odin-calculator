// ---- DOM Elements ----
const display = document.querySelector(".calculator__display");
const buttons = document.querySelectorAll(".calculator__button");

// ---- Constants & States ----
const OPERATORS = ["+", "-", "*", "/", "%"];
let currentInput = "";
let firstOperand = null;
let secondOperand = null;
let operator = null;
let result = null;

// ---- Event Listeners ----
buttons.forEach((button) =>
	button.addEventListener("click", function (event) {
		handleButtonClick(event.target.dataset.value);
	})
);

// ---- Functions ----

/**
 * Handles button clicks by determining the type of input.
 *
 * @param {string} value - The value of the clicked button.
 */
function handleButtonClick(value) {
	if (!isNaN(value) || value === ".") handleNumber(value);
	else if (OPERATORS.includes(value)) handleOperator(value);
	else if (value === "=") handleEvaluation();
	else if (value === "clear") handleClear();
	else if (value === "backspace") handleBackspace();
}

/**
 * Handles number input, including decimals.
 *
 * @param {string} value - The number or decimal point.
 */
function handleNumber(value) {
	// Prevent multiple decimals
	if (value === "." && currentInput.includes(".")) return;

	// Prevent leading zeros
	if (currentInput === "0" && value !== ".") currentInput = "";

	currentInput += value;
	updateDisplay(currentInput);
}

/**
 * Handles operator input and manages operands.
 *
 * @param {string} value - The operator (+, -, *, /, %).
 */
function handleOperator(value) {
	// Ignore if no number is present
	if (currentInput === "") return;

	if (firstOperand === null) {
		firstOperand = parseFloat(currentInput);
	} else if (operator) {
		secondOperand = parseFloat(currentInput);
		handleEvaluation();
	}

	operator = value;
	currentInput = "";
}

/**
 * Evaluates the current expression.
 */
function handleEvaluation() {
	// Only evaluate if all parts are present
	if (firstOperand !== null && operator !== null && currentInput !== "") {
		secondOperand = parseFloat(currentInput);
	}

	// If any part is missing, do nothing
	if (firstOperand === null || operator === null || secondOperand === null)
		return;

	// Perform the calculation
	try {
		result = operate(operator, firstOperand, secondOperand);
	} catch (error) {
		updateDisplay("Math Error");
		currentInput = "";
		firstOperand = null;
		secondOperand = null;
		operator = null;
		result = null;
		return;
	}

	// Update display and prepare for next input
	updateDisplay(result);

	currentInput = String(result);
	firstOperand = null;
	secondOperand = null;
	operator = null;
}

/**
 * Handles backspace by removing the last character of the current input.
 */
function handleBackspace() {
	if (currentInput === "") {
		updateDisplay("");
		return;
	}

	currentInput = currentInput.slice(0, -1);
	updateDisplay(currentInput);
}

/**
 * Clears all inputs and resets the calculator state.
 */
function handleClear() {
	currentInput = "";
	firstOperand = null;
	secondOperand = null;
	operator = null;
	result = null;

	updateDisplay("");
}

/**
 * Updates the calculator display.
 *
 * @param {string|number} value - The value to display.
 */
function updateDisplay(value) {
	display.textContent = value;
}

// ---- Math Operations ----
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
