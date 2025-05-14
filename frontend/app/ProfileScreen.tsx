import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Footer from '@/components/Footer';

export default function ProfileScreen() {
  const router = useRouter();
  const menuOptions = [
    {
      icon: 'person-outline',
      text: 'editar perfil',
      onPress: () => router.push('./')
    },
    {
      icon: 'print-outline',
      text: 'imprimir relatório',
      onPress: () => router.push('./')
    },
    {
      icon: 'log-out-outline',
      text: 'logout',
      onPress: () => router.push('/LoginScreen')
    }
  ]

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/HomeScreen')} style={styles.header}>
        <Ionicons name="chevron-back-circle-outline" size={28} color="#fff" />

        <Text style={styles.headerText}>Meu Perfil</Text>
      </TouchableOpacity>

      {/* Avatar removido, agora apenas o nome e o ícone */}
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>João da Silva</Text>
      </View>

      <View style={styles.ProfileMenu}>
        <FlatList
          data={menuOptions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => item.onPress()}
                style={[styles.ProfileMenuItem, { marginBottom: index ===  menuOptions.length - 1 ? 0 : 30 }]}
              >
                <Ionicons name={ item.icon } size={26} color="#000" />

                <Text style={styles.ProfileMenuItemText}>
                  { item.text }
                </Text>
              </TouchableOpacity>
            );
          }}
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
    paddingTop: 70,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
    gap: 20
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 300
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 70,
    gap: 20
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 500
  },
  ProfileMenu: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 60,
    gap: 60,
    backgroundColor: '#ffffff33',
    width: '100%',
    borderRadius: 50,
    padding: 40,
  },
  ProfileMenuItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  ProfileMenuItemText: {
    color: '#000',
    fontSize: 18
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
});
