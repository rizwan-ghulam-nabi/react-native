import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Platform, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2B7A4B',
  textDark: '#111111',
  cardBg: '#FFFFFF',
  iconBg: '#E8F5E9',
  bgColor: '#F8F9F6',
  borderColor: '#F3F4F6',
};

const CATEGORIES = [
  { name: 'Plants',                 icon: 'leaf' },
  { name: 'Seeds & Bulbs',          icon: 'sprout' },
  { name: 'Pots & Planters',        icon: 'flower-outline' },
  { name: 'Gardening Tools',        icon: 'scissors-cutting' },
  { name: 'Watering & Irrigation',  icon: 'waves' },
  { name: 'Fertilizers & Soil',     icon: 'bottle-tonic-outline' },
  { name: 'Outdoor Decor',          icon: 'home-outline' },
  { name: 'Outdoor Care',           icon: 'spray' },
];

const WEB_BASE_URL = 'https://yourdomain.com'; // 🔗 CHANGE THIS

const CARD_WIDTH = 140;
const CARD_GAP = 16;
// 8 cards * 156px = 1248px
const ONE_SET_WIDTH = CATEGORIES.length * (CARD_WIDTH + CARD_GAP);

// Duplicate the list for the infinite loop effect
const DOUBLE_CATEGORIES = [...CATEGORIES, ...CATEGORIES];

export default function ShopByCategory() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: -ONE_SET_WIDTH,
        duration: 20000, // 20 seconds per loop
        easing: Easing.linear,
        // useNativeDriver MUST be false on Web, true on Mobile
        useNativeDriver: Platform.OS !== 'web', 
      })
    ).start();
  }, [animatedValue]);

  const openCategory = (categoryName) => {
    const url = `${WEB_BASE_URL}/products?category=${encodeURIComponent(categoryName)}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <TouchableOpacity
          onPress={() => {
            const url = `${WEB_BASE_URL}/products`;
            Platform.OS === 'web' ? window.open(url, '_blank') : Linking.openURL(url);
          }}
        >
          <Text style={styles.viewAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: '100%', overflow: 'hidden' }}>
        <Animated.View
          style={[
            styles.marqueeRow,
            { transform: [{ translateX: animatedValue }] }
          ]}
        >
          {DOUBLE_CATEGORIES.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => openCategory(cat.name)}
            >
              <View style={styles.iconCircleOuter}>
                <View style={styles.iconCircleInner}>
                  <MaterialCommunityIcons name={cat.icon} size={24} color={COLORS.primary} />
                </View>
              </View>
              <Text style={styles.categoryText} numberOfLines={2}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.bgColor, paddingVertical: 24, marginTop: 15 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 20,
  },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.5 },
  viewAllText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  
  // CRITICAL LAYOUT FIX
  marqueeRow: {
    flexDirection: 'row',
    paddingLeft: 20,
    width: (ONE_SET_WIDTH * 2) + 40, // Forces the row to be wide enough
  },
  
  categoryCard: {
    width: CARD_WIDTH, height: 150, marginRight: CARD_GAP,
    backgroundColor: COLORS.cardBg, borderRadius: 16,
    paddingVertical: 20, paddingHorizontal: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.borderColor,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  iconCircleOuter: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.iconBg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  iconCircleInner: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.cardBg,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  categoryText: {
    fontSize: 13, fontWeight: '500', color: '#374151',
    textAlign: 'center', lineHeight: 18,
  },
});