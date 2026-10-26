import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  TextInput, Platform, StatusBar, Dimensions, Alert 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const COLORS = {
  primary: '#235A32',
  bgColor: '#F8F9F6',
  white: '#FFFFFF',
  textDark: '#111111',
  textLight: '#666666',
  borderColor: '#E5E7EB',
  inputBg: '#F9FAFB',
  lightGreen: '#E8F5E9',
  danger: '#D32F2F',
};

export default function ProfileView() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => {
            logout();
            navigation.navigate('MainTabs', { screen: 'Home' });
        }}
      ]
    );
  };

  const renderInput = (label, value, icon, placeholder) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Feather name={icon} size={16} color={COLORS.textLight} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#999"
          editable={false} 
        />
      </View>
    </View>
  );

  const renderMenuItem = (title, icon, isDanger = false, onPress) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Feather name={icon} size={20} color={isDanger ? COLORS.danger : COLORS.primary} />
        <Text style={[styles.menuItemText, isDanger && { color: COLORS.danger }]}>{title}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* 🟢 Top Green Header Background - No Z-Index, just sits at the bottom */}
      <View style={styles.headerBackground}>
        <View style={styles.headerNav}>
          <View style={styles.logoRow}>
            <MaterialCommunityIcons name="leaf" size={24} color={COLORS.white} />
            <Text style={styles.logoText}>GreenScape</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}><Feather name="search" size={20} color={COLORS.white} /></TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}><Feather name="bell" size={20} color={COLORS.white} /></TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}><Feather name="settings" size={20} color={COLORS.white} /></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 👇 THE FIX: ScrollView has zIndex: 100 so it paints ON TOP of the header */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollViewStyle} 
      >
        <View style={styles.contentWrapper}>
          
          {/* 👤 User Info Card - Margin top pulls it up into the green area */}
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

          {/* 📊 Stats Row */}
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
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>MEMBER SINCE</Text>
            </View>
          </View>

          {/* 📝 Personal Details Form */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Feather name="user" size={20} color={COLORS.primary} />
              <Text style={styles.formTitle}>Personal Details</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderInput('First Name', user.firstName, 'user')}
              </View>
              <View style={styles.halfWidth}>
                {renderInput('Last Name', user.lastName, 'user')}
              </View>
            </View>

            {renderInput('Email Address', user.email, 'mail')}

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderInput('Phone Number', user.phone || 'Not set', 'phone')}
              </View>
              <View style={styles.halfWidth}>
                {renderInput('Country / Region', user.country || 'PK', 'map-pin')}
              </View>
            </View>

            {renderInput('About Me', user.bio, 'file-text', 'No bio yet. Click Edit to add one!')}

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderInput('Gender', user.gender || 'Prefer not to say', 'user')}
              </View>
              <View style={styles.halfWidth}>
                {renderInput('Preferred Language', 'English', 'globe')}
              </View>
            </View>

            <View style={styles.securityBanner}>
              <Feather name="lock" size={16} color={COLORS.primary} />
              <Text style={styles.securityText}>Secure your account with a strong password.</Text>
              <Feather name="chevron-right" size={16} color={COLORS.primary} />
            </View>

            <TouchableOpacity style={styles.changePasswordBtn}>
              <Feather name="edit" size={16} color={COLORS.white} />
              <Text style={styles.changePasswordText}>Change Password</Text>
            </TouchableOpacity>
          </View>

          {/* 🔗 Links Menu */}
          <View style={styles.menuCard}>
            {renderMenuItem('My Orders', 'package')}
            {renderMenuItem('Wishlist', 'heart', false, () => navigation.navigate('Wishlist'))}
            {renderMenuItem('Address Book', 'map-pin')}
            {renderMenuItem('Logout', 'log-out', true, handleLogout)}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.bgColor,
  },
  
  // Header - Just the top portion
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: isWeb ? 180 : 200, 
    backgroundColor: COLORS.primary,
    paddingTop: isWeb ? 20 : (Platform.OS === 'android' ? 40 : 50), 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // No zIndex needed here!
  },
  headerNav: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    marginTop: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  headerIcons: { flexDirection: 'row', gap: 15 },
  headerIcon: { padding: 5 },

  // ScrollView - It sits ON TOP of the header
  scrollViewStyle: {
    flex: 1,
    zIndex: 100, // 👈 THIS IS THE MAGIC FIX. It ensures the whole scrollview is above the header.
  },
  scrollContent: { 
    flexGrow: 1,
  },
  
  // Content Wrapper
  contentWrapper: {
    paddingHorizontal: 20,
    maxWidth: isWeb ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
    paddingTop: isWeb ? 120 : 140, // 👈 Pushes the content down into the green area
  },

  // User Card
  userCard: {
    flexDirection: 'row', 
    backgroundColor: COLORS.white,
    borderRadius: 16, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 5,
    alignItems: 'center',
  },
  avatarContainer: { position: 'relative', marginRight: 15 },
  avatarCircle: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: COLORS.white,
  },
  avatarText: { color: COLORS.white, fontSize: 24, fontWeight: 'bold' },
  cameraIcon: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: COLORS.textDark, width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginBottom: 2 },
  userEmail: { fontSize: 12, color: COLORS.textLight, marginBottom: 8 },
  badge: { backgroundColor: COLORS.lightGreen, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },

  // Stats
  statsCard: {
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: 16,
    paddingVertical: 15, 
    marginTop: 15, 
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginVertical: 4 },
  statLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase' },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.borderColor },

  // Form
  formCard: {
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 20, 
    marginTop: 15,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2,
  },
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  formTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  halfWidth: { flex: 1 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg,
    borderWidth: 1, borderColor: COLORS.borderColor, borderRadius: 10, height: 45,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 13, color: COLORS.textDark },
  
  securityBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9',
    padding: 12, borderRadius: 8, marginBottom: 15, gap: 10,
  },
  securityText: { flex: 1, fontSize: 12, color: COLORS.primary, fontWeight: '500' },
  
  changePasswordBtn: {
    flexDirection: 'row', backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', gap: 8,
    height: 45, borderRadius: 10,
  },
  changePasswordText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },

  // Menu
  menuCard: {
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    marginTop: 15,
    overflow: 'hidden',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  menuItemText: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
});