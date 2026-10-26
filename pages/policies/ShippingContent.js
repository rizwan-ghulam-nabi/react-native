import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const COLORS = { primary: '#235A32', white: '#FFFFFF', textDark: '#111111', textLight: '#666666', borderColor: '#E5E7EB', lightGreen: '#E8F5E9' };

export default function ShippingContent() {
  return (
    <View>
      <View style={styles.featuresGrid}>
        {[
          { icon: 'truck', title: 'Fast Delivery', desc: 'Orders processed within 1-2 business days.' },
          { icon: 'map-pin', title: 'Nationwide', desc: 'We deliver to all major cities and towns.' },
          { icon: 'box', title: 'Safe Packaging', desc: 'Plants are packed securely to prevent damage.' }
        ].map((item, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.iconCircle}><Feather name={item.icon} size={18} color={COLORS.primary} /></View>
            <Text style={styles.featureTitle}>{item.title}</Text>
            <Text style={styles.featureDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shipping Details</Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.text}>
          Thank you for choosing GreenScape. We strive to deliver your plants and gardening supplies in the best condition possible.{'\n\n'}
          All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.{'\n\n'}
          Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
        </Text>
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
  contentCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.borderColor },
  text: { fontSize: 14, color: '#4A5568', lineHeight: 24 },
});