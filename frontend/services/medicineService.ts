
import { Medicamento } from "../modelos/Medicamento";
import api from "./api";

export const medicineService = {
  async listar(): Promise<Medicamento[]> {
    return await api.get('/medicamentos');
  },

  async buscar(id: string): Promise<Medicamento> {
    return await api.get(`/medicamentos/${id}`);
  },

  async criar(medicamento: Medicamento): Promise<Medicamento> {
    return await api.post('/medicamentos', medicamento);
  },

  async atualizar(id: string, medicamento: Medicamento): Promise<Medicamento> {
    return await api.put(`/medicamentos/${id}`, medicamento);
  },

  async remover(id: string): Promise<Medicamento> {
    return await api.delete(`/medicamentos/${id}`);
  },
};
