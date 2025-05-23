import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@medicamentos';

export type Medicamento = {
     data: string | number | Date;
     horario: string;
     id: string;
     nome: string;
     detalhe: string;
     tipo: string;
     dosagem: string;
     alarmes: string[];
     icone: string;
     lembrarReposicao: boolean;
     notificarContatos: boolean;
     status?: 'pendente' | 'tomado' | 'esquecido';
};

export const medicineService = {
     listar: async (): Promise<Medicamento[]> => {
          const json = await AsyncStorage.getItem(STORAGE_KEY);
          return json ? JSON.parse(json) : [];
     },

     adicionar: async (medicamento: Medicamento): Promise<void> => {
          const atuais = await medicineService.listar();
          atuais.push(medicamento);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atuais));
     },

     remover: async (id: string): Promise<void> => {
          const atuais = await medicineService.listar();
          const filtrados = atuais.filter(med => med.id !== id);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
     },

     atualizar: async (medicamentoAtualizado: Medicamento): Promise<void> => {
          const atuais = await medicineService.listar();
          const atualizados = atuais.map(med =>
               med.id === medicamentoAtualizado.id ? medicamentoAtualizado : med
          );
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
     },
};