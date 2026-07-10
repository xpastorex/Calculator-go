import axios from "axios";

export interface CalculatorRequest {
    operator : string;
    num1 : number;
    num2 : number;
}

export interface CalculatorResponse{
    result : number;
    error : string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/calculate';

export const calculateService = {
  async calculate(data: CalculatorRequest): Promise<CalculatorResponse> {
    try {
      const response = await axios.post<CalculatorResponse>(API_URL, data);
      
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return {
          result: 0,
          error: error.response.data.error || 'Error en la operación',
        };
      }
      return {
        result: 0,
        error: error.message || 'Error de conexión con el backend',
      };
    }
  }
};