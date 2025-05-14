import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/components/useColorScheme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" />
          <Stack.Screen name="LoginScreen" />
          <Stack.Screen name="HomeScreen" />
          <Stack.Screen name="AddMedicineScreen" />
          <Stack.Screen name="PasswordRecovery" />
          <Stack.Screen name="RegistrationScreen" />
          <Stack.Screen name="MyMedicineScreen" />
          <Stack.Screen name="ProfileScreen" />
          <Stack.Screen name="HealthInfoScreen" />
          <Stack.Screen name="EditMedicineScreen" />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}