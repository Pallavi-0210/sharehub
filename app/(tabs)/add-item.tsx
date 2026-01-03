import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useItems } from "../context/ItemsContext"; // 🔹 Access the simulation store
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = ["Books", "Electronics", "Furniture", "Lab Gear"];
const CONDITIONS = ["New", "Good", "Used"];

export default function AddItemScreen() {
    const { user } = useUser();
    const { addItem } = useItems();
    const router = useRouter();

    // Form States
    const [listingType, setListingType] = useState<"Share" | "Sell">("Share");
    const [category, setCategory] = useState("Books");
    const [condition, setCondition] = useState("Good");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    const handlePost = () => {
        // Validation
        if (!title.trim()) {
            Alert.alert("Missing Info", "Please enter an item name.");
            return;
        }
        if (listingType === "Sell" && !price) {
            Alert.alert("Missing Info", "Please enter a price for the sale.");
            return;
        }

        setIsPosting(true);

        // 🔹 Simulate network delay for a professional feel
        setTimeout(() => {
            const newItem = {
                id: Date.now().toString(),
                name: title,
                price: listingType === "Share" ? "Free" : `₹${price}`,
                type: listingType,
                condition: condition,
                category: category,
                image: image || "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=600",
                owner: user?.firstName || "Student",
                location: location || "Campus",
                description: description
            };

            addItem(newItem); // 🔹 Push to our global simulation store
            setIsPosting(false);

            Alert.alert("Success", `${title} has been listed!`);

            // Reset Form fields
            setTitle("");
            setPrice("");
            setImage("");
            setLocation("");
            setDescription("");

            // Navigate back to Home
            router.replace("/(tabs)");
        }, 1200);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.mainTitle}>Create Listing</Text>

                <Text style={styles.label}>Transaction Type</Text>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, listingType === "Share" && styles.activeTab]}
                        onPress={() => setListingType("Share")}
                    >
                        <Text style={[styles.tabText, listingType === "Share" && styles.activeTabText]}>🤝 Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, listingType === "Sell" && styles.activeTab]}
                        onPress={() => setListingType("Sell")}
                    >
                        <Text style={[styles.tabText, listingType === "Sell" && styles.activeTabText]}>💰 Sell</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.inputLabel}>Item Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Calculus Textbook"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={styles.inputLabel}>Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.chip, category === cat && styles.activeChip]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[styles.chipText, category === cat && styles.activeChipText]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={styles.inputLabel}>Condition</Text>
                    <View style={styles.row}>
                        {CONDITIONS.map((cond) => (
                            <TouchableOpacity
                                key={cond}
                                style={[styles.conditionBtn, condition === cond && styles.activeCondition]}
                                onPress={() => setCondition(cond)}
                            >
                                <Text style={condition === cond ? styles.activeChipText : styles.chipText}>{cond}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {listingType === "Sell" && (
                        <View>
                            <Text style={styles.inputLabel}>Price (₹) *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter price"
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>
                    )}

                    <Text style={styles.inputLabel}>Pickup Location</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Hostel B, Room 204"
                        value={location}
                        onChangeText={setLocation}
                    />

                    <Text style={styles.inputLabel}>Image URL (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Paste an image link here"
                        value={image}
                        onChangeText={setImage}
                    />

                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Any extra details peer students should know?"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />

                    <TouchableOpacity
                        style={[styles.submitBtn, isPosting && { opacity: 0.7 }]}
                        onPress={handlePost}
                        disabled={isPosting}
                    >
                        {isPosting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitBtnText}>Post to Community</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FB", padding: 20 },
    mainTitle: { fontSize: 28, fontWeight: "800", color: "#1E293B", marginBottom: 20, marginTop: 10 },
    label: { fontSize: 12, fontWeight: "700", marginBottom: 10, color: "#64748B", textTransform: "uppercase" },
    tabContainer: { flexDirection: "row", backgroundColor: "#E2E8F0", borderRadius: 16, padding: 4, marginBottom: 25 },
    tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 12 },
    activeTab: { backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
    tabText: { fontSize: 14, fontWeight: "600", color: "#64748B" },
    activeTabText: { color: "#6366F1" },
    form: { gap: 15 },
    inputLabel: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
    input: { backgroundColor: "#fff", borderRadius: 14, padding: 15, fontSize: 16, borderWidth: 1, borderColor: "#E2E8F0" },
    chipScroll: { marginBottom: 5 },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#E2E8F0", marginRight: 8 },
    activeChip: { backgroundColor: "#6366F1" },
    chipText: { color: "#475569", fontWeight: "600" },
    activeChipText: { color: "#fff" },
    row: { flexDirection: "row", gap: 10 },
    conditionBtn: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: "#E2E8F0", alignItems: "center" },
    activeCondition: { backgroundColor: "#10B981" },
    textArea: { height: 100, textAlignVertical: "top" },
    submitBtn: {
        backgroundColor: "#6366F1",
        padding: 18,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 10,
        elevation: 4,
        shadowColor: "#6366F1",
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});