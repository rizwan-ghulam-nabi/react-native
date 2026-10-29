import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, 
  SafeAreaView, StatusBar, Platform, ActivityIndicator 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../CartContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#1B4D2E',
  accent: '#689F38',
  bgColor: '#F8F9F6',
  white: '#FFFFFF',
  textDark: '#111111',
  textLight: '#666666',
  borderColor: '#E5E7EB',
  cardBg: '#F4F7F4',
};

const API_URL = 'http://192.168.18.80:5000/api/addresses';

export default function CheckoutScreen({ navigation, route }) {
  const { cart, removeFromCart } = useCart(); 
  const { user } = useAuth();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true); // 👈 Loading state

  // Delivery & Payment States
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // 👈 1. Fetch Default Address on Mount
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const token = await AsyncStorage.getItem('@user_token');
        const response = await fetch(API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.addresses) {
          // Find the default address, or just use the first one
          const defaultAddr = data.addresses.find(a => a.isDefault) || data.addresses[0];
          if (defaultAddr) setSelectedAddress(defaultAddr);
        }
      } catch (error) {
        console.log("Failed to load address:", error);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchDefaultAddress();
  }, []);

  // 👈 2. Listen for address sent back from AddressScreen (when user changes it)
  useEffect(() => {
    if (route.params?.selectedAddress) {
      setSelectedAddress(route.params.selectedAddress);
    }
  }, [route.params?.selectedAddress]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = deliveryMethod === 'standard' ? 250 : 450;
  const total = subtotal + deliveryFee;

  const handleSelectAddress = () => {
    navigation.navigate('Address');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgColor} />
      
      {/* 🟢 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <MaterialCommunityIcons name="leaf" size={24} color={COLORS.primary} />
            <Text style={styles.logoText}>Green<Text style={{color: COLORS.accent}}>Scape</Text></Text>
          </View>
          <Text style={styles.tagline}>PLANTS • GARDEN • HOME</Text>
        </View>

        <View style={styles.secureContainer}>
          <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.primary} />
          <Text style={styles.secureText}>Secure Checkout</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* TITLE */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Checkout</Text>
          <Text style={styles.pageSubtitle}>Complete your order and bring nature home</Text>
        </View>

        {/* 1. SHIPPING ADDRESS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepText}>1</Text></View>
            <Text style={styles.cardTitle}>Shipping Address</Text>
            <TouchableOpacity onPress={handleSelectAddress}>
              <Text style={styles.editText}>{selectedAddress ? 'Edit' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.addressBox}>
            <MaterialCommunityIcons name="map-marker" size={22} color={COLORS.primary} />
            <View style={styles.addressDetails}>
              {loadingAddress ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : selectedAddress ? (
                <>
                  <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
                  <Text style={styles.addressText}>{selectedAddress.addressLine1}</Text>
                  {selectedAddress.addressLine2 ? <Text style={styles.addressText}>{selectedAddress.addressLine2}</Text> : null}
                  <Text style={styles.addressText}>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}</Text>
                  <Text style={styles.addressText}>{selectedAddress.phone}</Text>
                </>
              ) : (
                <TouchableOpacity onPress={handleSelectAddress}>
                  <Text style={{ color: COLORS.primary, fontWeight: '700', marginTop: 4 }}>
                    + Select Shipping Address
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* 2. DELIVERY METHOD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepText}>2</Text></View>
            <Text style={styles.cardTitle}>Delivery Method</Text>
          </View>

          <TouchableOpacity 
            style={[styles.selectBox, deliveryMethod === 'standard' && styles.selectBoxActive]}
            onPress={() => setDeliveryMethod('standard')}
          >
            <Feather name={deliveryMethod === 'standard' ? "check-circle" : "circle"} size={20} color={deliveryMethod === 'standard' ? COLORS.primary : COLORS.textLight} />
            <MaterialCommunityIcons name="truck-outline" size={24} color={COLORS.primary} style={{ marginLeft: 10 }} />
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Standard Delivery</Text>
              <Text style={styles.methodDesc}>3 - 5 business days</Text>
            </View>
            <Text style={styles.methodPrice}>PKR 250</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.selectBox, deliveryMethod === 'express' && styles.selectBoxActive, { marginTop: 10 }]}
            onPress={() => setDeliveryMethod('express')}
          >
            <Feather name={deliveryMethod === 'express' ? "check-circle" : "circle"} size={20} color={deliveryMethod === 'express' ? COLORS.primary : COLORS.textLight} />
            <MaterialCommunityIcons name="rocket-launch-outline" size={24} color={COLORS.textLight} style={{ marginLeft: 10 }} />
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Express Delivery</Text>
              <Text style={styles.methodDesc}>1 - 2 business days</Text>
            </View>
            <Text style={styles.methodPrice}>PKR 450</Text>
          </TouchableOpacity>
        </View>

        {/* 3. PAYMENT METHOD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepText}>3</Text></View>
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>

          <View style={styles.paymentGrid}>
            <TouchableOpacity 
              style={[styles.paymentBox, paymentMethod === 'card' && styles.paymentBoxActive]}
              onPress={() => setPaymentMethod('card')}
            >
              <Feather name={paymentMethod === 'card' ? "check-circle" : "circle"} size={18} color={paymentMethod === 'card' ? COLORS.primary : COLORS.textLight} />
              <MaterialCommunityIcons name="credit-card-outline" size={20} color={COLORS.textDark} style={{ marginLeft: 8 }} />
              <Text style={styles.paymentText}>Credit / Debit Card</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentBox, paymentMethod === 'jazzcash' && styles.paymentBoxActive]}
              onPress={() => setPaymentMethod('jazzcash')}
            >
              <Feather name={paymentMethod === 'jazzcash' ? "check-circle" : "circle"} size={18} color={paymentMethod === 'jazzcash' ? COLORS.primary : COLORS.textLight} />
              <MaterialCommunityIcons name="cellphone" size={20} color={COLORS.textDark} style={{ marginLeft: 8 }} />
              <Text style={styles.paymentText} numberOfLines={1}>JazzCash / EasyPaisa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentBox, paymentMethod === 'cod' && styles.paymentBoxActive]}
              onPress={() => setPaymentMethod('cod')}
            >
              <Feather name={paymentMethod === 'cod' ? "check-circle" : "circle"} size={18} color={paymentMethod === 'cod' ? COLORS.primary : COLORS.textLight} />
              <MaterialCommunityIcons name="cash" size={20} color={COLORS.textDark} style={{ marginLeft: 8 }} />
              <Text style={styles.paymentText}>Cash on Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. ORDER SUMMARY */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepText}>4</Text></View>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <Text style={styles.itemCount}>{cart.length} Items</Text>
          </View>

          {cart.map((item, index) => (
            <View key={item.id || index} style={styles.cartItem}>
              <Image source={{ uri: item.img }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemType}>{item.type} • Qty: {item.quantity || 1}</Text>
              </View>
              <View style={styles.itemRight}>
                {/* 👈 FIX: Safe price fallback */}
                <Text style={styles.itemPrice}>PKR {(item.price || 0).toLocaleString()}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Feather name="trash-2" size={16} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>PKR {subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Fee</Text>
            <Text style={styles.totalValue}>PKR {deliveryFee.toLocaleString()}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={[styles.totalRow, { marginTop: 5 }]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>PKR {total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 🟢 BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.safeInfo}>
          <MaterialCommunityIcons name="leaf" size={20} color={COLORS.primary} />
          <Text style={styles.safeText}>Your plants are safe with us!{'\n'}<Text style={styles.safeSubText}>Eco-friendly packaging</Text></Text>
        </View>
        
        <TouchableOpacity 
          style={styles.placeOrderBtn}
          onPress={() => {
            if (!selectedAddress) {
              alert("Please select a shipping address first.");
              return;
            }
            alert("Order Placed Successfully!");
          }}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
          <Feather name="arrow-right" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (Keep your exact same styles, they are perfect)
  safeArea: { flex: 1, backgroundColor: COLORS.bgColor },
  scrollContent: { paddingBottom: 120, paddingHorizontal: 15 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backBtn: { padding: 5, marginLeft: -5 },
  logoContainer: { alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logoText: { fontSize: 20, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  tagline: { fontSize: 8, fontWeight: '600', color: COLORS.textLight, letterSpacing: 1, marginTop: 2 },
  secureContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  secureText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  titleSection: { paddingHorizontal: 5, marginTop: 15, marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: COLORS.textLight },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  stepBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  stepText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primary, flex: 1 },
  editText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  itemCount: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  addressBox: { flexDirection: 'row', backgroundColor: COLORS.cardBg, padding: 15, borderRadius: 12 },
  addressDetails: { marginLeft: 10, flex: 1 },
  addressName: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  addressText: { fontSize: 13, color: COLORS.textLight, marginBottom: 2, lineHeight: 18 },
  selectBox: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: COLORS.borderColor },
  selectBoxActive: { backgroundColor: COLORS.cardBg, borderColor: COLORS.primary },
  methodInfo: { flex: 1, marginLeft: 10 },
  methodTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  methodDesc: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  methodPrice: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  paymentBox: { width: '48%', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.borderColor, flexWrap: 'wrap' },
  paymentBoxActive: { backgroundColor: COLORS.cardBg, borderColor: COLORS.primary },
  paymentText: { fontSize: 11, fontWeight: '600', color: COLORS.textDark, marginLeft: 6, width: '70%' },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  itemImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#F0F0F0' },
  itemInfo: { flex: 1, marginLeft: 12, paddingRight: 10 },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  itemType: { fontSize: 12, color: COLORS.textLight },
  itemRight: { alignItems: 'flex-end', justifyContent: 'space-between', height: 50 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  divider: { height: 1, backgroundColor: COLORS.borderColor, marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
  totalValue: { fontSize: 13, color: COLORS.textDark, fontWeight: '600' },
  grandTotalLabel: { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  grandTotalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: COLORS.borderColor, paddingBottom: Platform.OS === 'ios' ? 30 : 15 },
  safeInfo: { flexDirection: 'row', alignItems: 'center', width: '45%' },
  safeText: { fontSize: 10, color: COLORS.textDark, marginLeft: 6, fontWeight: '600' },
  safeSubText: { fontSize: 9, color: COLORS.textLight, fontWeight: '400' },
  placeOrderBtn: { flex: 1, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8 },
  placeOrderText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});