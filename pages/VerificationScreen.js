import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = { primary: '#235A32', white: '#FFFFFF', textDark: '#111111', textLight: '#666666', borderColor: '#E8E8E8', bg: '#F7F9F5' };
const API_URL = 'http://192.168.18.80:5000/api/verification/verify';

export default function VerificationScreen({ navigation, route }) {
  const { email } = route.params; 
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length < 6) {
      Alert.alert("Error", "Please enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Email verified successfully! Please log in.");
        navigation.navigate('Login'); 
      } else {
        Alert.alert("Verification Failed", data.error || "Invalid or expired code.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>

        <View style={styles.container}>
          <View style={styles.iconBg}>
            <MaterialCommunityIcons name="email-check-outline" size={50} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit verification code to{'\n'}
            <Text style={{ fontWeight: '700', color: COLORS.textDark }}>{email}</Text>
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
              autoFocus
            />
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleVerify} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Verify Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendBtn}>
            <Text style={styles.resendText}>Didn't receive code? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Resend</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  backBtn: { padding: 20 },
  container: { flex: 1, paddingHorizontal: 25, alignItems: 'center', marginTop: 20 },
  iconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.primary, marginBottom: 10 },
  subtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  inputWrapper: { width: '100%', marginBottom: 30 },
  input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.borderColor, borderRadius: 12, height: 60, fontSize: 24, textAlign: 'center', letterSpacing: 10, fontWeight: 'bold' },
  primaryBtn: { backgroundColor: COLORS.primary, width: '100%', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  resendBtn: { marginTop: 20 },
  resendText: { fontSize: 13, color: COLORS.textLight },
});