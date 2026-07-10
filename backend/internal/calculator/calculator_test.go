package calculator

import (
	"errors"
	"testing"
)

func TestCalculate(t *testing.T) {
	tests := []struct {
		name     string
		operator string
		num1     float64
		num2     float64
		want     float64
		wantErr  error
	}{
		{"Suma básica", "+", 5, 3, 8, nil},
		{"Resta con decimales", "-", 10.5, 2.5, 8, nil},
		{"Multiplicación por cero", "*", 7, 0, 0, nil},
		{"División exacta", "/", 10, 2, 5, nil},
		{"División por cero (Error)", "/", 5, 0, 0, ErrorDivByZero},
		{"Exponenciación", "^", 2, 3, 8, nil},
		{"Operador inválido", "%", 5, 2, 0, ErrorInvalidOperator},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Calculate(tt.operator, tt.num1, tt.num2)

			// Verificar si se esperaba un error
			if tt.wantErr != nil {
				if !errors.Is(err, tt.wantErr) {
					t.Errorf("Calculate() error = %v, wantErr %v", err, tt.wantErr)
				}
				return
			}

			// Verificar que no haya errores inesperados
			if err != nil {
				t.Fatalf("Calculate() inesperado error = %v", err)
			}

			// Verificar el resultado
			if got != tt.want {
				t.Errorf("Calculate() = %v, queremos %v", got, tt.want)
			}
		})
	}
}