// TODO: make sure '0' is added

// ---- DOM Elements ----
const calculatorDisplay = document.querySelector(".calculator__display");
const calculatorBody = document.querySelector(".calculator__body");

// ---- Constants ----
const OPERATORS = ["+", "-", "*", "/"];
const FRACTION_DIGITS = 6;

// ---- Calculator State ----
let input = "0";
let firstOperand = null;
let secondOperand = null;
let operator = null;

// ---- Event Listeners ----
document.addEventListener("DOMContentLoaded", handleClear);

calculatorBody.addEventListener("click", function (event) {
	const button = event.target.closest("BUTTON");
	if (button) handleButtonClick(button.dataset.value);
});

window.addEventListener("keydown", handleKeyboardInput);

// ---- Handle Button Click ----
function handleButtonClick(value) {
	if (!isNaN(value)) handleNumber(value);
	else if (value === ".") handleDecimalPoint();
	else if (value === "negate") handleNegation();
	else if (OPERATORS.includes(value)) handleOperation(value);
	else if (value === "=") handleEvaluation();
	else if (value === "clear") handleClear();
	else if (value === "backspace") handleBackspace();
}

// ---- Handle Keyboard Input ----
function handleKeyboardInput(event) {
	event.preventDefault();

	if (event.key >= 0 && event.key <= 9) handleNumber(event.key);
	else if (event.key === ".") handleDecimalPoint();
	else if (event.altKey && event.code === "Minus") handleNegation();
	else if (OPERATORS.includes(event.key)) handleOperation(event.key);
	else if (event.key === "=" || event.key === "Enter") handleEvaluation();
	else if (event.key === "Escape" || event.key === "c" || event.key === "C")
		handleClear();
	else if (event.key === "Backspace") handleBackspace();
}

// ---- Handle Number Input ----
function handleNumber(digit) {
	// Reset if no operator and result displayed
	if (firstOperand !== null && operator === null) {
		firstOperand = null;
		input = "0";
	}

	// Prevent multiple leading zeros
	if (input === "0" && digit === "0") return;

	if (input === "0") {
		input = digit;
	} else {
		input += digit;
	}

	updateDisplay(input);
}

// ---- Handle Decimal Point ----
function handleDecimalPoint() {
	// Prevent multiple decimal points
	if (input.includes(".")) return;

	input += ".";
	updateDisplay(input);
}

// ---- Handle Negation (+/-) ----
function handleNegation() {
	if (firstOperand !== null) {
		firstOperand = -firstOperand;
	}

	// Toggle between positive and negative
	if (input.startsWith("-")) input = input.slice(1);
	else input = "-" + input;

	// Ensure "-0" is displayed as "0"
	if (input === "-0") input = "0";

	updateDisplay(input);
}

// ---- Handle Operator ----
function handleOperation(operation) {
	// If no number is entered, just update the operator (prevents unwanted evaluation)
	if (input === "") {
		operator = operation;
		return;
	}

	// Set firstOperand if it's not set
	if (firstOperand === null) {
		firstOperand = parseFloat(input);
	}
	// If there's already an operator, evaluate the current expression first
	else if (operator !== null && secondOperand === null) {
		secondOperand = parseFloat(input);
		handleEvaluation();
	}

	input = "0";
	operator = operation;
}

// ---- Handle Evaluation (Equals) ----
function handleEvaluation() {
	// Only evaluate if both numbers and an operator are present
	if (firstOperand === null || operator === null || input === "") return;

	secondOperand = parseFloat(input);

	try {
		const result = operate(operator, firstOperand, secondOperand);
		updateDisplay(result);

		input = String(result);
		firstOperand = result;
		secondOperand = null;
		operator = null;
	} catch (error) {
		// Handle errors like division by zero
		resetCalculator();
		updateDisplay("Math Error");
	}
}

// ---- Handle Backspace ----
function handleBackspace() {
	// Remove last character and update display
	input = input.slice(0, -1) || "0";

	if (firstOperand !== null) firstOperand = parseFloat(input);

	if (input === "-") input = "0";

	updateDisplay(input);
}

// ---- Handle Clear ----
function handleClear() {
	resetCalculator();
	updateDisplay("0");
}

// ---- Reset Calculator State ----
function resetCalculator() {
	input = "0";
	firstOperand = secondOperand = operator = null;
}

// ---- Update Display ----
function updateDisplay(text) {
	calculatorDisplay.textContent = text;
}

// ---- Math Operations ----
function add(a, b) {
	return a + b;
}

function subtract(a, b) {
	return a - b;
}

function multiply(a, b) {
	return a * b;
}

function divide(a, b) {
	if (b === 0) {
		throw new Error("Cannot divide by zero");
	}
	return a / b;
}

// ---- Perform Operation ----
function operate(operator, a, b) {
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
