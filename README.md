# JavaScript Calculator

A clean, functional calculator built using HTML, CSS, and JavaScript. This project is special since this is my second time doing it. My first calculator website was lacking due to poor code structure and improper implementation of logic. This new project features a refined and accurate expression evaluation system using the **Shunting Yard algorithm**, along with improved button handling logic for a more elegant and efficient implementation.

## Features

-  Fully supports basic arithmetic operations: addition, subtraction, multiplication, and division  
-  Handles parentheses and operator precedence using the **Shunting Yard algorithm**  
-  Supports implicit multiplication (e.g., `2(3+4)` → `14`)  
-  Accurate rounding to avoid floating-point artifacts (e.g., `1/3 * 3 = 1`)  
-  Error detection for malformed expressions (e.g., `6--`, `3.3.3`, `()`)  
-  Uses `data-value` attributes for clean, scalable button logic  

## What I Learned

- How to work with **JavaScript syntax and logic**
- DOM manipulation and updating UI elements dynamically
- Handling edge cases in mathematical expression parsing
- Designing more maintainable and scalable frontend logic

## Improvements for the Future

- Support for **exponents** (`^`) and **scientific notation**
- **Keyboard input** support
- **History** of previous calculations
- **Scientific functions** (e.g., `sin`, `cos`, `log`, etc.)

## Getting Started

1. Clone/download this repository
2. Open `index.html` in your browser

```
git clone https://github.com/your-username/js-calculator.git
cd js-calculator
open index.html
```
