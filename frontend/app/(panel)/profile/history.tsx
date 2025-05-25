import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Footer from '../../../components/Footer';
import { Medicamento } from '../../../modelos/Medicamento';
import { medicineService } from '../../../services/medicineService';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function History() {
     const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
     const [modalVisible, setModalVisible] = useState(false);
     const [medicamentoSelecionado, setMedicamentoSelecionado] = useState<Medicamento | null>(null);
     const router = useRouter();

     useEffect(() => {
          carregarMedicamentos();
     }, []);

     async function carregarMedicamentos() {
          try {
               const usuarioId = await AsyncStorage.getItem('idUsuario');
               const dadosMedicamentos = await medicineService.buscarPorUsuario(usuarioId);
               setMedicamentos(dadosMedicamentos);
          } catch (error: any) {
               console.warn('Nenhum medicamento encontrado ou erro:', error.message);
               setMedicamentos([]);
          }
     }

     async function excluirMedicamento() {
          if (medicamentoSelecionado) {
               await medicineService.remover(medicamentoSelecionado.id);
               setModalVisible(false);
               return carregarMedicamentos();

          }
     }

     return (
          <View style={styles.container}>
               <Text style={styles.titulo}>Histórico de Medicamentos</Text>

               {medicamentos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                         <Ionicons name="medical-outline" size={60} color="#a89eff" />
                         <Text style={styles.emptyText}>Nenhum medicamento registrado</Text>
                    </View>
               ) : (
                    <FlatList
                         data={medicamentos}
                         keyExtractor={(item) => item.id?.toString() ?? ''}
                         renderItem={({ item }) => (
                              <View style={styles.card}>
                                   <View style={styles.cardContent}>
                                        <View style={styles.cardInfo}>
                                             <Text style={styles.nome}>{item.nome}</Text>
                                             <Text style={styles.detalhe}>{item.frequencia}</Text>
                                             <View style={styles.horario}>
                                                  <Ionicons name="time-outline" size={16} color="#9b59b6" />
                                                  <Text style={styles.horaTexto}>
                                                       {Array.isArray(item.horario) ? item.horario.join(', ') : item.horario}
                                                  </Text>
                                             </View>
                                        </View>

                                        <View style={styles.cardActions}>
                                             <TouchableOpacity
                                                  style={styles.actionButton}
                                                  onPress={() => router.push(`/(panel)/profile/add?id=${item.id}`)}
                                             >
                                                  <Ionicons name="create-outline" size={20} color="#9b59b6" />
                                             </TouchableOpacity>

                                             <TouchableOpacity
                                                  style={styles.actionButton}
                                                  onPress={() => {
                                                       setMedicamentoSelecionado(item);
                                                       setModalVisible(true);
                                                  }}
                                             >
                                                  <Ionicons name="trash-outline" size={20} color="#e57373" />
                                             </TouchableOpacity>
                                        </View>
                                   </View>
                              </View>
                         )}
                    />
               )}

               {/* Modal de Confirmação */}
               <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                         <View style={styles.modalContent}>
                              <Text style={styles.modalTitle}>Confirmar exclusão</Text>
                              <Text style={styles.modalText}>
                                   Tem certeza que deseja excluir {medicamentoSelecionado?.nome}?
                              </Text>
                              <View style={styles.modalButtons}>
                                   <TouchableOpacity
                                        style={[styles.modalButton, styles.cancelButton]}
                                        onPress={() => setModalVisible(false)}
                                   >
                                        <Text style={styles.modalButtonText}>Cancelar</Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity
                                        style={[styles.modalButton, styles.confirmButton]}
                                        onPress={excluirMedicamento}
                                   >
                                        <Text style={styles.modalButtonText}>Excluir</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>
                    </View>
               </Modal>

               <Footer />
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#8793FF',
          paddingTop: 100,
          paddingHorizontal: 20,
     },
     titulo: {
          color: '#fff',
          fontSize: 22,
          fontWeight: '300',
          marginBottom: 25,
          textAlign: 'center',
     },
     emptyContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%', // Ocupa toda largura
          height: '100%', // Ocupa toda altura disponível
          paddingBottom: 100, // Compensa a altura do footer
     },
     emptyText: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 500,
          marginTop: 10,
     },
     card: {
          backgroundColor: '#fff',
          borderRadius: 50,
          padding: 13,
          marginBottom: 15,
          elevation: 2,
     },
     cardContent: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
     },
     cardInfo: {
          flex: 1,
          paddingLeft: 25,
     },
     nome: {
          fontSize: 14,
          fontWeight: '500',
          color: '#333',
     },
     detalhe: {
          fontSize: 12,
          color: '#666',
          marginTop: 4,
     },
     horario: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
     },
     horaTexto: {
          color: '#9b59b6',
          fontSize: 14,
          fontWeight: '500',
          marginLeft: 5,
     },
     cardActions: {
          flexDirection: 'row',
          gap: 10,
     },
     actionButton: {
          padding: 8,
     },
     modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
     },
     modalContent: {
          backgroundColor: '#fff',
          borderRadius: 30,
          padding: 20,
          width: '70%',
     },
     modalTitle: {
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 10,
          textAlign: 'center',
     },
     modalText: {
          fontSize: 16,
          marginBottom: 20,
          textAlign: 'center',
     },
     modalButtons: {
          flexDirection: 'row',
          justifyContent: 'space-between',
     },
     modalButton: {
          borderRadius: 30,
          paddingVertical: 12,
          paddingHorizontal: 25,
          minWidth: 120,
     },
     cancelButton: {
          backgroundColor: '#ccc',
     },
     confirmButton: {
          backgroundColor: '#e57373',
     },
     modalButtonText: {
          color: '#fff',
          fontWeight: '500',
          textAlign: 'center',
     },
});