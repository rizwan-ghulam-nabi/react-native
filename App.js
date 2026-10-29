import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, Animated, 
  TextInput, TouchableOpacity, SafeAreaView, StatusBar, 
  Dimensions, Platform, ActivityIndicator, Keyboard 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components & Pages
import HeroCarousel from './components/HeroCarousel';
import CategoriesScreen from './pages/CategoriesScreen';
import CartScreen from './pages/CartScreen';
import ProfileScreen from './pages/ProfileScreen';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import { CartProvider, useCart } from './CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import ShopByCategory from './components/ShopByCategory'; 
import TrustBadges from './components/TrustBadges';
import HeroBanner from './components/HeroBanner';
import SpecialOffers from './components/SpecialOffers';
import WhyGardenersLove from './components/WhyGardenersLove';
import GardeningTips from './components/GardeningTips'; 
import TipDetailsScreen from './pages/TipDetailsScreen'; 
import AllTipsScreen from './pages/AllTipsScreen'; 
import BrandScroller from './components/BrandScroller.js';
import JoinCommunity from './components/JoinCommunity.js';
import AppFooter from './components/AppFooter.js';
import PolicyScreen from './pages/PolicyScreen';
import MyOrdersScreen from './pages/MyOrdersScreen';
import WishlistScreen from './pages/WishlistScreen';
import SearchScreen from './pages/SearchScreen';
import ProductsScreen from './pages/ProductsScreen';
import CheckoutScreen from './pages/CheckoutScreen';
import AddressScreen from './pages/AddressScreen';
import VerificationScreen from './pages/VerificationScreen';


const { width } = Dimensions.get('window');
const API_URL = 'http://192.168.18.80:5000/api/products/bestsellers'; 

const COLORS = {
  primary: '#235A32', 
  background: '#FFFFFF', 
  white: '#FFFFFF',
  textDark: '#111111', 
  textLight: '#888888', 
  lightGreen: '#F3F9F4', 
  borderColor: '#EBEBEB',
};

// ==========================================
// 1. HOME SCREEN
// ==========================================
const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const { wishlist, cart, toggleWishlist, addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const formattedData = data.map(item => ({
          id: item._id,
          name: item.name,
          type: item.category || 'Indoor Plant',
          price: item.price, 
          oldPrice: item.oldPrice, 
          img: item.image,
          rating: 4.5,
          reviews: 124
        }));
        setProducts(formattedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <Header 
        cartCount={cart.length} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        <HeroCarousel />
        <TrustBadges />
        <HeroBanner />
        <ShopByCategory scrollY={scrollY} />

        <View style={styles.midBannerWrapper}>
          <View style={styles.midBanner}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=600&auto=format&fit=crop' }} style={styles.midBannerImage} />
            <View style={styles.midBannerOverlay} />
            <View style={styles.midBannerContent}>
              <Text style={styles.midBannerTitle}>Perfect Plants{'\n'}for Every Space</Text>
              <Text style={styles.midBannerDesc}>Indoor, outdoor, vertical or balcony —{'\n'}find the right plants for your lifestyle.</Text>
              <TouchableOpacity style={styles.midBannerBtn}>
                <Text style={styles.midBannerBtnText}>Explore Collection →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop Best Sellers</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All  ›</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsContainer}>
            {products.map((prod, index) => (
              <TouchableOpacity key={prod.id} style={styles.productCard} activeOpacity={0.9} onPress={() => addToCart(prod)}>
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: prod.img }} style={styles.productImage} />
                  
                  <View style={[styles.productBadge, index === 0 ? styles.badgeBestSeller : index === 1 ? styles.badgeNew : styles.badgeSale]}>
                    <Text style={styles.productBadgeText}>{index === 0 ? 'Best Seller' : index === 1 ? 'New' : 'Sale'}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.wishlistBtn} onPress={() => toggleWishlist(prod)}>
                    <Feather name="heart" size={16} color={isInWishlist(prod.id) ? '#D32F2F' : COLORS.textDark} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{prod.name}</Text>
                  <Text style={styles.productType} numberOfLines={1}>{prod.type} • Low Maintenance</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>Rs. {prod.price.toLocaleString()}</Text>
                    {prod.oldPrice && <Text style={styles.oldPrice}>Rs. {prod.oldPrice.toLocaleString()}</Text>}
                  </View>
                  
                  <View style={styles.ratingRow}>
                    <MaterialCommunityIcons name="star" size={12} color="#FFC107" />
                    <MaterialCommunityIcons name="star" size={12} color="#FFC107" />
                    <MaterialCommunityIcons name="star" size={12} color="#FFC107" />
                    <MaterialCommunityIcons name="star" size={12} color="#FFC107" />
                    <MaterialCommunityIcons name="star-half-full" size={12} color="#FFC107" />
                    <Text style={styles.ratingText}>({prod.reviews})</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <GardeningTips navigation={navigation} />
        <SpecialOffers navigation={navigation} />
        <WhyGardenersLove />
        <BrandScroller /> 
        <JoinCommunity />
        <AppFooter navigation={navigation} /> 
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// 2. GUEST & PROFILE TABS
// ==========================================
const GuestProfileScreen = ({ navigation }) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.guestContainer}>
      <View style={styles.guestIconBg}>
        <MaterialCommunityIcons name="leaf" size={50} color={COLORS.primary} />
      </View>
      <Text style={styles.guestTitle}>Welcome to GreenScape</Text>
      <Text style={styles.guestSubtitle}>Sign in to view your profile, track orders, and manage your wishlist.</Text>
      
      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginBtnText}>Sign In</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupBtnText}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const ProfileTabScreen = ({ navigation }) => {
  const { user } = useAuth(); 
  return user ? <ProfileScreen navigation={navigation} /> : <GuestProfileScreen navigation={navigation} />;
};

