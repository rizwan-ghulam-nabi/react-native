import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2B7A4B',
  textDark: '#111111',
  textLight: '#666666',
  white: '#FFFFFF',
  borderColor: '#E5E7EB',
};

const TRUST_ITEMS = [
  { id: 1, title: 'Quality You\nCan Trust', sub: 'Premium &\ndurable', icon: 'leaf', iconType: 'MaterialCommunityIcons' },
  { id: 2, title: 'Fast & Free\nShipping', sub: 'On orders\nover 1000RS', icon: 'truck', iconType: 'Feather' },
  { id: 3, title: '30-Day Plant\nGuarantee', sub: 'Love it or get\na replacement', icon: 'shield', iconType: 'Feather' },
  { id: 4, title: 'Secure &\nSafe Payments', sub: '100%\nsecure checkout', icon: 'credit-card', iconType: 'Feather' },
];

export default function TrustBadges() {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {TRUST_ITEMS.map((item, index) => (
          <React.Fragment key={item.id}>
            {/* Trust Item Column */}
            <View style={styles.itemContainer}>
              <View style={styles.iconCircle}>
                {item.iconType === 'MaterialCommunityIcons' ? (
                  <MaterialCommunityIcons name={item.icon} size={20} color={COLORS.primary} />
                ) : (
                  <Feather name={item.icon} size={18} color={COLORS.primary} />
                )}
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.sub}</Text>
            </View>

            {/* Vertical Divider */}
            {index !== TRUST_ITEMS.length - 1 && (
              <View style={styles.divider} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9F6', 
    paddingVertical: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderColor,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center', // Centers icon and text
    paddingHorizontal: 4,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Space between icon and text
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 14,
  },
  subtitle: {
    fontSize: 9,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 12,
  },
  divider: {
    width: 1,
    height: 60, // Taller divider to match the new layout
    backgroundColor: '#E5E7EB',
    marginTop: 10, 
  },
});