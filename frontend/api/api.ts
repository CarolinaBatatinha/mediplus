const API_URL = "http://postgresql://mediplus_user:rAu9a7onxIP7RBqHDi2STEe4XGlLNe2z@dpg-d0j2f7l6ubrc73brfsng-a.oregon-postgres.render.com/mediplus.168.0.10:3000"; 
export async function listarUsuarios() {
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error("Erro ao listar usuários");
  return res.json();
}

export async function buscarUsuario(id: string) {
  const res = await fetch(`${API_URL}/usuarios/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar usuário");
  return res.json();
}

export async function criarUsuario(usuario: {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  dataNascimento?: string;
  
}) {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!res.ok) throw new Error("Erro ao criar usuário");
  return res.json();
}

export async function atualizarUsuario(id: string, usuario: {
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
  dataNascimento?: string;
}) {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!res.ok) throw new Error("Erro ao atualizar usuário");
  return res.json();
}

export async function deletarUsuario(id: string) {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar usuário");
  return res.json();
}
