// Operands are stored as string to allow easy append. They can be easily 
// transformed back to int using the unary plus operator.
let operandOne = '0'; 
let operandTwo = null;
let operatorActive = null; // Used also to check if operandTwo should be updated instead of operandOne.
let justEquated = false;
const display = document.querySelector('.display');

// params: input, string, [0-9]
function updateOperand(input) {
  if (justEquated && operatorActive == null) {
    justEquated = false;
    operandOne = '0';
  }
  if (operatorActive == null) {
    if (input === '.' && operandOne.includes('.')) {
      return;
    } else if (input === '.' && operandOne === '0') {
      operandOne = '0';
    } else if (operandOne === '0') {
      operandOne = '';
    }
    operandOne += input;
  } else {
    if (input === '.' && operandTwo === null) {
      operandTwo = '0';
    } else if (input === '.' && operandTwo.includes('.')) {
      return;
    } else if (operandTwo === null) {
      operandTwo = '';
    }
    operandTwo += input;
  }
  updateDisplay();
}

function updateDisplay() {
  if (operatorActive == null) {
    display.textContent = operandOne;
  } else {
    display.textContent = operandTwo;
  }
}

function selectOperator(operator) {
  justEquated = false;
  if (operandTwo != null) {
    equate();
  }
  operandTwo = null; // When a new operator is selected, operandTwo should reset.
  switch (operator) {
    case 'add':
      operatorActive = add;
      break;
    case 'subtract':
      operatorActive = subtract;
      break;
    case 'multiply':
      operatorActive = multiply;
      break;
    case 'divide':
      operatorActive = divide;
      break;
  }
}

function equate() {
  if (operatorActive == null) {
    // No operator is selected. Nothing happens.
    return;
  }
  if (operandTwo === null) {
    // An operator is selected, but no new input (operandTwo). 
    // operandOne is used as operandTwo.
    operandTwo = operandOne;
    operandOne = operatorActive(+operandOne, +operandTwo);
  } else {
    // Operator and both operands exist. The operation is applied.
    operandOne = operatorActive(+operandOne, +operandTwo);
  }
  if (operandTwo === '0' && operatorActive == divide) {
    display.textContent = "you can't divide by 0!";
    reset();
    return;
  }
  clearOperators();
  justEquated = true;
  updateDisplay();
}

function reset() {
  operandOne = '0'; 
  operandTwo = null;
  clearOperators();
  justEquated = false;
}

function ac() {
  reset();
  updateDisplay();
}

function del() {
  if (operatorActive == null) {
    if (operandOne.length > 1) {
      operandOne = operandOne.slice(0, -1);
    } else {
      operandOne = '0';
    }
    if (operandOne.charAt(operandOne.length - 1) === '.') {
      operandOne = operandOne.slice(0, -1);
    }
  } else {
    if (operandTwo.length > 1) {
      operandTwo = operandTwo.slice(0, -1);
    } else {
      operandTwo = '0';
    }
    if (operandTwo.charAt(operandTwo.length - 1) === '.') {
      operandTwo = operandTwo.slice(0, -1);
    }
  }
  updateDisplay();
}

function clearOperators() {
  document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('operator-active'));
  operatorActive = null;
}

document.querySelectorAll('.calculator button').forEach(
  btn => btn.addEventListener('click', () => {
    if (Number.isInteger(+btn.dataset.value)) {
      updateOperand(btn.dataset.value);
    } else if (btn.dataset.value === 'decimal') {
      updateOperand('.');
    } else if (btn.dataset.value === 'ac') {
      ac();
    } else if (btn.dataset.value === 'del') {
      del();
    } else if (btn.dataset.value === 'add' || btn.dataset.value === 'subtract' || btn.dataset.value === 'multiply' || btn.dataset.value === 'divide') {
      if (!btn.classList.contains('operator-active')) {
        document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('operator-active'));
        selectOperator(btn.dataset.value);
        btn.classList.add('operator-active');
      } else {
        clearOperators();
        display.textContent = operandOne;
        operandTwo = null;
      }
    } else if (btn.dataset.value === 'equals') {
      equate();
    }
  }));

  document.addEventListener('keydown', e => {
    if (Number.isInteger(+e.key)) {
      updateOperand(e.key);
    } else if (e.key === '.') {
      updateOperand('.');
    } else if (e.key === 'Delete') {
      ac();
    } else if (e.key === 'Backspace') {
      del();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      let operatorPressed;
      switch (e.key) {
        case '+':
          operatorPressed = 'add';
          break;
        case '-':
          operatorPressed = 'subtract';
          break;
        case '*':
          operatorPressed = 'multiply';
          break;
        case '/':
          operatorPressed = 'divide';
          break;
      }
      btn = document.querySelector(`[data-value=${operatorPressed}]`);
      if (!btn.classList.contains('operator-active')) {
        document.querySelectorAll('.operator').forEach(btn => btn.classList.remove('operator-active'));
        selectOperator(btn.dataset.value);
        btn.classList.add('operator-active');
      } else {
        clearOperators();
        display.textContent = operandOne;
        operandTwo = null;
      }
    } else if (e.key === 'Enter') {
      equate();
    }
  });

function add(x, y) {
  return `${+(x + y).toFixed(15)}`;
}

function subtract(x, y) {
  return `${+(x - y).toFixed(15)}`;
}

function multiply(x, y) {
  return `${+(x * y).toFixed(15)}`;
}

function divide(x, y) {
  return `${+(x / y).toFixed(15)}`;
}
