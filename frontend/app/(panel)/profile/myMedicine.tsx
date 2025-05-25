import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import Footer from '../../../footer';
import { Medicamento } from '../../../modelos/Medicamento';
import { medicineService } from '../../../services/medicineService';

export default function MyMedicinesScreen() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [medicamentoSelecionado, setMedicamentoSelecionado] = useState<Medicamento | null>(null);
    const router = useRouter();

    useEffect(() => {
        carregarMedicamentos();
    }, []);

    async function carregarMedicamentos() {
        const lista = await medicineService.listar();
        setMedicamentos(lista);
    }

    async function excluirMedicamento() {
        if (medicamentoSelecionado) {
            await medicineService.remover(medicamentoSelecionado.id);
            await carregarMedicamentos();
            setMedicamentoSelecionado(null);
            setModalVisible(false);
        }
    }

    function confirmarExclusao(medicamento: Medicamento) {
        setMedicamentoSelecionado(medicamento);
        setModalVisible(true);
    }

    function editarMedicamento(medicamento: Medicamento) {
        router.push(`./EditMedicineScreen?id=${medicamento.id}`);
    }


    function renderLeftActions(item: Medicamento) {
        return (
            <View style={styles.leftAction}>
                <TouchableOpacity style={styles.editButton} onPress={() => editarMedicamento(item)}>
                    <Ionicons name="create-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }
    
    function renderRightActions(item: Medicamento) {
        return (
            <View style={styles.rightAction}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => confirmarExclusao(item)}>
                    <Ionicons name="trash-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Meus medicamentos</Text>

            <FlatList
                data={medicamentos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Swipeable
                        renderLeftActions={() => renderLeftActions(item)}
                        renderRightActions={() => renderRightActions(item)}
                    >
                        <View style={styles.card}>
                            <View style={styles.info}>
                                <Text style={styles.nome}>{item.nome}</Text>
                                <Text style={styles.detalhe}>{item.detalhe}</Text>
                            </View>
                            <View style={styles.horario}>
                                <Ionicons name="time-outline" size={20} color="#9b59b6" />
                                <Text style={styles.horaTexto}>{item.alarme}</Text>
                            </View>
                        </View>
                    </Swipeable>
                )}
            />

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTexto}>Confirma a exclusão?</Text>
                        <View style={styles.modalBotoes}>
                            <TouchableOpacity style={styles.modalBotaoSim} onPress={excluirMedicamento}>
                                <Text style={styles.modalBotaoTexto}>Sim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalBotaoNao} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalBotaoTexto}>Não</Text>
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
        paddingTop: 60, 
        backgroundColor: '#8793FF', 
        paddingHorizontal: 20 
    },
    titulo: { 
        color: '#fff', 
        fontSize: 24, 
        marginBottom: 30, 
        alignSelf: 'center' 
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    info: { 
        flex: 1, 
        marginLeft: 10 
    },
    nome: { 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    detalhe: { 
        color: '#888' 
    },
    horario: { 
        alignItems: 'center' 
    },
    horaTexto: { 
        color: '#9b59b6', 
        fontWeight: 'bold' 
    },
    actionsContainer: { 
        flexDirection: 'row', 
        height: '100%' 
    },
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    modalContent: { 
        backgroundColor: '#333', 
        padding: 30, 
        borderRadius: 20, 
        width: 250, 
        alignItems: 'center'
    },
    modalTexto: { 
        color: '#fff', 
        fontSize: 18, 
        marginBottom: 20 
    },
    modalBotoes: { 
        flexDirection: 'row', 
        gap: 20 
    },
    modalBotaoSim: { 
        backgroundColor: '#e57373', 
        padding: 10, borderRadius: 10, 
        width: 80, alignItems: 'center' 
    },
    modalBotaoNao: { 
        backgroundColor: '#81c784', 
        padding: 10, 
        borderRadius: 10, 
        width: 80, 
        alignItems: 'center' 
    },
    modalBotaoTexto: { 
        color: '#fff', 
        fontWeight: 'bold' 
    },
    leftAction: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'flex-start', 
        paddingLeft: 10,
        marginBottom: 15,
    },
    
    rightAction: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'flex-end', 
        paddingRight: 10,
        marginBottom: 15,
    },
    
    editButton: {
        backgroundColor: '#9b59b6', 
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    deleteButton: {
        backgroundColor: '#e57373', 
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});