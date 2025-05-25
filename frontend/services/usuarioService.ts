
import { Usuario } from "../modelos/Usuario";
import api from "./api";

export const usuarioService = {
  async listar(): Promise<Usuario[]> {
    return await api.get('/usuarios');
  },

  async buscar(id: number): Promise<Usuario> {
    return await api.get(`/usuarios/${id}`);
  },

  async criar(usuario: Usuario): Promise<Usuario> {
    return await api.post('/usuarios', usuario);
  },

  async atualizar(id: string, usuario: Usuario): Promise<Usuario> {
    return await api.put(`/usuarios/${id}`, usuario);
  },

  async remover(id: string): Promise<Usuario> {
    return await api.delete(`/usuarios/${id}`);
  },

  async atualizarParcial(id: string, usuario: Usuario): Promise<Usuario> {
    return await api.patch(`/usuarios/${id}`, usuario);
  },
};
