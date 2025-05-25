import { MaterialCommunityIcons } from "@expo/vector-icons";

export type Medicamento = {
  id: number;
  usuario_id: number;
  nome: string;
  tipo_medicamento: string;
  dosagem: string;
  frequencia: string;
  data_inicial: string;
  medico_responsavel: string;
};