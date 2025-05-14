import { MaterialCommunityIcons } from '@expo/vector-icons';

export type Medicamento = {
    id: string;
    nome: string;
    detalhe: string;
    horario: string;
    icone: keyof typeof MaterialCommunityIcons.glyphMap;
    tipo: string;
    dosagem: string;
    dataInicio: string;
    diasTratamento: number;
    frequenciaUso: string;
    medicoResponsavel: string;
    alarme: string;
    lembrarReposicao: boolean;
    notificarContatos: boolean;
    diasAlarme: string;
  };
  
  let medicamentos: Medicamento[] = [
    {
      id: '1',
      nome: 'Nimesulida',
      detalhe: '1 comprimido',
      horario: '08:00',
      icone: 'pill',
      tipo: 'comprimido',
      dosagem: '100mg',
      dataInicio: '10/03/2025',
      diasTratamento: 7,
      frequenciaUso: '1x ao dia',
      medicoResponsavel: 'Dr. João',
      alarme: '08:00',
      lembrarReposicao: false,
      notificarContatos: false,
      diasAlarme: null,
    },
    {
      id: '2',
      nome: 'Luftal',
      detalhe: '20 gotas',
      horario: '08:00',
      icone: 'pill',
      tipo: 'gotas',
      dosagem: '20 gotas',
      dataInicio: '10/03/2025',
      diasTratamento: 5,
      frequenciaUso: '2x ao dia',
      medicoResponsavel: 'Dra. Ana',
      alarme: '08:00',
      lembrarReposicao: true,
      notificarContatos: true,
      diasAlarme: null,
    },
  ];
  
  
  export const medicineService = {
    listar: async (): Promise<Medicamento[]> => {
      // Simula tempo de carregamento
      await new Promise(resolve => setTimeout(resolve, 300));
      return medicamentos;
    },
  
    adicionar: async (medicamento: Medicamento): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      medicamentos.push(medicamento);
    },
  
    remover: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      medicamentos = medicamentos.filter(med => med.id !== id);
    },
  
    atualizar: async (medicamentoAtualizado: Medicamento): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      medicamentos = medicamentos.map(med =>
        med.id === medicamentoAtualizado.id ? medicamentoAtualizado : med
      );
    },
  };
  