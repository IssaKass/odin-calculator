import { operate, round } from "./operations.js";

// ---- DOM Elements ----
const lastOperationDisplay = document.querySelector(".last-operation__display");
const currentOperationDisplay = document.querySelector(
	".current-operation__display"
);
const calculatorBody = document.querySelector(".calculator__body");

// ---- Constants ----
const OPERATORS = ["+", "-", "*", "/"];
const MAX_LENGTH = Number.MAX_SAFE_INTEGER.toFixed().length;
const operatorMap = {
	"+": "+",
	"-": "-",
	"*": "x",
	"/": "÷",
};

const expression = {
	firstOperand: "",
	operator: "",
	secondOperand: "",
};
let shouldResetScreen = false;

// ---- Event Listeners ----
document.addEventListener("DOMContentLoaded", handleClear);

calculatorBody.addEventListener("click", function (event) {
	const button = event.target.closest("BUTTON");
	if (button) {
		handleButtonClick(button.dataset.value);
		activateButton(button);
		button.blur();
	}
});

window.addEventListener("keydown", handleKeyboardInput);

// ---- Handle Button Click ----
function handleButtonClick(value) {
	if (!isNaN(value)) handleNumber(value);
	else if (value === ".") handleDecimalPoint();
	else if (value === "negate") handleNegation();
	else if (OPERATORS.includes(value)) handleOperator(value);
	else if (value === "=") handleEvaluation();
	else if (value === "clear") handleClear();
	else if (value === "backspace") handleBackspace();
}

// ---- Handle Keyboard Input ----
function handleKeyboardInput(event) {
	if (event.key >= 0 && event.key <= 9) {
		handleButtonClick(event.key);
		activateButtonFromKey(event.key);
	} else if (event.key === ".") {
		handleButtonClick(event.key);
		activateButtonFromKey(".");
	} else if (event.altKey && event.code === "Minus") {
		handleButtonClick("negate");
		activateButtonFromKey("negate");
	} else if (OPERATORS.includes(event.key)) {
		handleButtonClick(event.key);
		activateButtonFromKey(event.key);
	} else if (event.key === "=" || event.key === "Enter") {
		handleButtonClick("=");
		activateButtonFromKey("=");
	} else if (event.key === "Escape" || event.key === "c" || event.key === "C") {
		handleButtonClick("clear");
		activateButtonFromKey("clear");
	} else if (event.key === "Backspace") {
		handleButtonClick("backspace");
		activateButtonFromKey("backspace");
	}
}

function handleNumber(digit) {
	if (shouldResetScreen) {
		resetCalculator();
		shouldResetScreen = false;
	}

	let targetOperand = !expression.operator ? "firstOperand" : "secondOperand";
	expression[targetOperand] = updateOperand(expression[targetOperand], digit);
	updateCurrentOperationDisplay(expression[targetOperand]);
}

function updateOperand(currentOperand, digit) {
	if (currentOperand.length === MAX_LENGTH) return currentOperand;

	// Replace leading zero with digit.
	if (currentOperand === "0") return digit;

	// Append digit to operand.
	return currentOperand + digit;
}

function handleDecimalPoint() {
	if (shouldResetScreen) {
		handleClear();
		shouldResetScreen = false;
	}

	let targetOperand = !expression.operator ? "firstOperand" : "secondOperand";
	expression[targetOperand] = updateDecimal(expression[targetOperand]);
	updateCurrentOperationDisplay(expression[targetOperand]);
}

function updateDecimal(currentOperand) {
	// Add leading zero if operand is initially empty.
	if (currentOperand === "") return "0.";

	// Do not add another decimal if one already exists.
	if (currentOperand.includes(".")) return currentOperand;

	// Append decimal point to the current operand.
	return currentOperand + ".";
}

function handleNegation() {
	let targetOperand = !expression.operator ? "firstOperand" : "secondOperand";
	expression[targetOperand] = updateNegation(expression[targetOperand]);
	updateCurrentOperationDisplay(expression[targetOperand]);
}

function updateNegation(currentOperand) {
	if (currentOperand === "") return "";

	// Flip sign
	currentOperand = !currentOperand.startsWith("-")
		? "-" + currentOperand
		: currentOperand.slice(1);

	// Correct negative zero to positive zero.
	return currentOperand === "-0" ? "0" : currentOperand;
}

function handleOperator(currentOperator) {
	if (expression.firstOperand === "") return;

	updateLastOperationDisplay({ ...expression, operator: currentOperator });

	if (expression.secondOperand !== "") {
		evaluateExpression();
	}

	if (shouldResetScreen) shouldResetScreen = false;

	expression.operator = currentOperator;
}

function handleEvaluation() {
	if (
		expression.firstOperand === "" ||
		expression.operator === "" ||
		expression.secondOperand === ""
	) {
		return;
	}

	evaluateExpression();
}

function evaluateExpression() {
	try {
		const result = round(
			operate(
				expression.operator,
				parseFloat(expression.firstOperand),
				parseFloat(expression.secondOperand)
			)
		);

		updateLastOperationDisplay(expression, true);
		updateCurrentOperationDisplay(result);

		expression.firstOperand = result.toString();
		expression.operator = "";
		expression.secondOperand = "";
		shouldResetScreen = true;
	} catch (error) {
		handleClear();
		updateCurrentOperationDisplay("Math Error");
	}
}

function handleBackspace() {
	let targetOperand = !expression.operator ? "firstOperand" : "secondOperand";
	expression[targetOperand] = updateBackspace(expression[targetOperand]);
	updateCurrentOperationDisplay(expression[targetOperand]);
}

function updateBackspace(currentOperand) {
	// Remove last digit
	currentOperand = currentOperand.slice(0, -1);

	// Clear lone negative sign
	return currentOperand === "-" ? "" : currentOperand;
}

function handleClear() {
	resetCalculator();
	clearLastOperationDisplay();
	clearCurrentOperationDisplay();
	shouldResetScreen = false;
}

function resetCalculator() {
	expression.firstOperand = "";
	expression.operator = "";
	expression.secondOperand = "";
}

function updateLastOperationDisplay(expression, equals = false) {
	const { firstOperand, operator, secondOperand } = expression;
	const convertedOperator = convertOperator(operator);

	const text = equals
		? `${firstOperand} ${convertedOperator} ${secondOperand} =`
		: `${firstOperand} ${convertedOperator}`;

	lastOperationDisplay.textContent = text.trim();
}

function clearLastOperationDisplay() {
	lastOperationDisplay.textContent = "";
}

function updateCurrentOperationDisplay(text = "") {
	currentOperationDisplay.textContent = text || "0";
}

function clearCurrentOperationDisplay() {
	currentOperationDisplay.textContent = "0";
}

function activateButtonFromKey(value) {
	const button = document.querySelector(`[data-value="${value}"]`);
	if (button) activateButton(button);
}

function activateButton(button) {
	button.classList.add("active");
	setTimeout(() => button.classList.remove("active"), 100);
}

function convertOperator(operator) {
	return operatorMap[operator] || operator;
}
