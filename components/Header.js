import React from 'react';
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, Platform
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext'; // 👈 Import Auth Context

const COLORS = {
  primary: '#235A32', textDark: '#111111', textLight: '#888888',
  lightGreen: '#F3F9F4', white: '#FFFFFF'
};

export default function Header({
  cartCount = 0,
  searchQuery = '',
  setSearchQuery = () => {}
}) {
  const navigation = useNavigation();
  const { user } = useAuth(); // 👈 Get user state from Context

  // Generate initials if user is logged in (e.g., "RS")
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : null;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>

        <View style={styles.logoContainer}>
          <View style={styles.logoTextRow}>
            <MaterialCommunityIcons name="leaf" size={26} color={COLORS.primary} />
            <Text style={styles.logoText}>
              Green<Text style={styles.logoTextBlack}>Scape</Text>
            </Text>
          </View>
          <Text style={styles.tagline}>Plants • Decor • A Greener Tomorrow</Text>
        </View>

        <View style={styles.iconsContainer}>
          {/* Cart Button */}
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color={COLORS.textDark} />
            {cartCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{String(cartCount)}</Text>
              </View>
            ) : null}
          </TouchableOpacity>

          {/* Profile Button (Dynamic based on login state) */}
          <TouchableOpacity 
            style={styles.profileBtn} 
            onPress={() => {
              if (user) {
                navigation.navigate('MainTabs', { screen: 'ProfileTab' });
              } else {
                navigation.navigate('Login'); // Send to login if not authenticated
              }
            }}
          >
            {user ? (
              <Text style={styles.avatarInitials}>{initials}</Text> 
            ) : (
              <Feather name="user" size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>

      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            placeholder="Search for plants, pots, tools..."
            placeholderTextColor={COLORS.textLight}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            underlineColorAndroid="transparent"
            autoCorrect={false}
          />
          {searchQuery && searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoContainer: { justifyContent: 'center' },
  logoTextRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 24, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  logoTextBlack: { color: COLORS.textDark },
  tagline: { fontSize: 10, color: COLORS.textLight, fontWeight: '500', marginTop: 2, marginLeft: 2 },

  iconsContainer: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 4, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.primary, borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.white },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: 'bold' },
  
  // 👇 Updated Profile Button Styles
  profileBtn: { 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    backgroundColor: COLORS.lightGreen, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  searchWrapper: { paddingHorizontal: 20, paddingBottom: 15, paddingTop: 5 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9F7',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  searchIcon: { marginRight: 12 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    height: '100%',
    borderWidth: 0,
    outlineStyle: 'none',
  },
});