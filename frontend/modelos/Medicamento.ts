import { MaterialCommunityIcons } from "@expo/vector-icons";

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