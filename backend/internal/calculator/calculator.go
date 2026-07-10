package calculator

import (
	"errors"
	"math"
)

var (
	ErrDivisionByZero  = errors.New("division by zero is not allowed")
	ErrInvalidOperator = errors.New("invalid operator")
	ErrNegativeSqrt    = errors.New("cannot take square root of a negative number")
)

func Calculate(op string, num1, num2 float64) (float64, error) {
	switch op {
	case "+":
		return num1 + num2, nil
	case "-":
		return num1 - num2, nil
	case "*":
		return num1 * num2, nil
	case "/":
		if num2 == 0 {
			return 0, ErrDivisionByZero
		}
		return num1 / num2, nil
	case "^":
		return math.Pow(num1, num2), nil
	case "sqrt":
		if num1 < 0 {
			return 0, ErrNegativeSqrt
		}
		return math.Sqrt(num1), nil
	case "%":
		return (num1 * num2) / 100, nil
	default:
		return 0, ErrInvalidOperator
	}
}