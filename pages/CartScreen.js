import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, SafeAreaView, StatusBar, Platform 
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useCart } from '../CartContext';

const COLORS = { 
  primary: '#235A32', 
  primaryLight: '#3D8B4F', 
  white: '#FFFFFF', 
  textDark: '#111111', 
  textLight: '#666666', 
  borderColor: '#E8E8E8',
  background: '#FAFAFA'
};

export default function CartScreen({ navigation }) {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  // Math is now perfectly clean because price is a raw number
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? 100 : 0; 
  const total = subtotal + deliveryFee;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
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
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <View style={styles.emptyIconBg}>
              <Feather name="shopping-cart" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyText}>Looks like you haven't added any plants yet.</Text>
            <TouchableOpacity style={styles.goShopBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.goShopText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* Cart Items List */}
            {cart.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <Image source={{ uri: item.img }} style={styles.cartImage} />
                
                <View style={styles.cartDetails}>
                  <View style={styles.cartTopRow}>
                    <Text style={styles.cartName} numberOfLines={1}>{item.name}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Feather name="trash-2" size={18} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Displaying raw number formatted properly */}
                  <Text style={styles.cartPrice}>Rs. {item.price.toLocaleString()}.00</Text>
                  
                  {/* Quantity Controls */}
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => decreaseQuantity(item.id)}
                      disabled={item.quantity === 1}
                    >
                      <Feather name="minus" size={14} color={item.quantity === 1 ? COLORS.borderColor : COLORS.textDark} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQuantity(item.id)}>
                      <Feather name="plus" size={14} color={COLORS.textDark} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Order Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>Rs. {subtotal.toLocaleString()}.00</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>Rs. {deliveryFee.toLocaleString()}.00</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>Rs. {total.toLocaleString()}.00</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Checkout Bar */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerTotalLabel}>Total Price</Text>
            <Text style={styles.footerTotal}>Rs. {total.toLocaleString()}.00</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>Checkout</Text>
            <Feather name="arrow-right" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 15 : 10, paddingBottom: 15, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.borderColor },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 22, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  logoTextBlack: { color: COLORS.textDark },
  headerTagline: { fontSize: 9, color: '#A0A0A0', fontWeight: '600', marginLeft: 32, marginTop: -2 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginTop: 10 },

  scrollContent: { padding: 20, paddingBottom: 120 },

  // Empty State
  emptyCart: { alignItems: 'center', marginTop: 60 },
  emptyIconBg: { width: 80, height: 80, backgroundColor: '#EBF3EC', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, marginBottom: 8 },
  emptyText: { fontSize: 14, color: COLORS.textLight, marginBottom: 25, textAlign: 'center' },
  goShopBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 25 },
  goShopText: { color: COLORS.white, fontSize: 15, fontWeight: 'bold' },

  // Cart Cards
  cartCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: COLORS.borderColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 2 },
  cartImage: { width: 80, height: 80, resizeMode: 'contain', marginRight: 15 },
  cartDetails: { flex: 1, justifyContent: 'space-between' },
  cartTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cartName: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, flex: 1, marginRight: 10 },
  cartPrice: { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
  
  // Quantity Controls
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#F5F7F5', borderRadius: 8, alignSelf: 'flex-start' },
  qtyBtn: { padding: 8 },
  qtyText: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, paddingHorizontal: 10 },

  // Summary
  summaryContainer: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginTop: 10, borderWidth: 1, borderColor: COLORS.borderColor },
  summaryTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginBottom: 15 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: COLORS.textLight, fontWeight: '500' },
  summaryValue: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  divider: { height: 1, backgroundColor: COLORS.borderColor, marginVertical: 15 },
  totalLabel: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },

  // Fixed Footer
  footer: { position: 'absolute', bottom: 70, left: 0, right: 0, backgroundColor: COLORS.white, padding: 20, borderTopWidth: 1, borderTopColor: COLORS.borderColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 10 },
  footerTotalLabel: { fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 },
  footerTotal: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  checkoutBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 25, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkoutText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});