/**
 * Mapping of mathematical operators to their display symbols.
 * Used to convert operators into a more user-friendly format.
 */
const operatorMap = {
	"+": "+",
	"-": "-",
	"*": "x",
	"/": "÷",
};

/**
 * Converts an operator symbol for display.
 * @param {string} operator - The operator to convert.
 * @returns {string} The converted operator.
 */
export function convertOperator(operator) {
	return operatorMap[operator] || operator;
}
