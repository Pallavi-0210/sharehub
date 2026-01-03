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
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
    const { signIn, isLoaded, setActive } = useSignIn();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    if (!isLoaded) return null;

    // 1. Request the password reset code
    const onRequestReset = async () => {
        if (!email) return Alert.alert("Error", "Please enter your email address.");
        setLoading(true);
        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email.trim(),
            });
            setSuccessfulCreation(true);
            Alert.alert("Success", "A reset code has been sent to your email.");
        } catch (err: any) {
            Alert.alert("Error", err.errors?.[0]?.message || "Identifier is invalid");
        } finally {
            setLoading(false);
        }
    };

    // 2. Submit the code and the new password
    const onResetPassword = async () => {
        if (!code || !password) return Alert.alert("Error", "Please fill in all fields.");
        setLoading(true);
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                Alert.alert("Success", "Password reset successful!");
                router.replace("/(tabs)");
            }
        } catch (err: any) {
            Alert.alert("Error", err.errors?.[0]?.message || "Reset failed");
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
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="lock-open-outline" size={40} color="#6366F1" />
                    </View>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        {!successfulCreation
                            ? "Enter your email to receive a password reset code."
                            : `Enter the code sent to ${email} and your new password.`}
                    </Text>
                </View>

                <View style={styles.form}>
                    {!successfulCreation ? (
                        <>
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
                            <TouchableOpacity
                                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                                onPress={onRequestReset}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Send Reset Code</Text>}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={styles.inputContainer}>
                                <Ionicons name="keypad-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                <TextInput
                                    placeholder="6-Digit Code"
                                    value={code}
                                    onChangeText={setCode}
                                    style={styles.input}
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="number-pad"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                <TextInput
                                    placeholder="New Password"
                                    secureTextEntry={!isPasswordVisible}
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    placeholderTextColor="#94A3B8"
                                />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                                    <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={22} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                                onPress={onResetPassword}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Reset Password</Text>}
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <TouchableOpacity onPress={() => router.back()} style={styles.footer}>
                    <Text style={styles.footerText}>Back to </Text>
                    <Text style={styles.linkText}>Sign In</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    innerContainer: { flex: 1, padding: 24 },
    backBtn: { marginTop: 10, marginBottom: 20 },
    header: { alignItems: "center", marginBottom: 35 },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: { fontSize: 28, fontWeight: "800", color: "#1E293B", marginBottom: 10 },
    subtitle: { fontSize: 15, color: "#64748B", textAlign: "center", lineHeight: 22, paddingHorizontal: 10 },
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
        elevation: 4,
        shadowColor: "#6366F1",
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    primaryBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
    footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
    footerText: { fontSize: 15, color: "#64748B" },
    linkText: { fontSize: 15, color: "#6366F1", fontWeight: "700" },
});