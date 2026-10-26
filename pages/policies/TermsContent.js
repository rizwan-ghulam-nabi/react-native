import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const COLORS = { primary: '#235A32', white: '#FFFFFF', textDark: '#111111', textLight: '#666666', borderColor: '#E5E7EB', lightGreen: '#E8F5E9' };

export default function TermsContent() {
  return (
    <View>
      <View style={styles.featuresGrid}>
        {[
          { icon: 'file-text', title: 'Clear Rules', desc: 'No hidden fine print.' },
          { icon: 'shield', title: 'Secure Usage', desc: 'Your account is protected.' },
          { icon: 'users', title: 'For Everyone', desc: 'Guidelines for all users.' }
        ].map((item, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.iconCircle}><Feather name={item.icon} size={18} color={COLORS.primary} /></View>
            <Text style={styles.featureTitle}>{item.title}</Text>
            <Text style={styles.featureDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Terms of Service</Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.text}>
          Welcome to GreenScape! These terms and conditions outline the rules and regulations for the use of GreenScape's Website and App.{'\n\n'}
          By accessing this website we assume you accept these terms and conditions. Do not continue to use GreenScape if you do not agree to take all of the terms and conditions stated on this page.{'\n\n'}
          The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions.
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