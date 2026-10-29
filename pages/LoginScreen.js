import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons, Feather, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = { primary: '#235A32', white: '#FFFFFF', textDark: '#111111', textLight: '#666666', borderColor: '#E8E8E8', bg: '#F7F9F5' };
const API_URL = 'http://192.168.18.80:5000/api/auth/login'; // 👈 Your backend login route

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 👈 Added loading state
  
  const { login } = useAuth(); 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // 👈 1. Call the real backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // 👈 2. Save the REAL JWT token to AsyncStorage
        // Note: Make sure your backend returns { token: "..." } or { accessToken: "..." }
        const token = data.token || data.accessToken; 
        
        await AsyncStorage.setItem('@user_token', token); 
        console.log("✅ REAL TOKEN SAVED:", token); // 👈 ADD THIS LINE
        // 👈 3. Save user details to AuthContext
        login(data.user); 
        
        // 4. Navigate to Home
        navigation.navigate('MainTabs', { screen: 'Home' }); 
      } else {
        // Alert.alert("Login Failed", data.message || "Invalid email or password");
        Alert.alert("Login Failed", data.error || data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Top Decorative Area */}
          <View style={styles.topSection}>
            <MaterialCommunityIcons name="leaf" size={60} color={COLORS.primary} style={{ alignSelf: 'center' }} />
            <Text style={styles.brandTitle}>Green<Text style={{color: COLORS.textDark}}>Scape</Text></Text>
            <Text style={styles.brandSub}>Bring Nature Home</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSub}>Sign in to your account and continue your green journey.</Text>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color={COLORS.textLight} style={styles.inputIcon} />
              <TextInput 
                placeholder="Email Address" 
                style={styles.input} 
                placeholderTextColor={COLORS.textLight} 
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password Input with Eye Toggle */}
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color={COLORS.textLight} style={styles.inputIcon} />
              <TextInput 
                placeholder="Password" 
                secureTextEntry={!showPassword} 
                style={styles.input} 
                placeholderTextColor={COLORS.textLight} 
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.rowBetween}>
              <TouchableOpacity style={styles.row}>
                <MaterialCommunityIcons name="checkbox-marked" size={20} color={COLORS.primary} />
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Sign In</Text>
                  <Feather name="arrow-right" size={20} color={COLORS.white} />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <AntDesign name="google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome name="apple" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome name="facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={[styles.row, { justifyContent: 'center', marginTop: 30 }]}>
              <Text style={styles.bottomText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.bottomLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ... Keep your exact same styles from before ...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 40 },
  topSection: { paddingTop: 40, paddingBottom: 20, alignItems: 'center' },
  brandTitle: { fontSize: 32, fontWeight: '800', color: COLORS.primary, marginTop: 10 },
  brandSub: { fontSize: 14, color: COLORS.textLight, fontWeight: '500', marginTop: 4 },
  
  formContainer: { paddingHorizontal: 25, marginTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 8 },
  headerSub: { fontSize: 14, color: COLORS.textLight, marginBottom: 30, lineHeight: 20 },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 15, borderWidth: 1, borderColor: COLORS.borderColor },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textDark },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rememberText: { marginLeft: 8, fontSize: 13, color: COLORS.textLight },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  primaryBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 55, borderRadius: 12, gap: 10 },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.borderColor },
  dividerText: { marginHorizontal: 10, color: COLORS.textLight, fontSize: 13 },

  socialRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  socialBtn: { flex: 1, height: 55, backgroundColor: COLORS.white, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.borderColor },
  
  bottomText: { color: COLORS.textLight, fontSize: 14 },
  bottomLink: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
});