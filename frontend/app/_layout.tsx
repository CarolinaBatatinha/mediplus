import { Stack } from "expo-router";

export default function MainLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup/page" options={{ headerShown: false }} />
        <Stack.Screen name="(panel)/profile/profile" options={{ headerShown: false }} />
        <Stack.Screen name="(panel)/profile/home" options={{ headerShown: false }} />
        <Stack.Screen name="(panel)/profile/history" options={{ headerShown: false }} />
        <Stack.Screen name="(panel)/profile/add" options={{ headerShown: false }} />
        <Stack.Screen name="(panel)/profile/tips" options={{ headerShown: false }} />
        <Stack.Screen name="(panel)/profile/editProfile" options={{ headerShown: false }} />
      </Stack>
  );
}