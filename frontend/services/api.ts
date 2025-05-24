
const API_BASE_URL = 'http://localhost:3000';

const get = async (endpoint: string, headers: Record<string, string> = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro na requisição GET');
  return data;
};

const post = async (
  endpoint: string,
  body: any,
  headers: Record<string, string> = {}
) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro na requisição POST');
  return data;
};

const put = async (endpoint: string, body: any) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro na requisição PUT');
  return data;
};

const del = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro na requisição DELETE');
  return data;
};

export default {
  get,
  post,
  put,
  delete: del,
};
