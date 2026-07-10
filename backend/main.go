package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"calculator-backend/internal/calculator"
)

// Tipado de Request y Response
type Request struct {
	Operator string  `json:"operator"`
	Num1     float64 `json:"num1"`
	Num2     float64 `json:"num2"`
}
type Response struct {
	Result float64 `json:"result"`
	Error  string  `json:"error,omitempty"`
}

func calculateHandler(w http.ResponseWriter, r *http.Request) {


	//Configuracion Cors (Para que el front y el back se puedan comunicar sin problemas)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Manejar el pre-vuelo de CORS (petición OPTIONS)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	// 2. Decodificar el JSON
	var req Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Error: "Formato JSON inválido"})
		return
	}

	// 3. Ejecutar la lógica usando nuestro paquete internal/calculator
	result, err := calculator.Calculate(req.Operator, req.Num1, req.Num2)
	
	// 4. Enviar respuesta
	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		// Si hay un error (ej. división por cero), enviamos 400 y el mensaje
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Error: err.Error()})
		return
	}

	json.NewEncoder(w).Encode(Response{Result: result})
}

func main() {
	http.HandleFunc("/api/calculate", calculateHandler)

	fmt.Println("Servidor de la calculadora corriendo en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}