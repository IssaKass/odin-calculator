import { convertOperator } from "./format.js";
import { operate, round } from "./operations.js";

/**
 * DOM Elements
 */
const lastOperationDisplay = document.querySelector(".last-operation__display");
const currentOperationDisplay = document.querySelector(
	".current-operation__display"
);
const calculatorBody = document.querySelector(".calculator__body");

/**
 * State Variables
 */
const OPERATORS = ["+", "-", "*", "/"];
const MAX_LENGTH = Number.MAX_SAFE_INTEGER.toFixed().length;

const expression = {
	firstOperand: "",
	operator: "",
	secondOperand: "",
};
let shouldResetScreen = false;

/**
 * Event Listeners
 */
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

/**
 * Handles button clicks and directs input accordingly.
 * @param {string} value - The value of the button pressed.
 */
function handleButtonClick(value) {
	if (!isNaN(value)) handleNumber(value);
	else if (value === ".") handleDecimalPoint();
	else if (value === "negate") handleNegation();
	else if (OPERATORS.includes(value)) handleOperator(value);
	else if (value === "=") handleEvaluation();
	else if (value === "clear") handleClear();
	else if (value === "backspace") handleBackspace();
}

/**
 * Handles keyboard input and maps it to calculator functions.
 * @param {KeyboardEvent} event - The keyboard event.
 */
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

/**
 * Handles numeric input.
 * @param {string} digit - The digit pressed.
 */
function handleNumber(digit) {
	if (shouldResetScreen) {
		resetCalculator();
		shouldResetScreen = false;
	}

	let targetOperand = !expression.operator ? "firstOperand" : "secondOperand";
	expression[targetOperand] = updateOperand(expression[targetOperand], digit);
	updateCurrentOperationDisplay(expression[targetOperand]);
}

/**
 * Updates operand value while preventing excessive length.
 * @param {string} currentOperand - The current operand value.
 * @param {string} digit - The new digit to add.
 * @returns {string} The updated operand.
 */
function updateOperand(currentOperand, digit) {
	if (currentOperand.length === MAX_LENGTH) return currentOperand;

	// Replace leading zero with digit.
	if (currentOperand === "0") return digit;

	// Append digit to operand.
	return currentOperand + digit;
}

/**
 * Handles decimal point input.
 */
function handleDecimalPoint() {
	if (shouldResetScreen) {
		handleClear();
		shouldResetScreen = false;
	}

	let targetOperand = !expression.operator ? "firstOperand" : "secondOperand";
	expression[targetOperand] = updateDecimal(expression[targetOperand]);
	updateCurrentOperationDisplay(expression[targetOperand]);
}

/**
 * Ensures valid decimal point placement.
 */
function updateDecimal(currentOperand) {
	// Add leading zero if operand is initially empty.
	if (currentOperand === "") return "0.";

	// Do not add another decimal if one already exists.
	if (currentOperand.includes(".")) return currentOperand;

	// Append decimal point to the current operand.
	return currentOperand + ".";
}

/**
 * Handles negation of the current operand.
 */
function handleNegation() {
	let targetOperand = !expression.operator ? "firstOperand" : "secondOperand";
	expression[targetOperand] = updateNegation(expression[targetOperand]);
	updateCurrentOperationDisplay(expression[targetOperand]);
}

/**
 * Toggles negation.
 */
function updateNegation(currentOperand) {
	if (currentOperand === "") return "";

	// Flip sign
	currentOperand = !currentOperand.startsWith("-")
		? "-" + currentOperand
		: currentOperand.slice(1);

	// Correct negative zero to positive zero.
	return currentOperand === "-0" ? "0" : currentOperand;
}

/**
 * Handles operator input.
 */
function handleOperator(currentOperator) {
	if (expression.firstOperand === "") return;

	updateLastOperationDisplay({ ...expression, operator: currentOperator });

	if (expression.secondOperand !== "") {
		evaluateExpression();
	}

	if (shouldResetScreen) shouldResetScreen = false;

	expression.operator = currentOperator;
}

/**
 * Handles evaluation of the expression.
 */
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

/**
 * Evaluates the current expression.
 */
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

/**
 * Handles backspace input.
 */
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

/**
 * Resets the calculator.
 */
function handleClear() {
	resetCalculator();
	clearLastOperationDisplay();
	clearCurrentOperationDisplay();
	shouldResetScreen = false;
}

/**
 * Resets the calculator expression.
 */
function resetCalculator() {
	expression.firstOperand = "";
	expression.operator = "";
	expression.secondOperand = "";
}

/**
 * Updates the last operation display.
 * @param {Object} expression - The current expression.
 * @param {boolean} [equals=false] - Whether to display the equals sign.
 */
function updateLastOperationDisplay(expression, equals = false) {
	const { firstOperand, operator, secondOperand } = expression;
	const convertedOperator = convertOperator(operator);

	const text = equals
		? `${firstOperand} ${convertedOperator} ${secondOperand} =`
		: `${firstOperand} ${convertedOperator}`;

	lastOperationDisplay.textContent = text.trim();
}

/**
 * Clears the last operation display.
 */
function clearLastOperationDisplay() {
	lastOperationDisplay.textContent = "";
}

/**
 * Updates the current operation display.
 * @param {string} [text=""] - The text to display.
 */
function updateCurrentOperationDisplay(text = "") {
	currentOperationDisplay.textContent = text || "0";
}

/**
 * Clears the current operation display.
 */
function clearCurrentOperationDisplay() {
	currentOperationDisplay.textContent = "0";
}

/**
 * Adds an active class to a button temporarily.
 * @param {HTMLElement} button - The button to activate.
 */
function activateButton(button) {
	button.classList.add("active");
	setTimeout(() => button.classList.remove("active"), 100);
}

/**
 * Activates a button based on a key press.
 * @param {string} value - The button value.
 */
function activateButtonFromKey(value) {
	const button = document.querySelector(`[data-value="${value}"]`);
	if (button) activateButton(button);
}
