import api from './api';

interface LoginPayload {
  email: string;
  senha_hash: string;
}

interface LoginResposta {
  message: string;
  user: {
    id: number;
    nome: string;
    email: string;
  };
}

export const loginService = {
  async login(dados: LoginPayload): Promise<LoginResposta> {
    const response = await api.post('/login', dados);
    return response;
  }
};