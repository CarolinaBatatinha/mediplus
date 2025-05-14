import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Footer() {
    const router = useRouter();

    return (

        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
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
