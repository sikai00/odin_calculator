// Operands are stored as string to allow easy append. They can be easily 
// transformed back to int using the unary plus operator.
let operandOne = '0'; 
let operandTwo = null;
let operatorActive = null; // Used also to check if operandTwo should be updated instead of operandOne.

const display = document.querySelector('.display');

// params: input, string, [0-9]
function updateOperand(input) {
  if (operatorActive == null) {
    if (operandOne === '0') {
      operandOne = '';
    }
    operandOne += input;
  } else {
    if (operandTwo === null) {
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
    console.log('No operator');
    return;
  }
  if (operandTwo === null) {
    // An operator is selected, but no new input (operandTwo). 
    // operandOne is used as operandTwo.
    operandTwo = operandOne;
    operandOne = operatorActive(+operandOne, +operandTwo);
    console.log('Single operand');
  } else {
    // Operator and both operands exist. The operation is applied.
    operandOne = operatorActive(+operandOne, +operandTwo);
    console.log('Both operands');
  }
  operatorActive = null;
  updateDisplay();
}

function ac() {
  operandOne = '0'; 
  operandTwo = null;
  operatorActive = null;
  updateDisplay();
}

function del() {
  if (operatorActive == null) {
    if (operandOne.length > 1) {
      operandOne = operandOne.slice(0, -1);
    } else {
      operandOne = '0';
    }
  } else {
    if (operandTwo.length > 1) {
      operandTwo = operandTwo.slice(0, -1);
    } else {
      operandTwo = '0';
    }
  }
  updateDisplay();
}

document.querySelectorAll('.calculator button').forEach(
  btn => btn.addEventListener('click', () => {
    if (Number.isInteger(+btn.dataset.value)) {
      updateOperand(btn.dataset.value);
    } else if (btn.dataset.value === 'ac') {
      ac();
    } else if (btn.dataset.value === 'del') {
      del();
    } else if (btn.dataset.value === 'add' || btn.dataset.value === 'subtract' || btn.dataset.value === 'multiply' || btn.dataset.value === 'divide') {
      selectOperator(btn.dataset.value);
    } else if (btn.dataset.value === 'equals') {
      equate();
    }
  }));

function add(x, y) {
  return `${x + y}`;
}

function subtract(x, y) {
  return `${x - y}`;
}

function multiply(x, y) {
  return `${x * y}`;
}

function divide(x, y) {
  return `${x / y}`;
}