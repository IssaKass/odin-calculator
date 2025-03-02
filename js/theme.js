/**
 * On page load:
 *
 * 1. Get the elements and system settings.
 */
const themeToggleButton = document.querySelector("#toggle-theme-button");
const themeIcon = themeToggleButton.querySelector("i");
const savedTheme = localStorage.getItem("theme");
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * 2. Determine the current theme based on saved settings or system preference.
 */
let activeTheme = getCurrentTheme({ savedTheme, prefersDarkMode });

/**
 * 3. Apply the theme and update the button icon according to the active theme.
 */
updateToggleButton({
	button: themeToggleButton,
	isDarkMode: activeTheme === "dark",
});
applyTheme({ theme: activeTheme });

/**
 * 4. Add event listener to toggle between light and dark modes when the button is clicked.
 */
themeToggleButton.addEventListener("click", () => {
	const newTheme = activeTheme === "dark" ? "light" : "dark";

	localStorage.setItem("theme", newTheme);
	updateToggleButton({
		button: themeToggleButton,
		isDarkMode: newTheme === "dark",
	});
	applyTheme({ theme: newTheme });

	activeTheme = newTheme;
});

/**
 * Utility function to determine the current theme.
 * - First checks if a theme is saved in localStorage.
 * - If not, checks the system's color scheme preference.
 * - Defaults to light mode if no theme is set.
 */
function getCurrentTheme({ savedTheme, prefersDarkMode }) {
	if (savedTheme !== null) return savedTheme;

	return prefersDarkMode.matches ? "dark" : "light";
}

/**
 * Utility function to update the theme toggle button icon.
 * - Switches the icon between sun and moon based on the current theme.
 */
function updateToggleButton({ button, isDarkMode }) {
	button.setAttribute(
		"aria-label",
		isDarkMode ? "Change to light theme" : "Change to dark theme"
	);
	button
		.querySelector("i")
		.classList.replace(
			isDarkMode ? "fa-sun" : "fa-moon",
			isDarkMode ? "fa-moon" : "fa-sun"
		);
}

/**
 * Utility function to apply the theme to the HTML element.
 * - Sets the `data-theme` attribute on the <html> tag.
 */
function applyTheme({ theme }) {
	document.documentElement.setAttribute("data-theme", theme);
}
