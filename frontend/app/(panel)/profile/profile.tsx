import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Footer from '../../../components/Footer';
import { Medicamento } from '../../../modelos/Medicamento';
import { medicineService } from '../../../services/medicineService';

export default function Profile() {
     const router = useRouter();
     const [userName, setUserName] = useState('Usuário');
     const [userEmail, setUserEmail] = useState('email@exemplo.com');
     const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

     // Carrega os dados do usuário e medicamentos ao abrir a tela
     useEffect(() => {
          loadUserData();
          fetchMedicamentos();
     }, []);

     const loadUserData = async () => {
          const name = await AsyncStorage.getItem('userName');
          const email = await AsyncStorage.getItem('userEmail');
          if (name) setUserName(name);
          if (email) setUserEmail(email);
     };

     const fetchMedicamentos = async () => {
          const dadosMedicamentos = await medicineService.listar();
          setMedicamentos(dadosMedicamentos);
     };

     const handleLogout = async () => {
          await AsyncStorage.clear();
          router.push('/');
     };

     // Gerar PDF do perfil com histórico
     const generatePdf = async () => {
          const medicamentosFiltrados = medicamentos.filter(m => m.status);

          const html = `
      <html>
        <head>
          <style>
            body { 
              font-family: Arial; 
              padding: 25px; 
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px;
              border-bottom: 2px solid #8793FF;
              padding-bottom: 15px;
            }
            .profile-info {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 25px;
            }
            .info-row {
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #8793FF;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            th, td {
              padding: 12px 15px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #8793FF;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .tomado {
              color: #4CAF50;
              font-weight: bold;
            }
            .esquecido {
              color: #F44336;
              font-weight: bold;
            }
            .empty-history {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Saúde</h1>
            <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div class="profile-info">
            <div class="info-row">
              <span class="info-label">Paciente:</span> ${userName}
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span> ${userEmail}
            </div>
          </div>
          
          <h2>Histórico de Medicamentos</h2>
          ${medicamentosFiltrados.length > 0 ? `
            <table>
              <tr>
                <th>Medicamento</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Status</th>
                <th>Detalhes</th>
              </tr>
              ${medicamentosFiltrados.map(med => `
                <tr>
                  <td>${med.nome}</td>
                  <td>${new Date(med.criado_em).toLocaleDateString('pt-BR')}</td>
                  <td>${med.horario}</td>
                  <td class="${med.status}">
                    ${med.status === 'tomado' ? 'Tomado ✓' : 'Esquecido ✕'}
                  </td>
                  <td>${med.dosagem || '-'}</td>
                </tr>
              `).join('')}
            </table>
          ` : `
            <p class="empty-history">Nenhum registro de medicamento encontrado</p>
          `}
        </body>
      </html>
    `;

          const { uri } = await Print.printToFileAsync({
               html,
               base64: false
          });
          return uri;
     };

     // Compartilhar PDF
     const sharePdf = async () => {
          try {
               const pdfUri = await generatePdf();
               await Sharing.shareAsync(pdfUri, {
                    dialogTitle: 'Compartilhar Relatório',
                    mimeType: 'application/pdf',
                    UTI: 'com.adobe.pdf'
               });
          } catch (error) {
               console.error('Erro ao gerar/compartilhar PDF:', error);
          }
     };

     const menuOptions = [
          {
               icon: 'person-outline',
               text: 'Editar Perfil',
               onPress: () => router.push('/(panel)/profile/editProfile'),
          },
          {
               icon: 'document-text-outline',
               text: 'Gerar Relatório',
               onPress: sharePdf,
          },
          {
               icon: 'exit-outline',
               text: 'Sair',
               onPress: handleLogout,
          },
     ];

     return (
          <View style={styles.container}>
               {/* Cabeçalho */}
               <TouchableOpacity
                    onPress={() => router.push('/(panel)/profile/home')}
                    style={styles.header}
               >
                    <Ionicons name="chevron-back-circle-outline" size={28} color="#fff" />
                    <Text style={styles.headerText}>Meu Perfil</Text>
               </TouchableOpacity>

               {/* Ícone e Dados do Usuário */}
               <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle-outline" size={100} color="#fff" />
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>
               </View>

               {/* Menu de Opções */}
               <View style={styles.profileMenu}>
                    <FlatList
                         data={menuOptions}
                         keyExtractor={(item, index) => index.toString()}
                         renderItem={({ item, index }) => (
                              <TouchableOpacity
                                   onPress={item.onPress}
                                   style={[
                                        styles.menuItem,
                                        { marginBottom: index === menuOptions.length - 1 ? 0 : 15 },
                                   ]}
                              >
                                   <Ionicons name={item.icon as any} size={26} color="#000" />
                                   <Text style={styles.menuItemText}>{item.text}</Text>
                              </TouchableOpacity>
                         )}
                    />
               </View>

               <Footer></Footer>
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
     header: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
     },
     headerText: {
          color: '#fff',
          fontSize: 18,
          fontWeight: '300',
          marginLeft: 10,
     },
     avatarContainer: {
          alignItems: 'center',
          marginTop: 30,
          marginBottom: 30,
     },
     userName: {
          fontSize: 22,
          fontWeight: '600',
          color: '#fff',
          marginTop: 15,
     },
     userEmail: {
          fontSize: 16,
          color: '#e0e0e0',
          marginTop: 5,
     },
     profileMenu: {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 20,
          padding: 20,
          width: '100%',
     },
     menuItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 30,
     },
     menuItemText: {
          color: '#000',
          fontSize: 16,
          marginLeft: 15,
     },
     navbar: {
          backgroundColor: '#3a3a4d',
          padding: 12,
          borderRadius: 40,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 60,
     },
});