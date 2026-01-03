import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from "react-native";
import { useSignUp, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
    const { signUp, isLoaded } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 🔹 Toggle state

    useEffect(() => {
        if (isSignedIn) {
            router.replace("/(tabs)");
        }
    }, [isSignedIn]);

    if (!isLoaded) return null;

    const handleSignUp = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await signUp.create({
                emailAddress: email.trim(),
                password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            router.push("/verify");
        } catch (err: any) {
            if (err.errors?.[0]?.code === "session_exists") {
                router.replace("/(tabs)");
            } else {
                Alert.alert("Sign Up Error", err.errors?.[0]?.message || "Failed to create account.");
            }
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
                {/* 🔹 Header Section */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join ShareHub and start sharing today!</Text>
                </View>

                {/* 🔹 Form Section */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
                        <TextInput
                            placeholder="College Email"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            placeholderTextColor="#94A3B8"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Password"
                            secureTextEntry={!isPasswordVisible} // 🔹 Toggle visibility
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            placeholderTextColor="#94A3B8"
                        />
                        {/* 🔹 Visibility Toggle Button */}
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                size={22}
                                color="#64748B"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* 🔹 Primary Action Button */}
                    <TouchableOpacity
                        style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.primaryBtnText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* 🔹 Footer Section */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.linkText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    innerContainer: { flex: 1, padding: 24, justifyContent: "center" },
    header: { marginBottom: 40 },
    title: { fontSize: 32, fontWeight: "800", color: "#1E293B", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "#64748B" },
    form: { gap: 16 },
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
    input: { flex: 1, fontSize: 16, color: "#1E293B" },
    eyeIcon: { padding: 8 },
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