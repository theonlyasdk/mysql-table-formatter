// This script just sets the Bootstrap theme based on the user's color scheme preference
function setBootstrapTheme() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
}
setBootstrapTheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setBootstrapTheme);
