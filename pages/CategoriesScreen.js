import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useCart } from '../CartContext'; // Import useCart to get cart count

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#235A32',
  background: '#FFFFFF',
  textDark: '#111111',
  textLight: '#888888',
  lightGreen: '#EBF3EC',
  cardBg: '#F9FCF9',
};

const topCategories = [
  { id: '1', name: 'All', icon: 'leaf', active: true },
  { id: '2', name: 'Indoor\nPlants', icon: 'home-outline', active: false },
  { id: '3', name: 'Outdoor\nPlants', icon: 'tree-outline', active: false },
  { id: '4', name: 'Watering &\nIrrigation', icon: 'watering-can-outline', active: false },
  { id: '5', name: 'Pots &\nPlanters', icon: 'flower-outline', active: false },
  { id: '6', name: 'Gardening\nTools', icon: 'scissors-cutting', active: false },
];

const gridCategories = [
  { id: '1', title: 'Indoor Plants', count: '124 Products', img: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?q=80&w=400&auto=format&fit=crop' },
  { id: '2', title: 'Outdoor Plants', count: '96 Products', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400&auto=format&fit=crop' },
  { id: '3', title: 'Watering & Irrigation', count: '48 Products', img: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=400&auto=format&fit=crop' },
  { id: '4', title: 'Pots & Planters', count: '72 Products', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=400&auto=format&fit=crop' },
  { id: '5', title: 'Gardening Tools', count: '54 Products', img: 'https://images.unsplash.com/photo-1416879598555-220b85293297?q=80&w=400&auto=format&fit=crop' },
  { id: '6', title: 'Plant Care', count: '38 Products', img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=400&auto=format&fit=crop' },
];

export default function CategoriesScreen({ navigation }) {
  // Get cart length from global context
  const { cart } = useCart();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header with Left-Aligned Logo and Tagline */}
        <View style={styles.header}>
          <View>
            {/* Split Color Logo Text */}
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="leaf" size={26} color={COLORS.primary} />
              <Text style={styles.logoText}>
                Green<Text style={styles.logoTextBlack}>Scape</Text>
              </Text>
            </View>
            {/* Tagline directly under the logo */}
            <Text style={styles.headerTagline}>Grow. Nature. Thrive.</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="search" size={22} color={COLORS.textDark} />
            </TouchableOpacity>
            
            {/* Cart Icon Redirects to Cart Tab */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
              <Feather name="shopping-cart" size={22} color={COLORS.textDark} />
              {cart.length > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Section with Background Leaf Graphic */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Categories</Text>
          <Text style={styles.pageSubtitle}>Explore our wide range of plants and gardening essentials</Text>
          <MaterialCommunityIcons name="leaf" size={100} color="#E8F3E9" style={styles.bgLeaf} />
        </View>

        {/* Top Horizontal Scroll Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topCategoriesContainer}>
          {topCategories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.topCategoryItem}>
              <View style={[styles.topCategoryIconBg, cat.active && styles.topCategoryIconActive]}>
                <MaterialCommunityIcons 
                  name={cat.icon} 
                  size={26} 
                  color={cat.active ? COLORS.white : COLORS.primary} 
                />
              </View>
              <Text style={[styles.topCategoryText, cat.active && styles.topCategoryTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 2-Column Grid */}
        <View style={styles.gridContainer}>
          {gridCategories.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridCard} activeOpacity={0.8}>
              <Image source={{ uri: item.img }} style={styles.gridImage} />
              <View style={styles.gridInfo}>
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.gridCount}>{item.count}</Text>
                </View>
                <TouchableOpacity style={styles.arrowBtn}>
                  <Feather name="arrow-right" size={14} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Special Collection Banner */}
        <View style={styles.specialBanner}>
          <View style={styles.specialContent}>
            <Text style={styles.specialSubtitle}>Special Collection ✳</Text>
            <Text style={styles.specialTitle}>Indoor Plants</Text>
            <Text style={styles.specialDesc}>Fresh greens for a healthier home</Text>
            <TouchableOpacity style={styles.specialBtn}>
              <Text style={styles.specialBtnText}>Shop Now →</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=400&auto=format&fit=crop' }} 
            style={styles.specialImage} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: 100 },

  // Header Styles (Matching Home Page)
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 15 : 10, paddingBottom: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 24, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  logoTextBlack: { color: COLORS.textDark },
  headerTagline: { fontSize: 10, color: '#A0A0A0', fontWeight: '600', marginLeft: 32, marginTop: -2, letterSpacing: 0.5 },
  
  headerIcons: { flexDirection: 'row', gap: 15, marginTop: 4 },
  iconBtn: { padding: 5 },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.primary, borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.white },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: 'bold' },

  // Title Section
  titleSection: { paddingHorizontal: 20, marginTop: 15, marginBottom: 20, position: 'relative', overflow: 'hidden' },
  pageTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 6 },
  pageSubtitle: { fontSize: 13, color: COLORS.textLight, fontWeight: '400', lineHeight: 18, width: '80%' },
  bgLeaf: { position: 'absolute', right: -20, top: -20, opacity: 0.5, transform: [{ rotate: '45deg' }] },

  // Top Categories
  topCategoriesContainer: { paddingLeft: 20, paddingRight: 10, gap: 15, paddingBottom: 20 },
  topCategoryItem: { alignItems: 'center', width: 65 },
  topCategoryIconBg: { backgroundColor: COLORS.lightGreen, width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  topCategoryIconActive: { backgroundColor: COLORS.primary },
  topCategoryText: { fontSize: 10, textAlign: 'center', color: COLORS.textDark, fontWeight: '600', lineHeight: 14 },
  topCategoryTextActive: { color: COLORS.primary, fontWeight: '700' },

  // Grid Layout
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  gridCard: { 
    width: (width - 40) / 2, 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 16, 
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F5F0',
  },
  gridImage: { width: '100%', height: 120, resizeMode: 'cover' },
  gridInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  gridTextContainer: { flex: 1, paddingRight: 10 },
  gridTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  gridCount: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },
  arrowBtn: { backgroundColor: COLORS.primary, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  // Special Collection Banner
  specialBanner: { marginHorizontal: 20, marginTop: 10, backgroundColor: '#E6F0E7', borderRadius: 16, flexDirection: 'row', overflow: 'hidden', height: 140, alignItems: 'center' },
  specialContent: { flex: 1, padding: 18, zIndex: 3 },
  specialSubtitle: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  specialTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  specialDesc: { fontSize: 11, color: COLORS.primary, marginBottom: 12, fontWeight: '400' },
  specialBtn: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'flex-start' },
  specialBtnText: { color: COLORS.white, fontSize: 11, fontWeight: 'bold' },
  specialImage: { position: 'absolute', right: -10, bottom: 0, width: 170, height: 140, zIndex: 1, opacity: 0.9 },
});