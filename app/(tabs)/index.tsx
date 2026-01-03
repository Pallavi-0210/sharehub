import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useItems } from "../context/ItemsContext";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  StatusBar as RNStatusBar,
  Modal, // 🔹 Added Modal
  ScrollView,
} from "react-native";

const { width, height } = Dimensions.get("window");

const CATEGORIES = [
  { id: 1, name: "Books", icon: "book-outline" },
  { id: 2, name: "Electronics", icon: "laptop-outline" },
  { id: 3, name: "Furniture", icon: "bed-outline" },
  { id: 4, name: "Lab Gear", icon: "flask-outline" },
];

export default function HomeScreen() {
  const { user } = useUser();
  const { items } = useItems();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showHowItWorks, setShowHowItWorks] = useState(false); // 🔹 Modal state

  const filteredItems = items.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Render the How It Works Modal
  const renderHowItWorks = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showHowItWorks}
      onRequestClose={() => setShowHowItWorks(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowHowItWorks(false)}
          >
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>How ShareHub Works</Text>
          <Text style={styles.modalSubtitle}>Empowering the campus community through sharing.</Text>

          <View style={styles.stepContainer}>
            <Step
              icon="camera-outline"
              title="1. List an Item"
              desc="Snap a photo of your book, gear, or electronics. Set a price or offer it for free."
            />
            <Step
              icon="chatbubbles-outline"
              title="2. Connect"
              desc="Interested peers will reach out to you via your preferred contact method."
            />
            <Step
              icon="location-outline"
              title="3. Exchange"
              desc="Meet at a safe campus location like the library or hostel lounge to swap."
            />
          </View>

          <TouchableOpacity
            style={styles.gotItBtn}
            onPress={() => setShowHowItWorks(false)}
          >
            <Text style={styles.gotItText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* 1. Header Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.userNameText}>{user?.firstName || "Student"} ✨</Text>
        </View>
        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
      </View>

      {/* 2. Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroInfo}>
          <Text style={styles.heroTitle}>Community Exchange</Text>
          <Text style={styles.heroSubtitle}>Share resources or find great deals on campus.</Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => setShowHowItWorks(true)} // 🔹 Trigger Modal
          >
            <Text style={styles.heroBtnText}>How it works</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroIconContainer}>
          <Ionicons name="planet-outline" size={80} color="rgba(255,255,255,0.2)" />
        </View>
      </View>

      {/* 3. Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Search items..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* 4. Categories */}
      <Text style={styles.label}>Categories</Text>
      <FlatList
        data={[{ id: 'all', name: 'All', icon: 'grid-outline' }, ...CATEGORIES]}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item.name)}
            style={[
              styles.pill,
              selectedCategory === item.name && styles.activePill,
            ]}
          >
            <Ionicons
              name={item.icon as any}
              size={16}
              color={selectedCategory === item.name ? "#fff" : "#6366F1"}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.pillText, selectedCategory === item.name && styles.activePillText]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.label}>Recently Added</Text>
        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFDFF" translucent={true} />

      {renderHowItWorks()}

      <FlatList
        data={filteredItems}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={styles.itemCard}>
            <View>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={[styles.badge, { backgroundColor: item.type === "Sell" ? "#FFE4E6" : "#DCFCE7" }]}>
                <Text style={[styles.badgeText, { color: item.type === "Sell" ? "#E11D48" : "#166534" }]}>
                  {item.type === "Sell" ? "SALE" : "FREE"}
                </Text>
              </View>
              <View style={styles.conditionTag}>
                <Text style={styles.conditionText}>{item.condition}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
              <View style={styles.ownerRow}>
                <View style={styles.ownerCircle}>
                  <Text style={styles.ownerInitial}>{item.owner[0]}</Text>
                </View>
                <Text style={styles.ownerName}>{item.owner}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// 🔹 Reusable Step Component for Modal
const Step = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <View style={styles.stepItem}>
    <View style={styles.stepIconBox}>
      <Ionicons name={icon} size={22} color="#6366F1" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDesc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFF",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greetingText: { fontSize: 14, color: "#94A3B8", fontWeight: "500" },
  userNameText: { fontSize: 24, fontWeight: "800", color: "#1E293B" },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' },

  heroCard: {
    backgroundColor: "#6366F1",
    borderRadius: 24,
    padding: 24,
    marginBottom: 25,
    flexDirection: "row",
    overflow: "hidden",
    position: 'relative'
  },
  heroInfo: { flex: 1, zIndex: 1 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 6 },
  heroSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 18, marginBottom: 15 },
  heroBtn: { backgroundColor: "#fff", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, alignSelf: "flex-start" },
  heroBtnText: { color: "#6366F1", fontWeight: "bold", fontSize: 12 },
  heroIconContainer: { position: "absolute", right: -10, bottom: -10 },

  searchWrapper: { marginBottom: 25 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 15,
    borderRadius: 16,
    height: 52,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: "#1E293B" },

  label: { fontSize: 18, fontWeight: "800", color: "#1E293B", marginBottom: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  seeAll: { color: "#6366F1", fontWeight: "600", fontSize: 13 },

  categoryList: { paddingBottom: 25 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activePill: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  pillText: { fontWeight: "600", color: "#475569" },
  activePillText: { color: "#fff" },

  listContainer: { paddingBottom: 40 },
  row: { justifyContent: "space-between", paddingHorizontal: 20 },
  itemCard: {
    backgroundColor: "#fff",
    width: (width / 2) - 28,
    marginBottom: 18,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  cardImage: { width: "100%", height: 150, backgroundColor: "#F8FAFC" },
  badge: { position: "absolute", top: 12, left: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: "800" },
  conditionTag: { position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  conditionText: { color: "#fff", fontSize: 10, fontWeight: "bold" },

  cardContent: { padding: 14 },
  itemName: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  itemPrice: { fontSize: 16, color: "#6366F1", fontWeight: "800", marginTop: 4 },

  ownerRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  ownerCircle: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center' },
  ownerInitial: { fontSize: 9, fontWeight: 'bold', color: '#6366F1' },
  ownerName: { fontSize: 11, color: "#64748B", marginLeft: 6, fontWeight: "500" },

  // 🔹 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: height * 0.8,
  },
  closeBtn: { alignSelf: 'flex-end', padding: 8 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 30 },
  stepContainer: { gap: 24, marginBottom: 32 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  stepIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  stepTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  stepDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  gotItBtn: { backgroundColor: '#6366F1', padding: 18, borderRadius: 16, alignItems: 'center' },
  gotItText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});