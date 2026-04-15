import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";

function RouteGuard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  const isAuthGroup = segments[0] === "(auth)";
  const isTabGroup = segments[0] === "(tabs)";

  useEffect(() => {
    if (isLoading) return
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={"#fff"} />
      </View>
    )
  }

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
