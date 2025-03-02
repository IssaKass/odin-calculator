export function add(a, b) {
	return a + b;
}

export function subtract(a, b) {
	return a - b;
}

export function multiply(a, b) {
	return a * b;
}

export function divide(a, b) {
	if (b === 0) {
		throw new Error("Cannot divide by zero");
	}
	return a / b;
}

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

export function round(number, fractionDigits = 6) {
	return Number(number.toFixed(fractionDigits));
}
