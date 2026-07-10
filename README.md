# Full-Stack Calculator App 🧮

Este proyecto fue creado con la finalidad de mostrar mis habilidades como desarrollador Full-Stack, implementando una API REST robusta en el backend para realizar los cálculos necesarios y un frontend moderno y responsivo, comunicándose mediante el formato JSON.

---

## 🚀 Instalación y Requisitos

Para clonar, compilar y ejecutar este proyecto localmente, necesitas tener instalados los siguientes paquetes:

* **[Git](https://git-scm.com/)** (Para clonar el repositorio)
* **[Docker](https://www.docker.com/)** y **[Docker Compose](https://docs.docker.com/compose/)** (Recomendado para ejecución en contenedores)
* **[Go (Golang)](https://go.dev/) v1.26+** (Si deseas ejecutar el backend de forma nativa)
* **[Node.js](https://nodejs.org/) v20+ & NPM** (Si deseas ejecutar el frontend de forma nativa)

---

## 🛠️ Tecnologías Utilizadas

### Backend Core
* <h1>Go (Golang):</h1> Elegido por su alto rendimiento, tipado fuerte y simplicidad idiomática.
* <h1>Testing (Nativo):</h1> Implementación de *Table-Driven Tests* para asegurar una cobertura del 100% en la lógica de cálculo.

### Frontend UI
* <h1>React 19 & TypeScript:</h1> Estructura de componentes basada en interfaces fuertemente tipadas.
* <h1>Vite:</h1> Herramienta de andamiaje de última generación para un desarrollo ultra veloz.
* <h1>Tailwind CSS v4:</h1> Framework de utilidades CSS para un diseño *Mobile-First* y minimalista.
* <h1>Axios:</h1> Cliente HTTP para la comunicación limpia y manejo de errores con la API.

---

## 📦 Cómo Ejecutar el Proyecto

### Opción 1: Usando Docker (Recomendado)
Gracias a la contenedorización, puedes levantar toda la infraestructura (Frontend + Backend) con un solo comando desde la raíz del proyecto:
docker compose up --build

### Opción 2: Ejecutando el proyecto en directamente
* <h1>Backend:</h1>
    cd backend
    go test -v ./...      # Ejecuta las pruebas unitarias
    go run main.go       # Inicia el servidor en el puerto 8080
    
* <h1>Frontend:</h1>
    cd frontend
    npm install          # Instala las dependencias
    npm run dev          # Inicia el entorno de desarrollo
  
