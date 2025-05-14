import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { medicineService } from '../services/medicineService';
import { Medicamento } from '../services/medicineService';  // 👈 Importar o tipo Medicamento
import Footer from '@/components/Footer';

export default function HomeScreen() {
  const router = useRouter();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]); 
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name || 'Usuário');
    };

    const today = new Date();
    updateHeader(today); // Atualiza data e mês ao iniciar
    fetchUserName();
    fetchMedicamentos();  // Chama a função para buscar os medicamentos
  }, []);

  const fetchMedicamentos = async () => {
    const dadosMedicamentos = await medicineService.listar();
    setMedicamentos(dadosMedicamentos);
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

  const generateDaysAround = () => {
    const days = [];
    for (let i = -15; i <= 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = generateDaysAround();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    updateHeader(date); // Atualiza data e mês quando uma data for selecionada
    setCalendarVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/images/user-icon.png')} style={styles.avatar} />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Calendário semanal scrollável */}
      <View style={styles.calendarBlurContainer}>
        <Text style={styles.date}>{currentDate}</Text>
        <View style={styles.monthRow}>
          <Text style={styles.month}>
            {currentMonth}
          </Text>
          <TouchableOpacity onPress={() => setCalendarVisible(true)}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={days}
          keyExtractor={(item, index) => index.toString()}
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
                  {item.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
                </Text>
                <Text style={[styles.dayText, isSelected && styles.activeDayText]}>
                  {item.getDate()}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Lista de medicamentos */}
      <ScrollView style={styles.medicineList}>
        {medicamentos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#fff" />
            <Text style={styles.emptyText}>Você não tem nenhum medicamento hoje!</Text>
            <Text style={styles.emptySubText}>
              Toque no "+" abaixo para adicionar um novo medicamento.
            </Text>
          </View>
        ) : (
          medicamentos.map((med, index) => (
            <View key={index}>
              <Text style={styles.timeLabel}>{med.horario}</Text>
              <View style={styles.medCard}>
                <Ionicons name="medkit-outline" size={16} color="#555" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.medName}>{med.nome}</Text>
                  <Text style={styles.medDetails}>{med.detalhe}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal de calendário mensal */}
      <Modal
        isVisible={calendarVisible}
        onBackdropPress={() => setCalendarVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        style={styles.calendarModal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Escolha uma data</Text>
            <TouchableOpacity onPress={() => setCalendarVisible(false)}>
              <Ionicons name="close-circle-outline" size={28} color="#a89eff" />
            </TouchableOpacity>
          </View>

          <Calendar
            onDayPress={(day: { dateString: string | number | Date; }) => handleDateSelect(new Date(day.dateString))}
            markedDates={{
              [selectedDate.toISOString().split('T')[0]]: {
                selected: true,
                selectedColor: '#a89eff',
              },
            }}
            theme={{
              backgroundColor: '#fff',
              calendarBackground: '#fff',
              textSectionTitleColor: '#2e2e3e',
              selectedDayTextColor: '#fff',
              todayTextColor: '#a89eff',
              dayTextColor: '#000',
              arrowColor: '#a89eff',
            }}
          />
        </View>
      </Modal>

      <Footer />
      {/* Barra de navegação inferior */}
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={26} color="#a89eff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/MyMedicineScreen')}>
          <Ionicons name="pulse-outline" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/AddMedicineScreen')}>
          <Ionicons name="add" size={30} color="#fff"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/HealthInfoScreen')}>
          <Ionicons name="book-outline" size={26} color="#fff"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/ProfileScreen')}>
          <Ionicons name="person-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8793FF',
    paddingTop: 70,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 20,
  },
  userName: {
    color: '#fff',
    fontSize: 15,
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
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: '#a89eff',
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
    textAlign: 'center',
  },
  emptySubText: {
    color: '#eee',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  timeLabel: {
    color: '#a89eff',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    fontSize: 14,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2e3e',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  medName: {
    color: '#fff',
    fontSize: 16,
  },
  medDetails: {
    color: '#ccc',
    fontSize: 12,
  },
  navbar: {
    backgroundColor: '#3a3a4d',
    padding: 12,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 70,
  },
  calendarModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e2e3e',
  },
});
