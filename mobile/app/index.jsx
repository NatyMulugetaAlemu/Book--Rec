import { Redirect } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function Index() {
  const { user, token, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return null;

  return user && token
    ? <Redirect href="/(tabs)" />
    : <Redirect href="/(auth)" />;
}