import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Platform, TextInput, Alert,
  ActivityIndicator, Modal, KeyboardAvoidingView
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
  danger: '#D32F2F',
};

const API_URL = 'http://192.168.18.80:5000/api/addresses';

export default function AddressScreen({ navigation, route }) {
  const { user } = useAuth();
  const onSelectAddress = route.params?.onSelectAddress;

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    label: 'Home', type: 'home', fullName: '', addressLine1: '',
    addressLine2: '', city: '', state: '', postalCode: '',
    country: 'Pakistan', phone: '', isDefault: false,
  });

  // ===== HELPER: GET TOKEN =====
  const getToken = async () => {
    // 👈 IMPORTANT: Make sure this key matches EXACTLY what you saved in LoginScreen!
    // If you saved it as 'token' in LoginScreen, change this to 'token'.
    const token = await AsyncStorage.getItem('@user_token'); 
    return token;
  };

  // ===== FETCH ADDRESSES =====
  const fetchAddresses = async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        Alert.alert("Session Expired", "Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setAddresses(data.addresses);
        const defaultAddr = data.addresses.find(a => a.isDefault);
        if (defaultAddr) setSelectedId(defaultAddr._id);
        else if (data.addresses.length > 0) setSelectedId(data.addresses[0]._id);
      }
    } catch (error) {
      console.warn("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ===== SAVE ADDRESS =====
  const handleSave = async () => {
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.phone) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) return;

      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setModalVisible(false);
        fetchAddresses(); 
      } else {
        Alert.alert("Error", data.message || "Failed to save address");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to the server.");
    } finally {
      setIsSaving(false);
    }
  };

  // ===== DELETE ADDRESS =====
  const handleDelete = (id) => {
    Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            const token = await getToken();
            if (!token) return;
            
            await fetch(`${API_URL}/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchAddresses();
          } catch (error) { console.warn(error); }
        }
      }
    ]);
  };

  // ===== SET DEFAULT ADDRESS =====
  const handleSetDefault = async (id) => {
    try {
      const token = await getToken();
      if (!token) return;
      
      await fetch(`${API_URL}/${id}/default`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAddresses();
    } catch (error) { console.warn(error); }
  };

  // ===== OPEN MODAL =====
  const openModal = (address = null) => {
    if (address) {
      setEditingId(address._id);
      setFormData({
        label: address.label,
        type: address.type || 'home',
        fullName: address.fullName,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone,
        isDefault: address.isDefault,
      });
    } else {
      setEditingId(null);
      setFormData({
        label: 'Home', type: 'home',
        fullName: user ? `${user.firstName} ${user.lastName}` : '',
        addressLine1: '', addressLine2: '', city: '', state: '',
        postalCode: '', country: 'Pakistan', phone: '', isDefault: false,
      });
    }
    setModalVisible(true);
  };

  // ===== CONFIRM SELECTION =====
  const confirmSelection = () => {
    const selectedAddress = addresses.find(a => a._id === selectedId);
    if (selectedAddress && onSelectAddress) {
      onSelectAddress(selectedAddress);
      navigation.goBack();
    } else if (!selectedAddress) {
      Alert.alert("No Address", "Please add or select an address first.");
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgColor} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="map-marker-off" size={60} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>No addresses saved</Text>
            <Text style={styles.emptySub}>Add an address to make checkout faster.</Text>
          </View>
        ) : (
          addresses.map((address) => (
            <TouchableOpacity
              key={address._id}
              style={[styles.card, selectedId === address._id && styles.cardActive]}
              onPress={() => setSelectedId(address._id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.labelRow}>
                  <View style={styles.radioOuter}>
                    {selectedId === address._id && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}><Text style={styles.defaultText}>Default</Text></View>
                  )}
                </View>
                <View style={styles.actions}>
                  {/* 👈 Added hitSlop and stopped propagation by wrapping in View */}
                  <TouchableOpacity onPress={() => openModal(address)} style={styles.actionBtn} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <Feather name="edit-2" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(address._id)} style={styles.actionBtn} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <Feather name="trash-2" size={16} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.nameText}>{address.fullName}</Text>
                <Text style={styles.addressText}>{address.addressLine1}</Text>
                {address.addressLine2 ? <Text style={styles.addressText}>{address.addressLine2}</Text> : null}
                <Text style={styles.addressText}>{address.city}, {address.state} {address.postalCode}</Text>
                <Text style={styles.phoneText}>{address.phone}</Text>
              </View>

              {!address.isDefault && (
                <TouchableOpacity 
                  onPress={() => handleSetDefault(address._id)} 
                  style={styles.setDefaultBtn}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                  <Text style={styles.setDefaultText}>Set as default</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
          <Feather name="plus" size={20} color={COLORS.primary} />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={confirmSelection}>
          <Text style={styles.saveBtnText}>Deliver to this Address</Text>
          <Feather name="arrow-right" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* ADD/EDIT MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Address' : 'Add New Address'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput style={styles.input} value={formData.fullName} onChangeText={(t) => setFormData({ ...formData, fullName: t })} placeholder="John Doe" />

              <Text style={styles.inputLabel}>Address Line 1 *</Text>
              <TextInput style={styles.input} value={formData.addressLine1} onChangeText={(t) => setFormData({ ...formData, addressLine1: t })} placeholder="Street address" />

              <Text style={styles.inputLabel}>Address Line 2</Text>
              <TextInput style={styles.input} value={formData.addressLine2} onChangeText={(t) => setFormData({ ...formData, addressLine2: t })} placeholder="Apartment, suite, etc." />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>City *</Text>
                  <TextInput style={styles.input} value={formData.city} onChangeText={(t) => setFormData({ ...formData, city: t })} placeholder="City" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>State *</Text>
                  <TextInput style={styles.input} value={formData.state} onChangeText={(t) => setFormData({ ...formData, state: t })} placeholder="State" />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Postal Code *</Text>
                  <TextInput style={styles.input} value={formData.postalCode} onChangeText={(t) => setFormData({ ...formData, postalCode: t })} keyboardType="numeric" placeholder="75500" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Phone *</Text>
                  <TextInput style={styles.input} value={formData.phone} onChangeText={(t) => setFormData({ ...formData, phone: t })} keyboardType="phone-pad" placeholder="03001234567" />
                </View>
              </View>

              <TouchableOpacity style={styles.checkboxRow} onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}>
                <View style={[styles.checkbox, formData.isDefault && styles.checkboxActive]}>
                  {formData.isDefault && <Feather name="check" size={12} color={COLORS.white} />}
                </View>
                <Text style={styles.checkboxText}>Set as default address</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSave} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.modalSaveText}>Save Address</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgColor },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  backBtn: { padding: 5, marginLeft: -5 },

  // Empty State
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginTop: 15 },
  emptySub: { fontSize: 14, color: COLORS.textLight, marginTop: 5 },

  // Address Card
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: COLORS.borderColor },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.cardBg },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  addressLabel: { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  defaultBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  defaultText: { fontSize: 10, color: COLORS.primary, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 10 },
  actionBtn: { padding: 4 },
  
  cardBody: { paddingLeft: 26 },
  nameText: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  addressText: { fontSize: 13, color: COLORS.textLight, lineHeight: 18 },
  phoneText: { fontSize: 13, color: COLORS.textDark, fontWeight: '600', marginTop: 6 },
  setDefaultBtn: { marginTop: 12, paddingLeft: 26 },
  setDefaultText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },

  // Add Button
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed', gap: 8 },
  addBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },

  // Bottom Bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, padding: 20, borderTopWidth: 1, borderTopColor: COLORS.borderColor },
  saveBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8 },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },

  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textDark, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: COLORS.bgColor, borderWidth: 1, borderColor: COLORS.borderColor, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 14, color: COLORS.textDark },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: COLORS.borderColor, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkboxText: { fontSize: 14, color: COLORS.textDark },
  modalSaveBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 25, marginBottom: 20 },
  modalSaveText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});