// ==========================================
// 3. TAB NAVIGATOR (The Bottom Bar)
// ==========================================
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6BBF59',
        tabBarInactiveTintColor: '#7A8F82',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'SearchTab') {
            iconName = 'search-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={iconName} size={22} color={color} />
              {/* Only show indicator for active tabs */}
              {focused && (
                <View style={styles.activeIndicator} />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileTabScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// ==========================================
// 4. THE ROOT STACK (Handles screens outside tabs)
// ==========================================
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainTabs">
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
            <Stack.Screen name="AllTips" component={AllTipsScreen} />
            <Stack.Screen name="TipDetails" component={TipDetailsScreen} />
            <Stack.Screen name="PolicyScreen" component={PolicyScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Address" component={AddressScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}

// ==========================================
// 5. STYLES
// ==========================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  viewAllText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  midBannerWrapper: { paddingHorizontal: 20, marginTop: 25 },
  midBanner: { height: 160, borderRadius: 16, overflow: 'hidden' },
  midBannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  midBannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  midBannerContent: { position: 'absolute', bottom: 20, left: 20 },
  midBannerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  midBannerDesc: { fontSize: 11, color: '#E0E0E0', marginBottom: 12 },
  midBannerBtn: { backgroundColor: '#FFF', alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  midBannerBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  productsContainer: { paddingLeft: 20, paddingRight: 10, gap: 15 },
  productCard: { width: 165, backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 1, borderColor: COLORS.borderColor, overflow: 'hidden' },
  productImageContainer: { height: 165, position: 'relative', backgroundColor: '#F7F9F7' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  productBadge: { position: 'absolute', top: 10, left: 10, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  badgeBestSeller: { backgroundColor: COLORS.primary },
  badgeNew: { backgroundColor: '#2E7D32' },
  badgeSale: { backgroundColor: '#D32F2F' },
  productBadgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  wishlistBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#FFF', padding: 6, borderRadius: 20 },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  productType: { fontSize: 10, color: COLORS.textLight, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  oldPrice: { fontSize: 10, color: COLORS.textLight, textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 10, color: COLORS.textLight, marginLeft: 4 },

  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: '#0F1A14',        // Dark black-green background
    borderTopWidth: 1,
    borderTopColor: '#1F3326',         // Subtle green divider
    height: 70,
    paddingBottom: 15,
    paddingTop: 10,
  },
  tabLabel: { 
    fontSize: 10, 
    fontWeight: '600' 
  },
  activeIndicator: {
    width: 20,
    height: 2,
    backgroundColor: '#6BBF59',        // Bright green accent
    marginTop: 4,
    borderRadius: 2,
  },

  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  guestIconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.lightGreen, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  guestTitle: { fontSize: 24, fontWeight: '800', color: COLORS.primary, marginBottom: 10, textAlign: 'center' },
  guestSubtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  loginBtn: { backgroundColor: COLORS.primary, width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  loginBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  signupBtn: { backgroundColor: COLORS.white, width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
  signupBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
});