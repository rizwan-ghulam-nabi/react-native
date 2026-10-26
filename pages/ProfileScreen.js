import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  TextInput, Platform, StatusBar, Dimensions, Alert, ActivityIndicator, Modal 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const API_URL = 'http://192.168.18.80:5000/api/users';

const COLORS = {
  primary: '#235A32', bgColor: '#F8F9F6', white: '#FFFFFF',
  textDark: '#111111', textLight: '#666666', borderColor: '#E5E7EB',
  inputBg: '#F9FAFB', lightGreen: '#E8F5E9', danger: '#D32F2F',
};

const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say'];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout, login } = useAuth(); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const userId = user?._id || '6ac75db705590e499a1990e3'; 

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    country: user?.country || '',
    bio: user?.bio || '',
    gender: user?.gender || 'Prefer not to say',
  });

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const formatMemberSince = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // 👇 WORKING LOGOUT FUNCTION
   const handleLogout = () => {
    // Web browsers often block native alerts, so we use window.confirm
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        performLogout();
      }
    } else {
      Alert.alert("Logout", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: performLogout }
      ]);
    }
  };

  const performLogout = async () => {
    try {
      await logout(); // 1. Clears AsyncStorage & Context
      
      // 2. Force navigation back to the Home screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      if (json.success) {
        login(json.data); 
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", json.error || "Failed to update profile.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, value, icon, field, placeholder) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, isEditing && styles.inputWrapperActive]}>
        <Feather name={icon} size={16} color={COLORS.textLight} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#999"
          editable={isEditing}
          onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          
          <View style={styles.headerBackground}>
            <View style={styles.headerNav}>
              <View style={styles.logoRow}>
                <MaterialCommunityIcons name="leaf" size={24} color={COLORS.white} />
                <Text style={styles.logoText}>GreenScape</Text>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.headerIcon}><Feather name="search" size={20} color={COLORS.white} /></TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon}><Feather name="bell" size={20} color={COLORS.white} /></TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <TouchableOpacity style={styles.cameraIcon}>
                <Feather name="camera" size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Customer</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Feather name="shopping-bag" size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>ORDERS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="star" size={22} color="#FFC107" />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>RATING</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Feather name="user" size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>{formatMemberSince(user.createdAt)}</Text>
              <Text style={styles.statLabel}>MEMBER SINCE</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather name="user" size={20} color={COLORS.primary} />
                <Text style={styles.formTitle}>Personal Details</Text>
              </View>
              
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editBtn}>
                <Feather name={isEditing ? "x" : "edit-2"} size={16} color={COLORS.primary} />
                <Text style={styles.editBtnText}>{isEditing ? "Cancel" : "Edit"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderInput('First Name', formData.firstName, 'user', 'firstName')}
              </View>
              <View style={styles.halfWidth}>
                {renderInput('Last Name', formData.lastName, 'user', 'lastName')}
              </View>
            </View>

            {renderInput('Email Address', user.email, 'mail', 'email')} 

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderInput('Phone Number', formData.phone, 'phone', 'phone')}
              </View>
              <View style={styles.halfWidth}>
                {renderInput('Country / Region', formData.country, 'map-pin', 'country')}
              </View>
            </View>

            {renderInput('About Me', formData.bio, 'file-text', 'bio', 'No bio yet. Click Edit to add one!')}

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Gender</Text>
                <TouchableOpacity 
                  style={[styles.inputWrapper, isEditing && styles.inputWrapperActive]}
                  onPress={() => isEditing && setShowGenderModal(true)}
                  disabled={!isEditing}
                >
                  <Feather name="user" size={16} color={COLORS.textLight} style={styles.inputIcon} />
                  <Text style={[styles.input, { paddingTop: 12 }]}>
                    {formData.gender}
                  </Text>
                  {isEditing && <Feather name="chevron-down" size={16} color={COLORS.textLight} />}
                </TouchableOpacity>
              </View>

              <View style={styles.halfWidth}>
                {renderInput('Preferred Language', 'English', 'globe', 'language')}
              </View>
            </View>

            <View style={styles.securityBanner}>
              <Feather name="lock" size={16} color={COLORS.primary} />
              <Text style={styles.securityText}>Secure your account with a strong password.</Text>
              <Feather name="chevron-right" size={16} color={COLORS.primary} />
            </View>

            {isEditing ? (
              <TouchableOpacity 
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]} 
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color={COLORS.white} /> : (
                  <>
                    <Feather name="save" size={16} color={COLORS.white} />
                    <Text style={styles.primaryBtnText}>Save to Database</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.outlineBtn}>
                <Feather name="lock" size={16} color={COLORS.primary} />
                <Text style={styles.outlineBtnText}>Change Password</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MyOrders')}>
              <View style={styles.menuItemLeft}>
                <Feather name="package" size={20} color={COLORS.primary} />
                <Text style={styles.menuItemText}>My Orders</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Wishlist')}>
              <View style={styles.menuItemLeft}>
                <Feather name="heart" size={20} color={COLORS.primary} />
                <Text style={styles.menuItemText}>Wishlist</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <Feather name="log-out" size={20} color={COLORS.danger} />
                <Text style={[styles.menuItemText, { color: COLORS.danger }]}>Logout</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <Modal visible={showGenderModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                <Feather name="x" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity 
                key={option} 
                style={styles.modalOption}
                onPress={() => {
                  setFormData({ ...formData, gender: option });
                  setShowGenderModal(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  formData.gender === option && { color: COLORS.primary, fontWeight: 'bold' }
                ]}>
                  {option}
                </Text>
                {formData.gender === option && <Feather name="check" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  // ... (Keep all your existing styles)
  container: { flex: 1, backgroundColor: COLORS.bgColor },
  scrollContent: { flexGrow: 1 },
  contentWrapper: { maxWidth: isWeb ? 800 : '100%', alignSelf: 'center', width: '100%' },
  headerBackground: { backgroundColor: COLORS.primary, paddingTop: isWeb ? 20 : (Platform.OS === 'android' ? 40 : 50), paddingBottom: 80, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, width: '100%' },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  headerIcons: { flexDirection: 'row', gap: 15 },
  headerIcon: { padding: 5 },
  userCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginTop: 10, marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, alignItems: 'center' },
  avatarContainer: { position: 'relative', marginRight: 15 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.white },
  avatarText: { color: COLORS.white, fontSize: 24, fontWeight: 'bold' },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.textDark, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginBottom: 2 },
  userEmail: { fontSize: 12, color: COLORS.textLight, marginBottom: 10 },
  badge: { backgroundColor: COLORS.lightGreen, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  statsCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16, paddingVertical: 15, marginTop: 10, alignItems: 'center', marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginVertical: 4 },
  statLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase' },
  statDivider: { width: 1, height: 45, backgroundColor: COLORS.borderColor },
  formCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginTop: 10, marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  formTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.lightGreen, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  editBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  halfWidth: { flex: 1 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderWidth: 1, borderColor: COLORS.borderColor, borderRadius: 10, height: 45, paddingHorizontal: 12 },
  inputWrapperActive: { borderColor: COLORS.primary, backgroundColor: COLORS.white },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 13, color: COLORS.textDark },
  securityBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 12, borderRadius: 8, marginBottom: 12, gap: 10 },
  securityText: { flex: 1, fontSize: 12, color: COLORS.primary, fontWeight: '500' },
  primaryBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', gap: 8, height: 45, borderRadius: 10 },
  primaryBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  outlineBtn: { flexDirection: 'row', backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', gap: 8, height: 45, borderRadius: 10, borderWidth: 1, borderColor: COLORS.primary },
  outlineBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
  menuCard: { backgroundColor: COLORS.white, borderRadius: 16, marginTop: 15, marginHorizontal: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  menuItemText: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalOptionText: { fontSize: 16, color: COLORS.textDark },
});