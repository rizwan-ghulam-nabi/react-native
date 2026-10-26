import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, 
  Platform, StatusBar 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import PrivacyContent from './policies/PrivacyContent';
import TermsContent from './policies/TermsContent';
import ShippingContent from './policies/ShippingContent';
import RefundContent from './policies/RefundContent';

const COLORS = { primary: '#235A32', bgColor: '#F8F9F6', white: '#FFFFFF' };

export default function PolicyScreen({ route, navigation }) {
  const { title = 'Privacy Policy' } = route.params || {};

  const renderContent = () => {
    switch (title) {
      case 'Privacy Policy': return <PrivacyContent />;
      case 'Terms & Conditions': return <TermsContent />;
      case 'Shipping Policy': return <ShippingContent />;
      case 'Refund Policy': return <RefundContent />;
      default: return <PrivacyContent />;
    }
  };

  // Custom subtitle based on the page
  const getSubtitle = () => {
    switch (title) {
      case 'Privacy Policy': return 'Learn how we handle and protect your personal data.';
      case 'Terms & Conditions': return 'The rules and guidelines for using GreenScape.';
      case 'Shipping Policy': return 'Everything you need to know about how we deliver your plants.';
      case 'Refund Policy': return 'Shop risk-free. If something isn\'t right, we\'ll fix it.';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* 🟢 Shared Green Hero Header */}
      <View style={styles.heroSection}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.topNavTitle}>GreenScape</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroSubtitle}>{getSubtitle()}</Text>
        </View>
      </View>

      {/* 📄 The Dynamic Content Area */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderContent()}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgColor },
  heroSection: {
    backgroundColor: COLORS.primary,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 20,
  },
  backBtn: { padding: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  topNavTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  heroContent: { alignItems: 'center', marginTop: 10 },
  heroTitle: { color: COLORS.white, fontSize: 32, fontWeight: '900', marginBottom: 10, textAlign: 'center' },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  scrollContent: { padding: 20 },
});