// ---- DOM Elements ----
const display = document.querySelector(".calculator__display");
const buttons = document.querySelectorAll(".calculator__button");

// ---- Constants & States ----
const OPERATORS = ["+", "-", "*", "/"];
const FRACTION_DIGITS = 3;

// ---- Event Listeners ----
buttons.forEach((button) =>
	button.addEventListener("click", function (event) {
		handleButtonClick(event.target.dataset.value);
	})
);

// ---- Functions ----

function handleButtonClick(value) {
	if (!isNaN(value)) handleNumberInput(value);
	else if (value === ".") handleDecimalPointInput();
	else if (OPERATORS.includes(value)) handleOperatorInput(value);
	else if (value === "=") handleEvaluation();
	else if (value === "clear") handleClear();
	else if (value === "backspace") handleBackspace();
	else if (value === "negate") handleNegation();
}

function handleNumberInput(digit) {}

function handleDecimalPointInput() {}

function handleNegation() {}

function handleOperatorInput(operator) {}

function handleEvaluation() {}

function handleBackspace() {}

function handleClear() {}

function round(number, fractionDigits = FRACTION_DIGITS) {
	const factor = 10 ** fractionDigits;

	console.log(Math.round(number * factor) / factor);

	return Math.round(number * factor) / factor;
}

function updateDisplay(text) {
	display.textContent = text;
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
