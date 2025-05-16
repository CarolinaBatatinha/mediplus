import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { medicineService } from '../services/medicineService';

export default function AddMedicineScreen() {
  const [lembrarReposicao, setLembrarReposicao] = useState<boolean>(false);
  const [notificarContatos, setNotificarContatos] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [dosagem, setDosagem] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [diasTratamento, setDiasTratamento] = useState<number>(1);
  const [frequenciaUso, setFrequenciaUso] = useState<string>('');
  const [medicoResponsavel, setMedicoResponsavel] = useState<string>('');
  const [alarmeHoras, setAlarmeHoras] = useState<Date[]>([]);  // Array de objetos Date
  const [showPicker, setShowPicker] = useState<boolean>(false); // Controla a visibilidade do DateTimePicker
  const [alarmeHora, setAlarmeHora] = useState<Date>(new Date()); // Hora selecionada atualmente
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // Dias selecionados para o alarme

  const router = useRouter();

  // Corrigindo a tipagem de selectedDate
  const handleAlarmeChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || alarmeHora;
    setAlarmeHora(currentDate);
    setShowPicker(false); // Fecha o picker após seleção do horário
  };

  const addAlarme = () => {
    if (!alarmeHoras.some(hour => hour.getTime() === alarmeHora.getTime())) {
      setAlarmeHoras(prev => [...prev, alarmeHora]);
    }
  };

  const removeAlarme = (alarme: Date) => {
    setAlarmeHoras(prev => prev.filter(hour => hour.getTime() !== alarme.getTime()));
  };

  // Função para alternar a seleção dos dias
  const toggleDaySelection = (day: string) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  async function salvarMedicamento() {
    if (!nome || !tipo || !dosagem) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    await medicineService.adicionar({
      id: String(Date.now()),
      nome,
      detalhe: `${tipo} - ${dosagem}`,
      horario: dataInicio,
      icone: 'pill',
      tipo,
      dosagem,
      dataInicio,
      diasTratamento,
      frequenciaUso,
      medicoResponsavel,
      alarme: alarmeHoras.map(hour => hour.toLocaleTimeString()).join(', '), // Formatar múltiplos horários
      lembrarReposicao,
      notificarContatos,
      diasAlarme: selectedDays.join(', '), // Armazenando os dias selecionados
    });

    router.push('./MyMedicineScreen');
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#8793FF' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Novo medicamento</Text>

        <Text style={styles.label}>Nome do Medicamento</Text>
        <View style={styles.inputComIcone}>
          <Ionicons name="medkit-outline" size={20} color="#9b59b6" />
          <TextInput placeholder="ex.: Tylenol, Dorflex, Nimesulida..." style={styles.input} value={nome} onChangeText={setNome} />
        </View>

        <Text style={styles.label}>Tipo de Medicamento</Text>
        <View style={styles.tipoRow}>
          {['comprimido', 'líquido', 'gotas', 'injetável'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.tipoBotao, tipo === item && styles.tipoBotaoSelecionado]}
              onPress={() => setTipo(item)}
            >
              <Text style={[styles.tipoTexto, tipo === item && styles.tipoTextoSelecionado]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Dosagem</Text>
        <View style={styles.inputComIcone}>
          <Ionicons name="options-outline" size={20} color="#9b59b6" />
          <TextInput placeholder="ex.: 1 comprimido, 20 gotas..." style={styles.input} value={dosagem} onChangeText={setDosagem} />
        </View>

        <Text style={styles.label}>Inicio do Tratamento</Text>
        <View style={styles.inputComIcone}>
          <Ionicons name="calendar-outline" size={20} color="#9b59b6" />
          <TextInput placeholder="Data de Início (ex.: 10/03/2025)" style={styles.input} value={dataInicio} onChangeText={setDataInicio} />
        </View>

        <Text style={styles.label}>Médico Responsável</Text>
        <View style={styles.inputComIcone}>
          <Ionicons name="person-outline" size={20} color="#9b59b6" />
          <TextInput placeholder="Médico Responsável" style={styles.input} value={medicoResponsavel} onChangeText={setMedicoResponsavel} />
        </View>

        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.addAlarmeButton}>
          <Ionicons name="alarm-outline" size={30} color="#fff" />
          <Text style={styles.addAlarmeText}>Definir Alarme</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={alarmeHora}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleAlarmeChange}
          />
        )}

        <TouchableOpacity onPress={addAlarme} style={styles.addAlarmeButton}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Adicionar Alarme</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Alarmes Definidos:</Text>
        {alarmeHoras.length > 0 ? (
          alarmeHoras.map((alarme, index) => (
            <View key={index} style={styles.alarmeRow}>
              <Text style={styles.alarmeText}>{alarme.toLocaleTimeString()}</Text>
              <TouchableOpacity onPress={() => removeAlarme(alarme)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={20} color="#e57373" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.alarmeText}>Nenhum alarme definido.</Text>
        )}

        <Text style={styles.label}>Selecione os dias da semana para o alarme:</Text>
        <View style={styles.daysRow}>
          {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayButton, selectedDays.includes(day) && styles.dayButtonSelected]}
              onPress={() => toggleDaySelection(day)}
            >
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.selectedDaysText}>
          Dias selecionados: {selectedDays.join(', ')}
        </Text>

        <TouchableOpacity style={styles.novoMedicamentoButton} onPress={salvarMedicamento}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Novo Medicamento</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#8793FF', 
    padding: 20, 
    paddingTop: 60, 
    paddingBottom: 100 
  },
  titulo: { 
    color: '#fff', 
    fontSize: 24, 
    marginBottom: 30, 
    alignSelf: 'center' 
  },
  inputComIcone: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 30, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    marginBottom: 12 
  },
  input: { 
    flex: 1, 
    marginLeft: 10,
    fontSize: 12,
  },
  label: { 
    color: '#fff', 
    fontWeight: 'bold', 
    marginBottom: 8, 
    marginTop: 10 
  },
  tipoRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 5, 
    justifyContent: 'space-between',
    marginBottom: 15 
  },
  tipoBotao: { 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 15, 
    borderRadius: 30, 
    marginBottom: 5, 
    width: '46%', 
    marginHorizontal: '1%', 
    justifyContent: 'center',
  },
  tipoBotaoSelecionado: {
    backgroundColor: '#9b59b6', 
  },
  tipoTexto: { 
    color: '#333', 
    fontSize: 14, 
    marginLeft: 5 
  },
  tipoTextoSelecionado: {
    color: '#fff',
  },
  addAlarmeButton: { 
    backgroundColor: '#9b59b6', 
    width: 360,  
    height: 50, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    alignSelf: 'center', 
    marginVertical: 10, 
    flexDirection: 'row', 
    paddingHorizontal: 10
  },
  addAlarmeText: {
    color: '#fff', 
    fontSize: 16, 
    marginLeft: 10
  },
  alarmeText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
  },
  alarmeRow: {  
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  dayButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    margin: 5,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#9b59b6',
  },
  dayText: {
    color: '#333',
    fontWeight: 'bold',
  },
  selectedDaysText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
  },
  novoMedicamentoButton: { 
    backgroundColor: '#2e2e3e', 
    padding: 15, 
    borderRadius: 30, 
    alignItems: 'center', 
    marginTop: 40 
  },
  removeButton: {  
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
