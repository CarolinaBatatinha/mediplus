import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Footer() {
     const router = useRouter();
     const segments = useSegments();

     // Verifica qual tela está ativa com lógica mais precisa
     const isActive = (path: string) => {
          const currentPath = segments.join('/');
          return currentPath.includes(path);
     };

     return (
          <View style={styles.navbar}>
               <TouchableOpacity onPress={() => router.push('/(panel)/profile/home')}>
                    <Ionicons
                         name="home-outline"
                         size={26}
                         color={isActive('profile/home') ? '#7121D9' : '#fff'}
                    />
               </TouchableOpacity>

               <TouchableOpacity onPress={() => router.push('/(panel)/profile/history')}>
                    <Ionicons
                         name="pulse-outline"
                         size={26}
                         color={isActive('profile/history') ? '#7121D9' : '#fff'}
                    />
               </TouchableOpacity>

               <TouchableOpacity onPress={() => router.push('/(panel)/profile/add')}>
                    <Ionicons
                         name="add"
                         size={30}
                         color={isActive('profile/add') ? '#7121D9' : '#fff'}
                    />
               </TouchableOpacity>

               <TouchableOpacity onPress={() => router.push('/(panel)/profile/tips')}>
                    <Ionicons
                         name="book-outline"
                         size={26}
                         color={isActive('profile/tips') ? '#7121D9' : '#fff'}
                    />
               </TouchableOpacity>

               <TouchableOpacity onPress={() => router.push('/(panel)/profile/profile')}>
                    <Ionicons
                         name="person-outline"
                         size={26}
                         color={isActive('profile/profile') ? '#7121D9' : '#fff'}
                    />
               </TouchableOpacity>
          </View>
     );
}

const styles = StyleSheet.create({
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