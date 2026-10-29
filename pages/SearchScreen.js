import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, Image, SafeAreaView, Platform, StatusBar, Keyboard, ActivityIndicator, Alert
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useCart } from '../CartContext'; 

const API_PRODUCTS = 'http://192.168.18.93:5000/api/products/bestsellers';
const API_CATEGORIES = 'http://192.168.18.93:5000/api/categories'; // 👈 Added category API

const COLORS = {
  primary: '#235A32',
  bgColor: '#F8F9F6',
  white: '#FFFFFF',
  textDark: '#111111',
  textLight: '#666666',
  borderColor: '#E5E7EB',
  danger: '#D32F2F'
};

// Default icons for categories (Fallback if DB doesn't have one)
const CATEGORY_ICONS = {
  'Indoor Plants': 'pot-mix',
  'Outdoor Plants': 'flower',
  'Watering & Irrigation': 'watering-can',
  'Pots & Planters': 'pot-mix-outline',
  'Gardening Tools': 'shovel',
  'Home Decor': 'sofa-outline',
  'Soil & Fertilizers': 'seed',
  'Artificial Plants': 'leaf',
};

export default function SearchScreen() {
  const navigation = useNavigation();
  const { addToCart, cart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]); // 👈 State for real categories
  const [loading, setLoading] = useState(true);

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const savedSearches = await AsyncStorage.getItem('@real_recent_searches');
        if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
      } catch (error) {
        console.warn("Failed to load history");
      }

      try {
        // Fetch Products
        const responseProducts = await fetch(API_PRODUCTS);
        const dataProducts = await responseProducts.json();
        const formattedData = dataProducts.map(item => ({
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
        setFilteredProducts(formattedData);

        // 👇 Fetch Real Categories
        const responseCats = await fetch(API_CATEGORIES);
        const dataCats = await responseCats.json();
        setCategories(dataCats);

      } catch (error) {
        console.warn("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);

  // 🎙️ VOICE EVENT LISTENERS
  useSpeechRecognitionEvent("start", () => setIsListening(true));
  useSpeechRecognitionEvent("end", () => setIsListening(false));

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      setSearchQuery(transcript);
      handleSearchChange(transcript);
      saveSearch(transcript);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    setIsListening(false);
    console.log("Speech Error:", event.error);
    if (event.error !== 'no-speech') {
      Alert.alert("Voice Error", event.error || "Could not hear you.");
    }
  });

  const startVoiceSearch = async () => {
    try {
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Please allow microphone access.");
        return;
      }
      
      setIsListening(true);
      ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        maxAlternatives: 1,
        continuous: true,
        requiresOnDeviceRecognition: true,
        addsPunctuation: true,
      });
    } catch (error) {
      console.warn("Speech Start Error:", error);
      setIsListening(false);
      Alert.alert("Voice Search Unavailable", "Voice search is not supported on this device.");
    }
  };

  const stopVoiceSearch = () => {
    ExpoSpeechRecognitionModule.stop();
    setIsListening(false);
  };

  const saveSearch = async (query) => {
    if (!query || query.trim() === '') return;
    const newSearches = [query, ...recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase())].slice(0, 5);
    setRecentSearches(newSearches);
    await AsyncStorage.setItem('@real_recent_searches', JSON.stringify(newSearches));
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(item => 
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.type.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    if (searchQuery.trim() !== '') saveSearch(searchQuery);
  };

  const clearAllSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem('@real_recent_searches');
  };

  const removeSearch = async (searchToRemove) => {
    const updatedSearches = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem('@real_recent_searches', JSON.stringify(updatedSearches));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgColor} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 🟢 HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={28} color={COLORS.textDark} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <View style={styles.logoRow}>
              <MaterialCommunityIcons name="leaf" size={28} color={COLORS.primary} />
              <Text style={styles.logoText}>Green<Text style={{color: '#689F38'}}>Scape</Text></Text>
            </View>
            <Text style={styles.tagline}>PLANTS • GARDEN • HOME</Text>
          </View>
          
          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color={COLORS.textDark} />
            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 🟢 TITLE */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>What are you looking for?</Text>
          <Text style={styles.subtitleText}>
            Find the perfect plants, pots and garden essentials for your space.
          </Text>
        </View>

        {/* 🟢 SEARCH BAR */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchContainer, isListening && styles.searchContainerActive]}>
            <Feather name="search" size={22} color={COLORS.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={isListening ? "Listening..." : "Search for plants, pots, categories..."}
              placeholderTextColor={isListening ? COLORS.primary : COLORS.textLight}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchChange('')} style={{ marginRight: 10 }}>
                <Feather name="x-circle" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              onPress={isListening ? stopVoiceSearch : startVoiceSearch}
              style={isListening ? styles.listeningBtn : null}
            >
              <Feather name="mic" size={22} color={isListening ? COLORS.white : COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 🟢 RECENT SEARCHES */}
        {searchQuery === '' && recentSearches.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearAllSearches}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.chipsContainer}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.chip}
                  onPress={() => {
                    handleSearchChange(search);
                    saveSearch(search);
                  }}
                >
                  <Feather name="clock" size={14} color={COLORS.textLight} />
                  <Text style={styles.chipText}>{search}</Text>
                  <TouchableOpacity onPress={() => removeSearch(search)}>
                    <Feather name="x" size={14} color={COLORS.textLight} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 🟢 POPULAR CATEGORIES (Now fetching from DB) */}
        {searchQuery === '' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Categories</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                <Text style={styles.clearText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.gridContainer}>
              {/* Show first 6 categories from the DB */}
              {categories.slice(0, 6).map((cat) => (
                <TouchableOpacity 
                  key={cat._id} 
                  style={[styles.categoryCard, { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.borderColor }]}
                  onPress={() => navigation.navigate('Products', { 
                    categorySlug: cat.slug, 
                    categoryName: cat.name 
                  })}
                >
                  <View style={styles.categoryIconWrapper}>
                    <MaterialCommunityIcons 
                      name={CATEGORY_ICONS[cat.name] || 'sprout'} 
                      size={40} 
                      color={COLORS.primary} 
                    />
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 🟢 SEARCH RESULTS */}
        {searchQuery !== '' && (
          <View style={styles.sectionContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : filteredProducts.length === 0 ? (
              <View style={styles.noResults}>
                <Feather name="search" size={40} color={COLORS.textLight} />
                <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
              </View>
            ) : (
              <View style={styles.resultsGrid}>
                {filteredProducts.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.resultCard}
                    onPress={() => addToCart(item)}
                  >
                    <Image source={{ uri: item.img }} style={styles.resultImage} />
                    <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.resultPrice}>Rs. {item.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgColor },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 20 : 10, paddingBottom: 20 },
  backBtn: { padding: 5 },
  logoContainer: { alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logoText: { fontSize: 22, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  tagline: { fontSize: 9, fontWeight: '600', color: COLORS.textLight, letterSpacing: 1, marginTop: 2 },
  cartBtn: { padding: 5, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.primary, borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.bgColor },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: 'bold' },
  titleSection: { paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  titleText: { fontSize: 26, fontWeight: '800', color: COLORS.primary, marginBottom: 8, letterSpacing: -0.5 },
  subtitleText: { fontSize: 14, color: COLORS.textLight, lineHeight: 22, width: '90%' },
  searchWrapper: { paddingHorizontal: 20, marginBottom: 25 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 30, paddingHorizontal: 15, height: 56, borderWidth: 1, borderColor: COLORS.borderColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  searchContainerActive: { borderColor: COLORS.primary, borderWidth: 2 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textDark, height: '100%' },
  listeningBtn: { backgroundColor: COLORS.primary, padding: 8, borderRadius: 20 },
  sectionContainer: { paddingHorizontal: 20, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  clearText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F0EA', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, gap: 8 },
  chipText: { fontSize: 13, color: COLORS.textDark, fontWeight: '500' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 15 },
  categoryCard: { width: '31%', borderRadius: 16, paddingVertical: 15, paddingHorizontal: 5, alignItems: 'center', marginBottom: 15, backgroundColor: COLORS.white },
  categoryIconWrapper: { height: 50, justifyContent: 'center', marginBottom: 5 },
  categoryName: { fontSize: 11, fontWeight: '700', color: COLORS.textDark, textAlign: 'center' },
  resultsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  resultCard: { width: '48%', backgroundColor: COLORS.white, borderRadius: 12, padding: 10, marginBottom: 15, borderWidth: 1, borderColor: COLORS.borderColor },
  resultImage: { width: '100%', height: 120, borderRadius: 8, backgroundColor: '#F0F0F0', marginBottom: 8 },
  resultName: { fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  resultPrice: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  noResults: { alignItems: 'center', marginTop: 40 },
  noResultsText: { fontSize: 14, color: COLORS.textLight, marginTop: 10 },
});