import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, StatusBar, Platform, Modal 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://192.168.18.80:5000/api/orders';

const COLORS = {
  primary: '#235A32',
  bgColor: '#F8F9F6',
  white: '#FFFFFF',
  textDark: '#111111',
  textLight: '#666666',
  borderColor: '#E5E7EB',
  danger: '#D32F2F',
};

export default function MyOrdersScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 State for the Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const userId = user?._id || '6ac75db705590e499a1990e3';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/user/${userId}`);
        const json = await response.json();
        if (json.success) {
          setOrders(json.data);
        }
      } catch (error) {
        console.warn("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return '#F59E0B';
      case 'shipped': return '#3B82F6';
      case 'delivered': return COLORS.primary;
      case 'cancelled': return COLORS.danger;
      default: return COLORS.textLight;
    }
  };

  const renderOrder = (order) => (
    <View key={order._id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.orderStatus)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.orderStatus) }]}>
            {order.orderStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>Rs. {item.price.toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>Rs. {order.totalAmount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewBtn}
          onPress={() => setSelectedOrder(order)} // 👈 Opens the Modal
        >
          <Text style={styles.viewBtnText}>View Details</Text>
          <Feather name="chevron-right" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="shopping-outline" size={60} color="#CCC" />
          <Text style={styles.emptyText}>No orders found yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {orders.map(renderOrder)}
        </ScrollView>
      )}

      {/* 🟢 ORDER DETAILS MODAL */}
      <Modal
        visible={!!selectedOrder}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <Feather name="x" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* Order Info */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Order Number:</Text>
                  <Text style={styles.infoValue}>{selectedOrder.orderNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Payment Method:</Text>
                  <Text style={styles.infoValue}>{selectedOrder.paymentMethod.toUpperCase()}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Payment Status:</Text>
                  <Text style={[styles.infoValue, { color: COLORS.primary }]}>
                    {selectedOrder.paymentStatus.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* Shipping Address */}
                <Text style={styles.sectionTitle}>Shipping Address</Text>
                <View style={styles.addressBox}>
                  <Text style={styles.addressText}>
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                  </Text>
                  <Text style={styles.addressText}>{selectedOrder.shippingAddress.phone}</Text>
                  <Text style={styles.addressText}>
                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                  </Text>
                  <Text style={styles.addressText}>
                    {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* Order Items */}
                <Text style={styles.sectionTitle}>Items</Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} style={styles.modalItemRow}>
                    <View style={styles.modalItemDetails}>
                      <Text style={styles.modalItemName}>{item.name}</Text>
                      <Text style={styles.modalItemQty}>Qty: {item.quantity}</Text>
                    </View>
                    <Text style={styles.modalItemPrice}>Rs. {item.price.toLocaleString()}</Text>
                  </View>
                ))}

                <View style={styles.divider} />

                {/* Total */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabelModal}>Total Amount</Text>
                  <Text style={styles.totalAmountModal}>Rs. {selectedOrder.totalAmount.toLocaleString()}</Text>
                </View>

              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgColor },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.borderColor },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 15, fontSize: 16, color: COLORS.textLight },
  listContent: { padding: 20, paddingBottom: 100 },
  
  // Order Card
  orderCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: COLORS.borderColor, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 12, marginBottom: 12 },
  orderNumber: { fontSize: 14, fontWeight: '800', color: COLORS.textDark, marginBottom: 2 },
  orderDate: { fontSize: 12, color: COLORS.textLight },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: '800' },
  itemsContainer: { marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemDetails: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 13, fontWeight: '600', color: COLORS.textDark },
  itemQty: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  itemPrice: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  totalLabel: { fontSize: 11, color: COLORS.textLight },
  totalAmount: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  viewBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 4 },
  viewBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '80%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { fontSize: 13, color: COLORS.textLight },
  infoValue: { fontSize: 13, fontWeight: '600', color: COLORS.textDark },
  
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginBottom: 10 },
  addressBox: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8 },
  addressText: { fontSize: 13, color: COLORS.textDark, marginBottom: 4 },
  
  modalItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalItemDetails: { flex: 1 },
  modalItemName: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  modalItemQty: { fontSize: 12, color: COLORS.textLight },
  modalItemPrice: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
  
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 30 },
  totalLabelModal: { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  totalAmountModal: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
});