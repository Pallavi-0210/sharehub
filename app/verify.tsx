import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function VerifyScreen() {
    const { signUp, isLoaded, setActive } = useSignUp();
    const router = useRouter();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isLoaded) return null;

    const handleVerify = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const result = await signUp.attemptEmailAddressVerification({ code });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                Alert.alert("Welcome!", "Your account is now verified.");
                router.replace("/(tabs)");
            } else {
                console.info("Status not complete:", result.status);
            }
        } catch (err: any) {
            Alert.alert("Verification Failed", err.errors?.[0]?.message || "Invalid code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.innerContainer}
            >
                {/* 🔹 Back Button */}
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>

                {/* 🔹 Header Section */}
                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="mail-unread-outline" size={40} color="#6366F1" />
                    </View>
                    <Text style={styles.title}>Verify Email</Text>
                    <Text style={styles.subtitle}>
                        We've sent a 6-digit verification code to your email address.
                    </Text>
                </View>

                {/* 🔹 Form Section */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="keypad-outline" size={20} color="#64748B" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Enter 6-digit code"
                            value={code}
                            onChangeText={setCode}
                            style={styles.input}
                            placeholderTextColor="#94A3B8"
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                        onPress={handleVerify}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.primaryBtnText}>Verify & Continue</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* 🔹 Footer Section */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Didn't receive the code? </Text>
                    <TouchableOpacity onPress={() => Alert.alert("Resend", "Sending new code...")}>
                        <Text style={styles.linkText}>Resend Code</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    innerContainer: { flex: 1, padding: 24 },
    backBtn: { marginTop: 10, marginBottom: 20 },
    header: { alignItems: "center", marginBottom: 40, marginTop: 20 },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: { fontSize: 28, fontWeight: "800", color: "#1E293B", marginBottom: 12 },
    subtitle: { fontSize: 16, color: "#64748B", textAlign: "center", lineHeight: 24, paddingHorizontal: 20 },
    form: { gap: 20 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 18, color: "#1E293B", fontWeight: "600", letterSpacing: 2 },
    primaryBtn: {
        backgroundColor: "#6366F1",
        height: 60,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 40,
    },
    footerText: { fontSize: 15, color: "#64748B" },
    linkText: { fontSize: 15, color: "#6366F1", fontWeight: "700" },
});