import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

function RouteGuard() {
  const router = useRouter();
  const { user } = useAuth();
  const segments = useSegments();

  const isAuthGroup = segments[0] === "(auth)";
  const isTabGroup = segments[0] === "(tabs)";

  useEffect(() => {
    if (!user) {
      if (!isAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else {
      if (!isTabGroup) {
        router.push("/(tabs)");
      }
    }
  }, [user, segments, router]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard />
    </AuthProvider>
  );
}
