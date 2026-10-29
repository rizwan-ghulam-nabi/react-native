import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Platform, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useCart } from '../CartContext';

const { width } = Dimensions.get('window');
const API_URL = 'http://192.168.18.80:5000/api/categories';

const COLORS = {
  primary: '#235A32',
  background: '#FFFFFF',
  textDark: '#111111',
  textLight: '#888888',
  lightGreen: '#EBF3EC',
  cardBg: '#F9FCF9',
};

// Default icons for categories (Fallback if DB doesn't have one)
const CATEGORY_ICONS = {
  'Indoor Plants': 'home-outline',
  'Outdoor Plants': 'tree-outline',
  'Watering & Irrigation': 'watering-can-outline',
  'Pots & Planters': 'flower-outline',
  'Gardening Tools': 'scissors-cutting',
  'Home Decor': 'sofa-outline',
  'Soil & Fertilizers': 'seed-outline',
  'Artificial Plants': 'leaf',
};

export default function CategoriesScreen({ navigation }) {
  const { cart } = useCart();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.warn("Error fetching categories:", error);
        Alert.alert("Error", "Could not load categories. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="leaf" size={26} color={COLORS.primary} />
              <Text style={styles.logoText}>
                Green<Text style={styles.logoTextBlack}>Scape</Text>
              </Text>
            </View>
            <Text style={styles.headerTagline}>Grow. Nature. Thrive.</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('SearchTab')}>
              <Feather name="search" size={22} color={COLORS.textDark} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
              <Feather name="shopping-cart" size={22} color={COLORS.textDark} />
              {cart.length > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Categories</Text>
          <Text style={styles.pageSubtitle}>Explore our wide range of plants and gardening essentials</Text>
          <MaterialCommunityIcons name="leaf" size={100} color="#E8F3E9" style={styles.bgLeaf} />
        </View>

        {/* Loading State */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
        ) : (
          <>
            {/* Top Horizontal Scroll (Only shows first 5 categories) */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topCategoriesContainer}>
              
              {/* All Button */}
              <TouchableOpacity 
                style={styles.topCategoryItem}
                onPress={() => navigation.navigate('Products', { 
                  categorySlug: 'all', 
                  categoryName: 'All Products' 
                })}
              >
                <View style={[styles.topCategoryIconBg, { backgroundColor: COLORS.primary }]}>
                  <MaterialCommunityIcons name="leaf" size={26} color={COLORS.white} />
                </View>
                <Text style={[styles.topCategoryText, { color: COLORS.primary, fontWeight: '700' }]}>All</Text>
              </TouchableOpacity>

              {/* Dynamic Categories */}
              {categories.slice(0, 5).map((cat) => (
                <TouchableOpacity 
                  key={cat._id} 
                  style={styles.topCategoryItem}
                  onPress={() => navigation.navigate('Products', { 
                    categorySlug: cat.slug, 
                    categoryName: cat.name 
                  })}
                >
                  <View style={styles.topCategoryIconBg}>
                    <MaterialCommunityIcons 
                      name={CATEGORY_ICONS[cat.name] || 'sprout'} 
                      size={26} 
                      color={COLORS.primary} 
                    />
                  </View>
                  <Text style={styles.topCategoryText} numberOfLines={2}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 2-Column Grid (Shows all categories from DB) */}
            {/* <View style={styles.gridContainer}>
              {categories.map((item) => (
                <TouchableOpacity 
                  key={item._id} 
                  style={styles.gridCard} 
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Products', { 
                    categorySlug: item.slug, 
                    categoryName: item.name 
                  })}
                >
                  <Image source={{ uri: item.image }} style={styles.gridImage} />
                  <View style={styles.gridInfo}>
                    <View style={styles.gridTextContainer}>
                      <Text style={styles.gridTitle} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.gridCount}>{item.products} Products</Text>
                    </View>
                    <TouchableOpacity style={styles.arrowBtn}>
                      <Feather name="arrow-right" size={14} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View> */}

            {/* 2-Column Grid (Shows all categories from DB) */}
            <View style={styles.gridContainer}>
              {categories.map((item) => (
                <TouchableOpacity 
                  key={item._id} 
                  style={styles.gridCard} 
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Products', { 
                    categorySlug: item.slug, 
                    categoryName: item.name 
                  })}
                >
                  <Image source={{ uri: item.image }} style={styles.gridImage} />
                  <View style={styles.gridInfo}>
                    <View style={styles.gridTextContainer}>
                      <Text style={styles.gridTitle} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.gridCount}>{item.products} Products</Text>
                    </View>
                    
                    {/* 👇 Changed from TouchableOpacity to View */}
                    <View style={styles.arrowBtn}>
                      <Feather name="arrow-right" size={14} color={COLORS.white} />
                    </View>
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
                <TouchableOpacity 
                  style={styles.specialBtn}
                  onPress={() => navigation.navigate('Products', { 
                    categorySlug: 'indoor-plants', 
                    categoryName: 'Indoor Plants' 
                  })}
                >
                  <Text style={styles.specialBtnText}>Shop Now →</Text>
                </TouchableOpacity>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=400&auto=format&fit=crop' }} 
                style={styles.specialImage} 
              />
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 15 : 10, paddingBottom: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 24, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  logoTextBlack: { color: COLORS.textDark },
  headerTagline: { fontSize: 10, color: '#A0A0A0', fontWeight: '600', marginLeft: 32, marginTop: -2, letterSpacing: 0.5 },
  headerIcons: { flexDirection: 'row', gap: 15, marginTop: 4 },
  iconBtn: { padding: 5 },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.primary, borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.white },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: 'bold' },
  titleSection: { paddingHorizontal: 20, marginTop: 15, marginBottom: 20, position: 'relative', overflow: 'hidden' },
  pageTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 6 },
  pageSubtitle: { fontSize: 13, color: COLORS.textLight, fontWeight: '400', lineHeight: 18, width: '80%' },
  bgLeaf: { position: 'absolute', right: -20, top: -20, opacity: 0.5, transform: [{ rotate: '45deg' }] },
  topCategoriesContainer: { paddingLeft: 20, paddingRight: 10, gap: 15, paddingBottom: 20 },
  topCategoryItem: { alignItems: 'center', width: 65 },
  topCategoryIconBg: { backgroundColor: COLORS.lightGreen, width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  topCategoryText: { fontSize: 10, textAlign: 'center', color: COLORS.textDark, fontWeight: '600', lineHeight: 14 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  gridCard: { width: (width - 40) / 2, backgroundColor: COLORS.cardBg, borderRadius: 16, marginBottom: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F5F0' },
  gridImage: { width: '100%', height: 120, resizeMode: 'cover' },
  gridInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  gridTextContainer: { flex: 1, paddingRight: 10 },
  gridTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  gridCount: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },
  arrowBtn: { backgroundColor: COLORS.primary, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  specialBanner: { marginHorizontal: 20, marginTop: 10, backgroundColor: '#E6F0E7', borderRadius: 16, flexDirection: 'row', overflow: 'hidden', height: 140, alignItems: 'center' },
  specialContent: { flex: 1, padding: 18, zIndex: 3 },
  specialSubtitle: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  specialTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  specialDesc: { fontSize: 11, color: COLORS.primary, marginBottom: 12, fontWeight: '400' },
  specialBtn: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'flex-start' },
  specialBtnText: { color: COLORS.white, fontSize: 11, fontWeight: 'bold' },
  specialImage: { position: 'absolute', right: -10, bottom: 0, width: 170, height: 140, zIndex: 1, opacity: 0.9 },
});