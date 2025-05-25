import { MaterialCommunityIcons } from "@expo/vector-icons";

export type Medicamento = {
  id?: number;
  usuario_id: string;
  nome: string;
  tipo_medicamento: string;
  dosagem: string;
  frequencia: string;
  data_inicial?: string;
  medico_responsavel?: string;
  horario?: string;
  status?: string;
  criado_em?: string
};