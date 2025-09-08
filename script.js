const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';

// Helper to convert degrees to radians
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Replace symbols and functions for evaluation
function replaceMath(expr) {
  // Replace calculator symbols with JS operators
  expr = expr.replaceAll('÷', '/');
  expr = expr.replaceAll('×', '*');
  expr = expr.replaceAll('−', '-');
  expr = expr.replaceAll('^', '**');
  // Replace constants
  expr = expr.replaceAll(/π/g, Math.PI);
  expr = expr.replaceAll(/\be\b/g, Math.E);

  // Handle scientific functions (degrees assumed for sin, cos, tan)
  expr = expr.replace(/sin\(([^)]+)\)/g, (_, val) => `Math.sin(toRadians(${val}))`);
  expr = expr.replace(/cos\(([^)]+)\)/g, (_, val) => `Math.cos(toRadians(${val}))`);
  expr = expr.replace(/tan\(([^)]+)\)/g, (_, val) => `Math.tan(toRadians(${val}))`);
  expr = expr.replace(/ln\(([^)]+)\)/g, (_, val) => `Math.log(${val})`);
  expr = expr.replace(/log10?\(([^)]+)\)/g, (_, val) => `Math.log10(${val})`);
  expr = expr.replace(/sqrt\(([^)]+)\)/g, (_, val) => `Math.sqrt(${val})`);

  return expr;
}

// Add click event listeners to all buttons
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.getAttribute('data-value');
    if (value === 'C') {
      expression = '';
      display.value = '';
    } else if (value === '=') {
      try {
        let evalExpr = replaceMath(expression);
        // Make toRadians available when using eval
        const result = Function('toRadians', '"use strict"; return (' + evalExpr + ')')(toRadians);
        display.value = result !== undefined ? result : '';
        expression = result !== undefined ? result.toString() : '';
      } catch {
        display.value = 'Error';
        expression = '';
      }
    } else if (value === 'DEL') {
      expression = expression.slice(0, -1);
      display.value = expression;
    } else {
      expression += value;
      display.value = expression;
    }
  });
});