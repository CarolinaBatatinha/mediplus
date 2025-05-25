import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Footer from '../../../components/Footer';
import { Ionicons } from '@expo/vector-icons';
import { Medicamento } from '../../../modelos/Medicamento';
import { medicineService } from '../../../services/medicineService';

export default function Home() {
     const router = useRouter();
     const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
     const [userName, setUserName] = useState('');
     const [currentDate, setCurrentDate] = useState('');
     const [currentMonth, setCurrentMonth] = useState('');
     const [selectedDate, setSelectedDate] = useState(new Date());
     const flatListRef = useRef<FlatList>(null);

     const generateDaysAround = () => {
          const days = [];
          for (let i = -15; i <= 15; i++) {
               const date = new Date();
               date.setDate(date.getDate() + i);
               days.push(new Date(date));
          }
          return days;
     };

     const days = generateDaysAround();

     useFocusEffect(
          useCallback(() => {
               const today = new Date();
               setSelectedDate(today);
               updateHeader(today);

               const fetchUserName = async () => {
                    const name = await AsyncStorage.getItem('userName');
                    setUserName(name || 'Usuário');
               };

               fetchUserName();
               fetchMedicamentos();

               setTimeout(() => {
                    flatListRef.current?.scrollToIndex({
                         index: 15,
                         animated: true,
                    });
               }, 300);
          }, [])
     );

     const fetchMedicamentos = async () => {
         try {
               const usuarioId = await AsyncStorage.getItem('idUsuario');
               const dadosMedicamentos = await medicineService.buscarPorUsuario(usuarioId);
               setMedicamentos(dadosMedicamentos);
          } catch (error: any) {
               console.warn('Nenhum medicamento encontrado ou erro:', error.message);
               setMedicamentos([]);
          }
     };

     const updateHeader = (date: Date) => {
          const fullDate = date.toLocaleDateString('pt-BR', {
               day: '2-digit',
               month: 'long',
               year: 'numeric',
          });

          const monthName = date.toLocaleDateString('pt-BR', {
               month: 'long',
          });

          setCurrentDate(fullDate);
          setCurrentMonth(monthName.toUpperCase());
     };

     const handleDateSelect = (date: Date) => {
          setSelectedDate(date);
          updateHeader(date);
     };

     const atualizarStatusMedicamento = async (medicamento: Medicamento, status: 'tomado' | 'esquecido') => {
          const medicamentoAtualizado = { ...medicamento, status };

          try {
               await medicineService.atualizarStatus(medicamentoAtualizado.id, status);
               setMedicamentos(prev => prev.map(m =>
                    m.id === medicamento.id ? medicamentoAtualizado : m
               ));
          } catch (error) {
               console.error('Erro ao atualizar status:', error);
          }
     };

     const medicamentosDoDia = medicamentos.filter((med) => {
          if (!med.data_inicial) return false;

          const medDate = new Date(med.data_inicial);
          return (
               medDate.getDate() === selectedDate.getDate() &&
               medDate.getMonth() === selectedDate.getMonth() &&
               medDate.getFullYear() === selectedDate.getFullYear()
          );
     });

     const medicamentosAgrupados = medicamentosDoDia.reduce((acc, med) => {
          if (!acc[med.horario]) acc[med.horario] = [];
          acc[med.horario].push(med);
          return acc;
     }, {} as Record<string, Medicamento[]>);

     const medicamentosAgrupadosOrdenados = Object.entries(medicamentosAgrupados)
          .sort(([horarioA], [horarioB]) => {
               const [hA, mA] = horarioA.split(':').map(Number);
               const [hB, mB] = horarioB.split(':').map(Number);
               return hA - hB || mA - mB;
          });

     return (
          <View style={styles.container}>
               <View>
                    <Text style={styles.title}>Minha Agenda</Text>
               </View>
               <View style={styles.calendarBlurContainer}>
                    <Text style={styles.date}>{currentDate}</Text>
                    <View style={styles.monthRow}>
                         <Text style={styles.month}>{currentMonth}</Text>
                    </View>

                    <FlatList
                         ref={flatListRef}
                         horizontal
                         showsHorizontalScrollIndicator={false}
                         data={days}
                         keyExtractor={(_, index) => index.toString()}
                         getItemLayout={(_, index) => ({
                              length: 52,
                              offset: 52 * index,
                              index,
                         })}
                         initialScrollIndex={15}
                         renderItem={({ item }) => {
                              const isSelected =
                                   item.getDate() === selectedDate.getDate() &&
                                   item.getMonth() === selectedDate.getMonth() &&
                                   item.getFullYear() === selectedDate.getFullYear();

                              return (
                                   <TouchableOpacity
                                        onPress={() => handleDateSelect(item)}
                                        style={[styles.dayCircle, isSelected && styles.activeDay]}
                                   >
                                        <Text style={styles.dayOfWeek}>
                                             {item
                                                  .toLocaleDateString('pt-BR', {
                                                       weekday: 'short',
                                                  })
                                                  .toUpperCase()}
                                        </Text>
                                        <Text style={[styles.dayText, isSelected && styles.activeDayText]}>
                                             {item.getDate()}
                                        </Text>
                                   </TouchableOpacity>
                              );
                         }}
                    />
               </View>

               <ScrollView style={styles.medicineList}>
                    {medicamentosDoDia.length === 0 ? (
                         <View style={styles.emptyContainer}>
                              <Text style={styles.emptyText}>Você não tem nenhum medicamento neste dia!</Text>
                              <Text style={styles.emptySubText}>
                                   Toque no "+" abaixo para adicionar um novo medicamento.
                              </Text>
                         </View>
                    ) : (
                         medicamentosAgrupadosOrdenados.map(([horario, meds]) => (
                              <View style={styles.timeGroup} key={horario}>
                                   <View style={[styles.timeLabelContainer, { height: meds.length * 100 }]}>
                                        <View style={styles.timeLabelWrapper}>
                                             <Text style={styles.timeLabel}>{horario}</Text>
                                        </View>
                                   </View>

                                   <View style={styles.cardsContainer}>
                                        {meds.map((med) => (
                                             <View key={med.id} style={[
                                                  styles.medCard,
                                                  med.status === 'tomado' && styles.medCardTomado,
                                                  med.status === 'esquecido' && styles.medCardEsquecido
                                             ]}>
                                                  <View style={styles.medInfo}>
                                                       <Text style={styles.medName}>{med.nome}</Text>
                                                       {med.dosagem && <Text style={styles.medDetails}>{med.dosagem}</Text>}
                                                  </View>

                                                  <View style={styles.medActions}>
                                                       <TouchableOpacity
                                                            style={[
                                                                 styles.actionIcon,
                                                                 med.status === 'tomado' && styles.actionIconActive
                                                            ]}
                                                            onPress={() => atualizarStatusMedicamento(med, 'tomado')}
                                                       >
                                                            <Ionicons
                                                                 name="checkmark-outline"
                                                                 size={20}
                                                                 color={med.status === 'tomado' ? '#4CAF50' : '#ccc'}
                                                            />
                                                       </TouchableOpacity>

                                                       <TouchableOpacity
                                                            style={[
                                                                 styles.actionIcon,
                                                                 med.status === 'esquecido' && styles.actionIconActive
                                                            ]}
                                                            onPress={() => atualizarStatusMedicamento(med, 'esquecido')}
                                                       >
                                                            <Ionicons
                                                                 name="close-outline"
                                                                 size={20}
                                                                 color={med.status === 'esquecido' ? '#F44336' : '#ccc'}
                                                            />
                                                       </TouchableOpacity>
                                                  </View>
                                             </View>
                                        ))}
                                   </View>
                              </View>
                         ))
                    )}
               </ScrollView>

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
     title: {
          fontSize: 24,
          fontWeight: 300,
          paddingBottom: 14,
          color: '#fff',
          textAlign: 'center',
     },
     calendarBlurContainer: {
          marginBottom: 20,
          height: 158,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          padding: 12,
     },
     date: {
          color: '#fff',
          fontSize: 14,
     },
     monthRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 6,
          marginBottom: 10,
     },
     month: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
     },
     dayCircle: {
          width: 48,
          height: 64,
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#2e2e3e',
          marginHorizontal: 2,
     },
     activeDay: {
          backgroundColor: '#7121D9',
     },
     dayText: {
          color: '#ccc',
          fontSize: 16,
     },
     activeDayText: {
          color: '#1c1c2e',
          fontWeight: 'bold',
     },
     dayOfWeek: {
          color: '#bbb',
          fontSize: 10,
          marginBottom: 4,
     },
     medicineList: {
          flex: 1,
          marginBottom: 70,
     },
     emptyContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 40,
     },
     emptyText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
          marginTop: 10,
          marginBottom: 4,
     },
     emptySubText: {
          color: '#ccc',
          fontSize: 14,
          textAlign: 'center',
          maxWidth: 280,
     },
     timeGroup: {
          flexDirection: 'row',
          marginTop: 8,
     },
     timeLabelContainer: {
          width: 90,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 10,
          borderRightWidth: 1,
          borderRightColor: 'rgba(255,255,255,0.3)',
     },
     timeLabelWrapper: {
          minHeight: 60,
          justifyContent: 'center',
     },
     timeLabel: {
          fontSize: 16,
          color: '#eee',
          fontWeight: 'normal',
          textAlign: 'right',
     },
     cardsContainer: {
          flex: 1,
          gap: 12,
          paddingVertical: 8,
          paddingLeft: 10,
     },
     medCard: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderRadius: 50,
          backgroundColor: '#fff',
          elevation: 1,
     },
     medCardTomado: {
          backgroundColor: '#E8F5E9',
     },
     medCardEsquecido: {
          backgroundColor: '#fff5f5',
     },
     medInfo: {
          flex: 1,
     },
     medName: {
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
          marginBottom: 4,
          marginLeft: 10,
     },
     medDetails: {
          fontSize: 12,
          color: '#666',
          marginLeft: 10,
     },
     medActions: {
          flexDirection: 'row',
          marginLeft: 12,
     },
     actionIcon: {
          padding: 8,
          marginLeft: 4,
          borderRadius: 20,
     },
     actionIconActive: {
          backgroundColor: 'rgba(0,0,0,0.05)',
     },
});