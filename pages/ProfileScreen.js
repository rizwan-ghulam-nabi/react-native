import React from 'react';
import { 
  StyleSheet, Text, View, Image, TouchableOpacity, 
  ScrollView, SafeAreaView, StatusBar, Platform, Dimensions 
} from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

const COLORS = { primary: '#235A32', primaryLight: '#2E7D32', white: '#FFFFFF', textDark: '#111111', textLight: '#666666', borderColor: '#E8E8E8', bg: '#FAFAFA' };
const { width } = Dimensions.get('window');

const MenuItem = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconBg}>
      <Feather name={icon} size={20} color={COLORS.primary} />
    </View>
    <View style={styles.menuTextContainer}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <Feather name="chevron-right" size={20} color={COLORS.borderColor} />
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Curved Green Header */}
        <View style={styles.topHeader}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitleText}>My Profile</Text>
            <TouchableOpacity>
              <Feather name="settings" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.curve}>
          {/* Avatar overlapping the curve */}
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraBtn}>
              <Feather name="camera" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>Rizwan Sheikh</Text>
          <Text style={styles.userEmail}>rizwan@example.com</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Feather name="shopping-bag" size={22} color={COLORS.primary} />
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Feather name="map-pin" size={22} color={COLORS.primary} />
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Feather name="heart" size={22} color={COLORS.primary} />
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          <MenuItem icon="user" title="Edit Profile" subtitle="Update your personal information" />
          <MenuItem icon="map-pin" title="My Addresses" subtitle="Manage your shipping addresses" />
          <MenuItem icon="box" title="Order History" subtitle="View your past orders" />
          <MenuItem icon="heart" title="My Wishlist" subtitle="View saved items" onPress={() => navigation.navigate('Wishlist')} />
          <MenuItem icon="bell" title="Notifications" subtitle="Manage your notifications" />
          <MenuItem icon="headphones" title="Help & Support" subtitle="Get help or contact us" />
          <MenuItem icon="file-text" title="Refund Policy" subtitle="Read our refund policy" />
          <MenuItem icon="log-out" title="Log Out" subtitle="Sign out from your account" onPress={() => navigation.navigate('Login')} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  
  topHeader: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitleText: { fontSize: 22, fontWeight: '700', color: COLORS.white },

  curve: { backgroundColor: COLORS.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40, alignItems: 'center', paddingTop: 0 },
  avatarContainer: { marginTop: -50, marginBottom: 15, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: COLORS.white },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  
  userName: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  userEmail: { fontSize: 14, color: COLORS.textLight, marginBottom: 25 },

  statsContainer: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 16, paddingVertical: 20, borderWidth: 1, borderColor: COLORS.borderColor, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 20 },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: COLORS.borderColor, height: '80%', alignSelf: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginTop: 8 },
  statLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },

  menuContainer: { backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.borderColor, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F7F9F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  menuSubtitle: { fontSize: 12, color: COLORS.textLight },
});