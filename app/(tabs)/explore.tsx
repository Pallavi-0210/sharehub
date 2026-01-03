import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
        <Text style={styles.name}>{user?.fullName || "Student User"}</Text>
        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.label}>Account Details</Text>
        <View style={styles.infoRow}>
          <Ionicons name="id-card-outline" size={20} color="#666" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{user?.id}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>{user?.primaryEmailAddress?.emailAddress}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7", padding: 20 },
  profileCard: { backgroundColor: "#fff", padding: 25, borderRadius: 20, alignItems: "center", marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "bold" },
  email: { color: "gray", marginTop: 4 },
  detailsSection: { backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#888", marginBottom: 15, textTransform: "uppercase" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  infoTextContainer: { marginLeft: 15 },
  infoLabel: { fontSize: 12, color: "#888" },
  infoValue: { fontSize: 14, fontWeight: "500", color: "#333" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFE5E5"
  },
  logoutText: { color: "#FF3B30", fontWeight: "bold", marginLeft: 10 }
});