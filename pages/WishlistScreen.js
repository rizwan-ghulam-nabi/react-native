import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, SafeAreaView, StatusBar, Platform 
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useCart } from '../CartContext'; // <-- IMPORT GLOBAL STATE

const COLORS = {
  primary: '#235A32',
  background: '#FFFFFF',
  textDark: '#111111',
  textLight: '#888888',
  lightGreen: '#EBF3EC',
  cardBg: '#F9FCF9',
};

export default function WishlistScreen({ navigation }) {
  // Pull the real wishlist from Context instead of using hardcoded items
  const { wishlist, toggleWishlist, addToCart } = useCart();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="leaf" size={28} color={COLORS.primary} style={{ transform: [{ rotate: '-15deg' }] }} />
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.logoText}>GreenScape</Text>
              <Text style={styles.tagline}>Bring Nature Home</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color={COLORS.textDark} />
            <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
          </TouchableOpacity>
        </View>

        {/* Page Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>My Wishlist</Text>
          <Text style={styles.pageSubtitle}>{wishlist.length} items saved for later</Text>
        </View>

        {/* Empty State (If wishlist is empty) */}
        {wishlist.length === 0 ? (
          <View style={styles.bottomMessage}>
            <MaterialCommunityIcons name="heart-outline" size={60} color={COLORS.textLight} opacity={0.5} />
            <Text style={styles.bottomText}>Your wishlist is empty.</Text>
            <TouchableOpacity style={styles.goShopBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.goShopText}>Go Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Wishlist Items */
          <View style={styles.listContainer}>
            {wishlist.map((item) => (
              <View key={item.id} style={styles.card}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.img }} style={styles.image} />
                </View>

                {/* Product Details */}
                <View style={styles.detailsContainer}>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productType}>{item.type}</Text>
                  <Text style={styles.price}>{item.price}</Text>
                </View>

                {/* Actions (Cart & Remove) */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => toggleWishlist(item)}>
                    <Feather name="trash-2" size={18} color="#FF5252" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(item)}>
                    <Feather name="shopping-bag" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: 100 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 15 : 10, paddingBottom: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  tagline: { fontSize: 9, color: COLORS.textLight, fontWeight: '500', marginTop: -2 },
  iconBtn: { padding: 5 },
  badge: { position: 'absolute', top: 2, right: 2, backgroundColor: COLORS.primary, borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.white },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: 'bold' },

  titleSection: { paddingHorizontal: 20, marginTop: 20, marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: COLORS.textLight, fontWeight: '500' },

  listContainer: { paddingHorizontal: 20, gap: 15 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#F0F0F0',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  
  imageContainer: { 
    width: 80, 
    height: 80, 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15,
  },
  image: { width: '80%', height: '80%', resizeMode: 'contain' },

  detailsContainer: { flex: 1, justifyContent: 'center' },
  productName: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  productType: { fontSize: 12, color: COLORS.textLight, marginBottom: 8 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.primary },

  actionsContainer: { justifyContent: 'space-between', height: 80, alignItems: 'flex-end', paddingVertical: 4 },
  removeBtn: { padding: 4 },
  cartBtn: { 
    backgroundColor: COLORS.primary, 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  bottomMessage: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  bottomText: { fontSize: 15, color: COLORS.textLight, textAlign: 'center', marginTop: 15, marginBottom: 20, lineHeight: 20 },
  goShopBtn: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25 },
  goShopText: { color: COLORS.white, fontSize: 14, fontWeight: 'bold' },
});