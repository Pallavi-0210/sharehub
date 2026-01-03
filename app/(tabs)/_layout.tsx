import { Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { isSignedIn } = useAuth();

  // 🔹 REQUIREMENT: Unauthenticated users must not access protected screens
  if (!isSignedIn) {
    return <Redirect href="/signin" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366F1", // Indigo theme for a modern feel
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 65,
          paddingBottom: 12,
          backgroundColor: "#fff",
        },
      }}
    >
      {/* 1. Home Tab - index.tsx */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false, // Home has its own custom header
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />

      {/* 2. Add Item Tab - add-item.tsx (Now in the middle) */}
      <Tabs.Screen
        name="add-item"
        options={{
          title: "Post",
          headerShown: true,
          headerTitle: "List New Resource",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={34} color={color} style={{ marginTop: -2 }} />
          ),
        }}
      />

      {/* 3. Profile Tab - explore.tsx (Now last) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Profile",
          headerShown: true,
          headerTitle: "My Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}