
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

  async criar(medicamento: Medicamento): Promise<any> {
    return await api.post('/medicamentos', medicamento);
  },

  async atualizar(id: number, medicamento: Medicamento): Promise<Medicamento> {
    return await api.put(`/medicamentos/${id}`, medicamento);
  },

  async remover(id: number): Promise<Medicamento> {
    return await api.delete(`/medicamentos/${id}`);
  },

  async buscarPorUsuario(usuarioId: string): Promise<Medicamento[]> {
    const response = await api.get(`/medicamentos/usuario/${usuarioId}`);
    return response.data;
  },

  async atualizarStatus(id: number, status: string): Promise<Medicamento> {
    const response = await api.patch(`/medicamentos/${id}/status`, { status });
    return response.data.data;
  }

};
