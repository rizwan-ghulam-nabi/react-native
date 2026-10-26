import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const COLORS = { primary: '#235A32', white: '#FFFFFF', textDark: '#111111', textLight: '#666666', borderColor: '#E5E7EB', lightGreen: '#E8F5E9' };

export default function PrivacyContent() {
  return (
    <View>
      <View style={styles.featuresGrid}>
        {[
          { icon: 'lock', title: 'Data Protection', desc: 'Your data is kept secure.' },
          { icon: 'eye-off', title: 'No Selling', desc: 'We never sell your info.' },
          { icon: 'check-circle', title: 'Full Control', desc: 'Manage your data anytime.' }
        ].map((item, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.iconCircle}><Feather name={item.icon} size={18} color={COLORS.primary} /></View>
            <Text style={styles.featureTitle}>{item.title}</Text>
            <Text style={styles.featureDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.text}>
          Your privacy is important to us. It is GreenScape's policy to respect your privacy regarding any information we may collect from you across our website and app.{'\n\n'}
          We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.{'\n\n'}
          We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
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