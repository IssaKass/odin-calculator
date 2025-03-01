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
calculatorBody.addEventListener("click", function (event) {
	const button = event.target.closest("BUTTON");
	if (button) handleButtonClick(button.dataset.value);
});

document.addEventListener("DOMContentLoaded", handleClear);

// ---- Handle Button Click ----
function handleButtonClick(value) {
	if (!isNaN(value)) handleNumber(value);
	else if (value === ".") handleDecimalPoint();
	else if (OPERATORS.includes(value)) handleOperation(value);
	else if (value === "=") handleEvaluation();
	else if (value === "clear") handleClear();
	else if (value === "backspace") handleBackspace();
	else if (value === "negate") handleNegation();
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

	input += digit;
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

	input = "";
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
		updateDisplay("Math Error");
		resetCalculator();
	}
}

// ---- Handle Backspace ----
function handleBackspace() {
	// Remove last character and update display
	input = input.slice(0, -1) || "0";

	updateDisplay(input);
}

// ---- Handle Clear ----
function handleClear() {
	resetCalculator();
	updateDisplay("");
}

// ---- Reset Calculator State ----
function resetCalculator() {
	input = "0";
	firstOperand = secondOperand = operator = null;
}

// ---- Update Display ----
function updateDisplay(text) {
	if (isNaN(text)) {
		calculatorDisplay.textContent = text;
		return;
	}

	const formattedOutput = new Intl.NumberFormat("en", {
		minimumFractionDigits: 0,
		maximumFractionDigits: FRACTION_DIGITS,
		useGrouping: true,
		style: "decimal",
		signDisplay: "auto",
	}).format(text);

	calculatorDisplay.textContent = formattedOutput;
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
