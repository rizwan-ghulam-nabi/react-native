import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, StatusBar, ScrollView, Platform, KeyboardAvoidingView, Alert, ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const COLORS = { primary: '#235A32', white: '#FFFFFF', textDark: '#111111', textLight: '#666666', borderColor: '#E8E8E8', bg: '#F7F9F5' };
const API_URL = 'http://192.168.18.80:5000/api/auth/register';

export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !phone) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          password, 
          phone,
          country: 'PK'
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 👈 THIS IS THE FIX: Go to Verification Screen instead of going back
        navigation.navigate('Verification', { email: email });
      } else {
        Alert.alert("Registration Failed", data.error || "Something went wrong.");
      }
    } catch (error) {
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
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Feather name="arrow-left" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.topSection}>
            <MaterialCommunityIcons name="leaf" size={50} color={COLORS.primary} style={{ alignSelf: 'center', marginBottom: 10 }} />
            <Text style={styles.brandTitle}>Green<Text style={{color: COLORS.textDark}}>Scape</Text></Text>
            <Text style={styles.brandSub}>Grow a Greener Tomorrow</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.headerTitle}>Create Your Account</Text>
            <Text style={styles.headerSub}>Join GreenScape and start your plant journey today.</Text>

            <CustomInput icon="user" label="First Name *" placeholder="Enter your first name" value={firstName} onChangeText={setFirstName} />
            <CustomInput icon="user" label="Last Name *" placeholder="Enter your last name" value={lastName} onChangeText={setLastName} />
            <CustomInput icon="mail" label="Email Address *" placeholder="Enter your email address" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            <CustomInput icon="phone" label="Phone Number *" placeholder="Enter your phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            <CustomInput icon="lock" label="Password *" placeholder="Create a strong password" isPassword value={password} onChangeText={setPassword} />
            <CustomInput icon="lock" label="Confirm Password *" placeholder="Confirm your password" isPassword value={confirmPassword} onChangeText={setConfirmPassword} />

            <TouchableOpacity style={styles.termsRow}>
              <MaterialCommunityIcons name="checkbox-marked" size={20} color={COLORS.primary} />
              <Text style={styles.termsText}>I agree to the <Text style={{color: COLORS.primary}}>Terms & Conditions</Text> and <Text style={{color: COLORS.primary}}>Privacy Policy</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Create Account</Text>
                  <Feather name="arrow-right" size={20} color={COLORS.white} />
                </>
              )}
            </TouchableOpacity>

            <View style={[styles.row, { justifyContent: 'center', marginTop: 25 }]}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.bottomLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const CustomInput = ({ icon, label, placeholder, isPassword, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Feather name={icon} size={20} color={COLORS.textLight} style={styles.inputIcon} />
        <TextInput placeholder={placeholder} style={styles.input} placeholderTextColor="#A0A0A0" secureTextEntry={isPassword && !showPassword} {...props} />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 20 : 10 },
  backBtn: { padding: 5, alignSelf: 'flex-start' },
  topSection: { paddingTop: 10, paddingBottom: 30, alignItems: 'center' },
  brandTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primary },
  brandSub: { fontSize: 13, color: COLORS.textLight, fontWeight: '500', marginTop: 4 },
  formContainer: { paddingHorizontal: 25 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.primary, marginBottom: 6 },
  headerSub: { fontSize: 14, color: COLORS.textLight, marginBottom: 25 },
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textDark, marginBottom: 6, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: COLORS.borderColor },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: COLORS.textDark },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 25, paddingRight: 20 },
  termsText: { marginLeft: 8, fontSize: 13, color: COLORS.textLight, lineHeight: 18 },
  primaryBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 55, borderRadius: 12, gap: 10 },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center' },
  bottomText: { color: COLORS.textLight, fontSize: 14 },
  bottomLink: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
});