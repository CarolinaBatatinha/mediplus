import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRouter } from 'expo-router';
import {
     Pressable,
     ScrollView,
     StyleSheet,
     Text,
     TextInput,
     TouchableOpacity,
     View,
     Alert,
     ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { medicineService } from '@/services/medicineService';

export default function Add() {
     const router = useRouter();
     const [loading, setLoading] = useState(false);

     // Estados do formulário
     const [nome, setNome] = useState('');
     const [tipo, setTipo] = useState('');
     const [dosagem, setDosagem] = useState('');
     const [dataInicio, setDataInicio] = useState<Date | null>(null);
     const [dataInicioTexto, setDataInicioTexto] = useState('');
     const [alarmeHoras, setAlarmeHoras] = useState<Date[]>([]);
     const [alarmeHora, setAlarmeHora] = useState(new Date());
     const [isTimePickerVisible, setTimePickerVisible] = useState(false);
     const [isDatePickerVisible, setDatePickerVisible] = useState(false);

     // Estados de erro
     const [erros, setErros] = useState({
          nome: false,
          tipo: false,
          dosagem: false,
          dataInicio: false,
          alarmes: false
     });

     // Mostrar/Esconder modais
     const showTimePicker = () => setTimePickerVisible(true);
     const hideTimePicker = () => setTimePickerVisible(false);
     const showDatePicker = () => setDatePickerVisible(true);
     const hideDatePicker = () => setDatePickerVisible(false);

     // Confirmação de horário
     const handleTimeConfirm = (date: Date) => {
          setAlarmeHora(date);
          hideTimePicker();
     };

     // Confirmação de data
     const handleDateConfirm = (date: Date) => {
          setDataInicio(date);
          setDataInicioTexto(date.toLocaleDateString('pt-BR'));
          setErros(prev => ({ ...prev, dataInicio: false }));
          hideDatePicker();
     };

     // Adicionar alarme na lista
     const addAlarme = () => {
          if (alarmeHoras.length >= 8) {
               Alert.alert('Limite atingido', 'Você pode adicionar no máximo 8 alarmes.');
               return;
          }

          if (!alarmeHoras.some(h => h.getTime() === alarmeHora.getTime())) {
               setAlarmeHoras(prev => [...prev, alarmeHora]);
               setErros(prev => ({ ...prev, alarmes: false }));
          } else {
               Alert.alert('Alarme duplicado', 'Este horário já foi adicionado.');
          }
     };

     // Remover alarme da lista
     const removeAlarme = (alarme: Date) => {
          Alert.alert(
               'Remover alarme',
               'Deseja realmente remover este horário?',
               [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                         text: 'Remover', onPress: () => {
                              setAlarmeHoras(prev => prev.filter(h => h.getTime() !== alarme.getTime()));
                              if (alarmeHoras.length === 1) {
                                   setErros(prev => ({ ...prev, alarmes: true }));
                              }
                         }
                    }
               ]
          );
     };

     // Salvar medicamento via service
     async function salvarMedicamento() {
          const novosErros = {
               nome: !nome,
               tipo: !tipo,
               dosagem: !dosagem,
               dataInicio: !dataInicio,
               alarmes: alarmeHoras.length === 0
          };

          setErros(novosErros);

          if (Object.values(novosErros).some(e => e)) {
               Alert.alert('Campos obrigatórios', 'Preencha todos os campos marcados com *');
               return;
          }

          setLoading(true);

          try {
               await medicineService.adicionar({
                    id: String(Date.now()),
                    nome,
                    detalhe: `${tipo} - ${dosagem}`,
                    tipo,
                    dosagem,
                    data: dataInicio!.toISOString().split('T')[0],
                    horario: alarmeHoras[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    alarmes: alarmeHoras.map(h =>
                         h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ),
                    icone: '',
                    lembrarReposicao: false,
                    notificarContatos: false,
               });

               Alert.alert('Sucesso', 'Medicamento adicionado com sucesso!', [
                    { text: 'OK', onPress: () => router.push('/(panel)/profile/home') }
               ]);
          } catch (error) {
               Alert.alert('Erro', 'Ocorreu um erro ao salvar o medicamento');
               console.error(error);
          } finally {
               setLoading(false);
          }
     }

     return (
          <View style={{ flex: 1, backgroundColor: '#8793FF' }}>
               <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                         <TouchableOpacity
                              onPress={() => router.push('/(panel)/profile/home')}
                              style={styles.backButton}
                              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                         >
                              <Ionicons name="chevron-back-circle-outline" size={28} color="#fff" />
                         </TouchableOpacity>
                         <Text style={styles.headerText}>Novo Medicamento</Text>
                    </View>

                    {/* Nome do Medicamento */}
                    <View style={styles.inputContainer}>
                         <Text style={styles.label}>
                              Nome do Medicamento <Text style={styles.obrigatorio}>*</Text>
                              {erros.nome && <Text style={styles.erroTexto}> - Campo obrigatório</Text>}
                         </Text>
                         <View style={[styles.inputField, erros.nome && styles.inputErro]}>
                              <Ionicons name="medkit-outline" size={20} color="#9b59b6" />
                              <TextInput
                                   placeholder="ex.: Tylenol (500mg), Dorflex (300mg)..."
                                   style={styles.input}
                                   value={nome}
                                   onChangeText={text => {
                                        setNome(text);
                                        setErros(prev => ({ ...prev, nome: false }));
                                   }}
                                   accessibilityLabel="Campo para inserir o nome do medicamento"
                              />
                         </View>
                    </View>

                    {/* Tipo de Medicamento */}
                    <View style={styles.inputContainer}>
                         <Text style={styles.label}>
                              Tipo de Medicamento <Text style={styles.obrigatorio}>*</Text>
                              {erros.tipo && <Text style={styles.erroTexto}> - Selecione um tipo</Text>}
                         </Text>
                         <View style={styles.tipoRow}>
                              {['comprimido', 'líquido', 'gotas'].map(item => (
                                   <TouchableOpacity
                                        key={item}
                                        style={[
                                             styles.tipoBotao,
                                             tipo === item && styles.tipoBotaoSelecionado,
                                             erros.tipo && styles.inputErro
                                        ]}
                                        onPress={() => {
                                             setTipo(item);
                                             setErros(prev => ({ ...prev, tipo: false }));
                                        }}
                                        accessibilityLabel={`Botão para selecionar tipo ${item}`}
                                   >
                                        <Text
                                             style={[
                                                  styles.tipoTexto,
                                                  tipo === item && styles.tipoTextoSelecionado,
                                             ]}
                                        >
                                             {item}
                                        </Text>
                                   </TouchableOpacity>
                              ))}
                         </View>
                    </View>

                    {/* Dosagem */}
                    <View style={styles.inputContainer}>
                         <Text style={styles.label}>
                              Dosagem <Text style={styles.obrigatorio}>*</Text>
                              {erros.dosagem && <Text style={styles.erroTexto}> - Campo obrigatório</Text>}
                         </Text>
                         <View style={[styles.inputField, erros.dosagem && styles.inputErro]}>
                              <Ionicons name="options-outline" size={20} color="#9b59b6" />
                              <TextInput
                                   placeholder="ex.: 1 comprimido, 20 gotas, 5ml..."
                                   style={styles.input}
                                   value={dosagem}
                                   onChangeText={text => {
                                        setDosagem(text);
                                        setErros(prev => ({ ...prev, dosagem: false }));
                                   }}
                                   accessibilityLabel="Campo para inserir a dosagem do medicamento"
                              />
                         </View>
                    </View>

                    {/* Data de Início */}
                    <View style={styles.inputContainer}>
                         <Text style={styles.label}>
                              Data de Início <Text style={styles.obrigatorio}>*</Text>
                              {erros.dataInicio && <Text style={styles.erroTexto}> - Selecione uma data</Text>}
                         </Text>
                         <TouchableOpacity
                              style={[styles.inputField, erros.dataInicio && styles.inputErro]}
                              onPress={showDatePicker}
                              accessibilityLabel="Botão para selecionar data de início"
                         >
                              <Ionicons name="calendar-outline" size={20} color="#9b59b6" />
                              <Text style={styles.input}>
                                   {dataInicioTexto || 'Selecione uma data'}
                              </Text>
                         </TouchableOpacity>
                    </View>

                    <DateTimePickerModal
                         isVisible={isDatePickerVisible}
                         mode="date"
                         onConfirm={handleDateConfirm}
                         onCancel={hideDatePicker}
                         locale="pt-BR"
                         date={dataInicio || new Date()}
                    />

                    {/* Configuração de Alarmes */}
                    <View style={styles.section}>
                         <Text style={styles.sectionTitle}>Configuração de Alarmes</Text>

                         <View style={styles.alarmeControls}>
                              <TouchableOpacity
                                   onPress={showTimePicker}
                                   style={styles.timeButton}
                                   accessibilityLabel="Botão para definir novo alarme"
                              >
                                   <Ionicons name="time-outline" size={20} color="#9b59b6" />
                                   <Text style={styles.timeButtonText}>Selecionar Horário</Text>
                              </TouchableOpacity>

                              <DateTimePickerModal
                                   isVisible={isTimePickerVisible}
                                   mode="time"
                                   is24Hour
                                   onConfirm={handleTimeConfirm}
                                   onCancel={hideTimePicker}
                                   date={alarmeHora}
                              />

                              {alarmeHora && (
                                   <Text style={styles.previewHorario}>
                                        Horário selecionado: {alarmeHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </Text>
                              )}

                              <TouchableOpacity
                                   onPress={addAlarme}
                                   style={styles.addButton}
                                   disabled={!alarmeHora}
                                   accessibilityLabel="Botão para adicionar alarme"
                              >
                                   <Ionicons name="add-circle-outline" size={20} color="#fff" />
                                   <Text style={styles.addButtonText}>Adicionar Alarme</Text>
                              </TouchableOpacity>
                         </View>

                         <Text style={styles.label}>
                              Alarmes Definidos <Text style={styles.obrigatorio}>*</Text>
                              {erros.alarmes && <Text style={styles.erroTexto}> - Adicione pelo menos um alarme</Text>}
                         </Text>

                         {alarmeHoras.length > 0 ? (
                              alarmeHoras.map((alarme, index) => (
                                   <View key={index} style={styles.alarmeRow}>
                                        <View style={styles.alarmeTimeContainer}>
                                             <Ionicons name="alarm-outline" size={20} color="#9b59b6" />
                                             <Text style={styles.alarmeText}>
                                                  {alarme.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                             </Text>
                                        </View>
                                        <TouchableOpacity
                                             onPress={() => removeAlarme(alarme)}
                                             style={styles.removeButton}
                                             accessibilityLabel={`Botão para remover alarme às ${alarme.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                        >
                                             <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                                        </TouchableOpacity>
                                   </View>
                              ))
                         ) : (
                              <View style={styles.noAlarms}>
                                   <Ionicons name="alarm-outline" size={24} color="#888" />
                                   <Text style={styles.noAlarmsText}>Nenhum alarme definido</Text>
                              </View>
                         )}
                    </View>

                    {/* Botão de Salvar */}
                    <TouchableOpacity
                         style={styles.saveButton}
                         onPress={salvarMedicamento}
                         disabled={loading}
                         accessibilityLabel="Botão para salvar novo medicamento"
                    >
                         {loading ? (
                              <ActivityIndicator color="#fff" />
                         ) : (
                              <>
                                   <Ionicons name="save-outline" size={20} color="#fff" />
                                   <Text style={styles.saveButtonText}>Salvar Medicamento</Text>
                              </>
                         )}
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
          paddingBottom: 40,
     },
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 30,
          marginLeft: 0,
          gap: 15
     },
     backButton: {
          padding: 5,
     },
     headerText: {
          color: '#fff',
          fontSize: 22,
          fontWeight: '300',
          flex: 1,
          textAlign: 'center',
          marginRight: 28,
     },
     inputContainer: {
          marginBottom: 20,
          width: '100%',
     },
     inputField: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 30,
          paddingHorizontal: 20,
          paddingVertical: 15,
          width: '100%',
     },
     input: {
          marginLeft: 10,
          flex: 1,
          color: '#333',
          fontSize: 12,
          paddingVertical: 0, 
     },
     inputErro: {
          borderColor: '#e74c3c',
          borderWidth: 1,
     },
     label: {
          fontWeight: '300',
          color: '#fff',
          marginBottom: 8,
          fontSize: 14,
          marginLeft: 10,
     },
     obrigatorio: {
          color: '#e74c3c',
     },
     erroTexto: {
          color: '#e74c3c',
          fontSize: 12,
          fontWeight: 'normal',
     },
     tipoRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 8,
          width: '100%',
     },
     tipoBotao: {
          backgroundColor: '#fff',
          paddingVertical: 15,
          borderRadius: 30,
          flex: 1,
          alignItems: 'center',
          minWidth: 0, // Permite que os botões se ajustem igualmente
     },
     tipoBotaoSelecionado: {
          backgroundColor: '#6246EA',
     },
     tipoTexto: {
          color: '#9b59b6',
          fontWeight: '600',
          textTransform: 'capitalize',
          fontSize: 14,
     },
     tipoTextoSelecionado: {
          color: '#fff',
     },
     section: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          padding: 16,
          marginVertical: 12,
          width: '100%',
     },
     sectionTitle: {
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 16,
          textAlign: 'center',
     },
     alarmeControls: {
          marginBottom: 15,
          width: '100%',
     },
     timeButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          borderRadius: 30,
          padding: 15,
          width: '100%',
     },
     timeButtonText: {
          color: '#9b59b6',
          fontWeight: '600',
          marginLeft: 8,
          fontSize: 14,
     },
     previewHorario: {
          color: '#fff',
          textAlign: 'center',
          marginVertical: 8,
          fontStyle: 'italic',
          fontSize: 14,
     },
     addButton: {
          backgroundColor: '#6246EA',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
          padding: 15,
          marginTop: 10,
          width: '100%',
     },
     addButtonText: {
          color: '#fff',
          fontWeight: 'bold',
          marginLeft: 8,
          fontSize: 14,
     },
     alarmeRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#FFF',
          padding: 15,
          borderRadius: 30,
          marginVertical: 6,
          alignItems: 'center',
          width: '100%',
     },
     alarmeTimeContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
     },
     alarmeText: {
          fontSize: 14,
          color: '#333',
          fontWeight: '500',
     },
     removeButton: {
          padding: 6,
     },
     noAlarms: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15,
          borderRadius: 30,
          backgroundColor: 'rgba(255,255,255,0.2)',
          gap: 8,
          width: '100%',
     },
     noAlarmsText: {
          color: '#fff',
          fontSize: 14,
     },
     saveButton: {
          marginTop: 24,
          backgroundColor: '#414141',
          borderRadius: 30,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          width: '100%',
     },
     saveButtonText: {
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 16,
     },
});