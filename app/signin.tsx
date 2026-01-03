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
import { useSignIn, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
    const { signIn, isLoaded, setActive } = useSignIn();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 🔹 State for visibility toggle

    useEffect(() => {
        if (isSignedIn) {
            router.replace("/(tabs)");
        }
    }, [isSignedIn]);

    if (!isLoaded) return null;

    const handleSignIn = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const result = await signIn.create({
                identifier: email.trim(),
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
            }
        } catch (err: any) {
            if (err.errors?.[0]?.code === "session_exists") {
                router.replace("/(tabs)");
            } else {
                Alert.alert("Login Failed", err.errors?.[0]?.message || "Check your credentials");
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
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome To ShareHub</Text>
                    <Text style={styles.subtitle}>Sign in to continue sharing resources</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Email Address"
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
                        {/* 🔹 Toggle Button */}
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

                    <TouchableOpacity onPress={() => router.push("/forgot-password")} style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                        onPress={handleSignIn}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Sign In</Text>}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/signup")}>
                        <Text style={styles.linkText}>Create One</Text>
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
    eyeIcon: { padding: 8 }, // 🔹 Padding for better touch target
    forgotPasswordContainer: { alignSelf: "flex-end" },
    forgotPasswordText: { color: "#6366F1", fontWeight: "600", fontSize: 14 },
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
    footer: { flexDirection: "row", justifyContent: "center", marginTop: 40 },
    footerText: { fontSize: 15, color: "#64748B" },
    linkText: { fontSize: 15, color: "#6366F1", fontWeight: "700" },
});