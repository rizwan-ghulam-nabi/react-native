// pages/ProductsScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Platform, StatusBar
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../CartContext';

const COLORS = {
  primary: '#235A32',
  background: '#F8F9F6',
  white: '#FFFFFF',
  textDark: '#111111',
  textLight: '#666666',
  borderColor: '#E5E7EB'
};

const API_BASE = 'http://192.168.18.80:5000';

export default function ProductsScreen({ route, navigation }) {
  const { categorySlug, categoryName } = route.params;
  const { addToCart, cart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
const response = await fetch(`http://192.168.18.80:5000/api/products/category/${categorySlug}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.warn("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categorySlug]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => addToCart(item)}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>Rs. {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}>
          <Feather name="shopping-cart" size={24} color={COLORS.textDark} />
          {cart.length > 0 && (
            <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="leaf-off" size={60} color={COLORS.textLight} />
          <Text style={styles.emptyText}>No products found in this category.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.rowWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15, paddingVertical: 15,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.borderColor
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  cartBtn: { padding: 5, position: 'relative' },
  badge: {
    position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.primary,
    borderRadius: 10, width: 16, height: 16, justifyContent: 'center',
    alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.white
  },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: 'bold' },
  
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, fontSize: 16, color: COLORS.textLight },
  
  listContainer: { padding: 15, paddingBottom: 100 },
  rowWrapper: { justifyContent: 'space-between' },
  productCard: {
    width: '48%', backgroundColor: COLORS.white, borderRadius: 12, marginBottom: 15,
    overflow: 'hidden', borderWidth: 1, borderColor: COLORS.borderColor,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  productImage: { width: '100%', height: 140, resizeMode: 'cover' },
  productInfo: { padding: 10 },
  productName: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  productPrice: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
});