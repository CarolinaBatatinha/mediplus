export type Usuario = {
    email: string;
    senha: string;
  };
  
  const usuariosFake: Usuario[] = [
    { email: 'teste@teste.com', senha: '123456' },
  ];
  
  export const authService = {
    async login(email: string, senha: string): Promise<boolean> {
      await new Promise(resolve => setTimeout(resolve, 500));
      const usuario = usuariosFake.find(u => u.email === email && u.senha === senha);
      return !!usuario; 
    },
  };