
import { Medicamento } from "../modelos/Medicamento";
import api from "./api";

export const medicineService = {
  async listar(page = 1, limit = 10): Promise<Medicamento[]> {
    const response = await api.get(`/medicamentos?page=${page}&limit=${limit}`);
    console.log("AAAAAAAA", response.data)
    return response.data;
  },

  async buscar(id: string): Promise<Medicamento> {
    return await api.get(`/medicamentos/${id}`);
  },

  async criar(medicamento: {
    nome: string;
    tipo_medicamento: string;
    dosagem: string;
    data_inicial: string;
    frequencia: string;
  }): Promise<any> {
    return await api.post('/medicamentos', medicamento);
  },

  async atualizar(id: string, medicamento: Medicamento): Promise<Medicamento> {
    return await api.put(`/medicamentos/${id}`, medicamento);
  },

  async remover(id: string): Promise<Medicamento> {
    return await api.delete(`/medicamentos/${id}`);
  },
};
