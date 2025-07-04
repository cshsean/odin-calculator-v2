const previousOutput = document.querySelector('.previousOutput');
const currentOutput = document.querySelector('.currentOutput');
const buttons = document.querySelectorAll('.btn');

const operators = ['+','-','/','*'];
const parentheses = ['(', ')'];

let currentExpression = "";
let previousExpression = "";
let previousAnswer = "";

let justEvaluated = false;

currentOutput.innerHTML = currentExpression;
previousOutput.innerHTML = previousExpression;

buttons.forEach(button => {
    button.addEventListener("click", () => { 
        const value = button.dataset.value;

        switch(value) {
            case "C":
                if (currentExpression.toLowerCase().includes("error") || currentExpression.toLowerCase().includes("zero")) {
                    currentExpression = "";
                } else if (currentExpression === "" && previousExpression.length > 0) {
                    previousExpression = "";
                } else {
                    currentExpression = currentExpression.slice(0, -1);
                }
                break;
            case "=":
                let output = calculate(currentExpression);
                if (!(output.toLowerCase().includes("error") || output.toLowerCase().includes("zero"))) {
                    previousExpression = currentExpression;
                    previousAnswer = output;
                    const roundedOutput = parseFloat(parseFloat(output).toFixed(7)).toString();
                    currentExpression = roundedOutput;
                    justEvaluated = true;
                } else {
                    currentExpression = output;
                    justEvaluated = false;
                }
                break;
            default:
                if (currentExpression.toLowerCase().includes("error") || currentExpression.toLowerCase().includes("zero")) {
                    currentExpression = "";
                }
                if (justEvaluated) {
                    if (operators.includes(value)) {
                        currentExpression = previousAnswer + value; // use full precision
                    } else {
                        currentExpression = value;
                    }
                    justEvaluated = false;
                } else {
                    currentExpression += value;
                }
                break;
        }

        currentOutput.innerHTML = currentExpression;
        previousOutput.innerHTML = previousExpression;
    })
})

function calculate(expression) {
/*
Lets break this down into 3 parts: tokenization, tokenToPrefix and PrefixToOutput
1) Tokenization:
    Goal: convert all elements to its own token
    Eg. 1+2*(4/5)*-1 -> ['1','+','2','*','(','4','/','5',')','*','-1']
    NOTE: Take note of negative numbers and floating points eg. -1 and 1.2
2) Token to Postfix:
We need two lists: stack and output
iterate thru the token list
    -> if number, input into output
    -> if operator, check the top of the stack first
        -> if curr operator is equal or greater in precedence to operator on top of stack,
            pop stack to output before adding curr operator to stack
    -> if (, add to stack
    -> if ), keep popping stack to output until ( is found
if stack not empty, pop all remaining operators from stack to output
3) Postfix to Output
from left to right, add the numbers to the stack
if there is a operator, pop the first two values and push the result of the calculation
keep doing this until there is only one value left in stack, and return first value in stack
*/
    try {
        let tokens = expressionToTokens(expression);
        let postfix = tokenToPostFix(tokens);
        let output = postFixToOutput(postfix);
        if (output == 'NaN')  output = "Error"
        return output;
    } catch (error) {
        console.log("error caught");
        return "Error";
    }
}

function postFixToOutput(postfix) {
    let output = [];
    for (let i = 0; i < postfix.length; i++) {
        if (!isNaN(postfix[i])) {
            output.push(postfix[i].toString());
        } else {
            let product;
            let val1 = parseFloat(output.pop());
            let val2 = parseFloat(output.pop());
            switch(postfix[i]) {
                case '+':
                    product = val1 + val2;
                    break;
                case '-':
                    product = val2 - val1;
                    break;
                case '*':
                    product = val1 * val2;
                    break;
                case '/':
                    if (val1 == 0) {
                        console.log("error, cannot divide by zero");
                        throw new Error("Cannot Divide by Zero");
                    }
                    product = val2 / val1;
                    break;
            }
            output.push(product.toString())
        }
    }
    return output[0].toString();
}

function tokenToPostFix(tokenList) {
    let stack = [];
    let output = [];

    for (let i = 0; i < tokenList.length; i++) {
        // if curr value is number, add to output
        if (!isNaN(tokenList[i])) {
            output.push(tokenList[i]);
        }
        // if curr value is an operator 
        else if (operators.includes(tokenList[i])) {
            let currOp = tokenList[i];
            while (stack.length > 0 && operators.includes(stack[stack.length-1]) && getPrecedence(currOp) <= getPrecedence(stack[stack.length-1])) {
                output.push(stack.pop());
            }
            stack.push(currOp);
        }
        // if curr value is a '('
        else if (tokenList[i] === '(') {
            stack.push(tokenList[i]);
        }
        // if curr value is a ')'
        else if (tokenList[i] === ')') {
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                output.push(stack.pop());
            }
            if (stack.length > 0 && stack[stack.length-1] === '(') {
                stack.pop();
            } else {
                console.log("error, invalid parentheses");
                throw new Error("Invalid Parentheses");
            }
        }
    }

    while (stack.length > 0) {
        output.push(stack.pop());
    }

    return output;
}

function getPrecedence(char) {
    switch (char) {
        case "(":
        case ")":
            return 3;
        case "*":
        case "/":
            return 2;
        case "+":
        case "-":
            return 1;
    }
}

function expressionToTokens(expression) {
    let tokens = [];
    let currValue = '';

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        const prevToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;

        if (char === ' ') continue;

        // Check for numbers and decimal points
        if (!isNaN(char) || char === '.') {
            if (char === '.' && currValue.includes('.')) {
                throw new Error("Invalid number: multiple decimal points");
            }
            if (prevToken === ')') {
                tokens.push('*');
            }
            currValue += char;
        } 
        // Check for operators
        else if (operators.includes(char)) {
            // Push any accumulated number first
            if (currValue !== '') {
                tokens.push(currValue);
                currValue = '';
            }

            // Now check the actual previous token (after pushing currValue)
            const actualPrevToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;

            // Handle unary minus and plus
            const isUnary = actualPrevToken === null || operators.includes(actualPrevToken) || actualPrevToken === '(';

            if (char === '-' && isUnary) {
                currValue = '-'; 
                continue;
            }
            if (char === '+' && isUnary) {
                continue;
            }
            
            if (operators.includes(actualPrevToken)) {
                throw new Error(`Invalid operator sequence: '${actualPrevToken}${char}'`);
            }

            tokens.push(char);
        } 
        // Check for open parenthesis
        else if (char === '(') {
            // Implicit multiplication
            if (currValue !== '' || prevToken === ')') {
                if (currValue !== '') {
                   tokens.push(currValue);
                   currValue = '';
                }
                tokens.push('*');
            }
            tokens.push(char);
        } 
        // Check for close parenthesis
        else if (char === ')') {
            if (currValue !== '') {
                tokens.push(currValue);
                currValue = '';
            }
            
            const updatedPrevToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
            if (updatedPrevToken === '(') {
                throw new Error("Empty parentheses '()' are not allowed");
            }

            tokens.push(char);
        } 
        else {
            console.log("error, unknown char found")
            throw new Error(`Unknown character: '${char}'`);
        }
    }

    if (currValue !== '') {
        tokens.push(currValue);
    }

    const lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
    if (lastToken !== null && (operators.includes(lastToken) || lastToken === '(')) {
        throw new Error("Expression cannot end with an operator or an open parenthesis");
    }

    return tokens;
}
