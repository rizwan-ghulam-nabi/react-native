import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const COLORS = { primary: '#235A32', bgColor: '#F8F9F6', white: '#FFFFFF', textDark: '#111111', textLight: '#666666', borderColor: '#E5E7EB', lightGreen: '#E8F5E9', danger: '#D32F2F', warningBg: '#FFF3E0', warningText: '#E65100' };

export default function RefundContent({ navigation }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <View>
      <View style={styles.featuresGrid}>
        {[
          { icon: 'clock', title: '30-Day Window', desc: 'Request a return within 30 days of delivery.' },
          { icon: 'refresh-cw', title: 'Free Returns', desc: 'We cover return shipping when the issue is on us.' },
          { icon: 'zap', title: 'Fast Refunds', desc: 'Processed within 5–7 business days.' },
          { icon: 'shield', title: 'No-Risk Shopping', desc: 'Live plants have a separate 7-day health guarantee.' }
        ].map((item, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.iconCircle}><Feather name={item.icon} size={18} color={COLORS.primary} /></View>
            <Text style={styles.featureTitle}>{item.title}</Text>
            <Text style={styles.featureDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What's Eligible</Text>
        <Text style={styles.sectionSubtitle}>Clear rules, no fine print. Here's what we cover.</Text>
      </View>

      <View style={[styles.eligibilityCard, { borderColor: '#C8E6C9' }]}>
        <View style={styles.eligibilityHeader}>
          <Feather name="check-circle" size={18} color={COLORS.primary} />
          <Text style={[styles.eligibilityTitle, { color: COLORS.primary }]}>Eligible for Refund</Text>
        </View>
        {['Item is unused and in original packaging', 'Live plant shows health issues within 7 days', 'Received wrong item or size', 'Item arrived damaged or defective'].map((text, i) => (
          <View key={i} style={styles.bulletRow}><View style={styles.bulletDotGreen} /><Text style={styles.bulletText}>{text}</Text></View>
        ))}
      </View>

      <View style={[styles.eligibilityCard, { borderColor: '#FFCDD2', marginTop: 15 }]}>
        <View style={styles.eligibilityHeader}>
          <Feather name="x-circle" size={18} color={COLORS.danger} />
          <Text style={[styles.eligibilityTitle, { color: COLORS.danger }]}>Not Eligible</Text>
        </View>
        {['Gift cards and digital products', 'Personalized or custom-engraved items', 'Clearance items marked "final sale"', 'Perishable items after 7 days from delivery'].map((text, i) => (
          <View key={i} style={styles.bulletRow}><View style={styles.bulletDotRed} /><Text style={styles.bulletText}>{text}</Text></View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>How to Request a Refund</Text>
      </View>

      <View style={styles.stepsGrid}>
        {[
          { step: '1', icon: 'mail', title: 'Request a Return', desc: 'Email support@greenscape.com with your order number.' },
          { step: '2', icon: 'check-square', title: 'Get Approval', desc: 'We review your request within 24 hours.' },
          { step: '3', icon: 'package', title: 'Ship It Back', desc: 'Pack securely and drop it at the courier.' },
          { step: '4', icon: 'credit-card', title: 'Get Refunded', desc: 'Processed within 5–7 business days.' }
        ].map((item, i) => (
          <View key={i} style={styles.stepCard}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{item.step}</Text></View>
            <View style={styles.iconCircleLarge}><Feather name={item.icon} size={20} color={COLORS.primary} /></View>
            <Text style={styles.stepTitle}>{item.title}</Text>
            <Text style={styles.stepDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  featureCard: { width: '48%', backgroundColor: COLORS.white, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: COLORS.borderColor, marginBottom: 15 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.lightGreen, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  featureTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textDark, marginBottom: 5 },
  featureDesc: { fontSize: 11, color: COLORS.textLight, lineHeight: 16 },
  sectionHeader: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: COLORS.textDark, marginBottom: 5 },
  sectionSubtitle: { fontSize: 12, color: COLORS.textLight, textAlign: 'center' },
  eligibilityCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, borderWidth: 1 },
  eligibilityHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  eligibilityTitle: { fontSize: 16, fontWeight: '800' },
  bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  bulletDotGreen: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  bulletDotRed: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.danger },
  bulletText: { fontSize: 13, color: '#4A5568', flex: 1 },
  stepsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  stepCard: { width: '48%', backgroundColor: COLORS.white, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.borderColor, marginBottom: 15, position: 'relative' },
  stepNumber: { position: 'absolute', top: -10, left: 15, backgroundColor: COLORS.primary, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  stepNumberText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  iconCircleLarge: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.lightGreen, justifyContent: 'center', alignItems: 'center', marginBottom: 15, marginTop: 5 },
  stepTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textDark, marginBottom: 5 },
  stepDesc: { fontSize: 11, color: COLORS.textLight, lineHeight: 16 },
});