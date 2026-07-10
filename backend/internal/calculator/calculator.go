package calculator

import (
	"errors"
	"math"
)

var (
	ErrorDivByZero = errors.New("Division by zero is not allowed")
	ErrorInvalidOperator = errors.New("Invalid operation")
)

//Funcion para realizar las operaciones matematicas con un switch
func Calculate (op string , num1 , num2 float64) (float64 , error){
	switch op{
	case "+":
		return num1 + num2, nil
	case "-":
		return num1 - num2, nil
	case "*":
		return num1 * num2, nil
	case "/" :
		if num2 == 0{
			return 0, ErrorDivByZero
		}
		return num1 / num2 , nil
	case "^" :
		return math.Pow(num1, num2) , nil
	default:
		return 0, ErrorInvalidOperator
	}
}