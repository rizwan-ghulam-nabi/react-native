import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Dimensions 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#235A32', // Green
  textDark: '#111111', // Black
  textLight: '#888888', // Gray
  bgColor: '#F5F5F5', // Light gray for the card
  white: '#FFFFFF',
};

const STATS = [
  { id: 1, icon: 'star', iconType: 'Feather', value: '50,000+', label: 'Happy Gardeners' },
  { id: 2, icon: 'feather', iconType: 'Feather', value: '1M+', label: 'Plants Delivered' },
  { id: 3, icon: 'globe', iconType: 'Feather', value: '30+', label: 'Countries Served' },
  { id: 4, icon: 'award', iconType: 'Feather', value: '4.9', label: 'Average Rating', hasStar: true },
  { id: 5, icon: 'shield', iconType: 'Feather', value: '100%', label: 'Secure Payments' },
  { id: 6, icon: 'headphones', iconType: 'Feather', value: '24/7', label: 'Customer Support' },
];

export default function WhyGardenersLove() {
  return (
    <View style={styles.container}>
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Why Gardeners <Text style={styles.headerTitleGreen}>Love GreenScape</Text>
<MaterialCommunityIcons name="leaf" size={22} color={COLORS.primary} style={styles.icon} />
        </Text>
      </View>

      {/* Gray Stats Card */}
      <View style={styles.card}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {STATS.map((stat, index) => (
            <View key={stat.id} style={styles.statItem}>
              {/* Icon */}
              <Feather name={stat.icon} size={22} color={COLORS.primary} style={styles.icon} />
              
              {/* Value */}
              <View style={styles.valueRow}>
                <Text style={styles.value}>{stat.value}</Text>
                {stat.hasStar && (
                  <MaterialCommunityIcons name="star" size={14} color="#FFC107" style={styles.starIcon} />
                )}
              </View>
              
              {/* Label */}
              <Text style={styles.label}>{stat.label}</Text>

              {/* Optional: Vertical Divider between items */}
              {index !== STATS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  headerTitleGreen: {
    color: COLORS.primary,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#F2F4F2', // Light gray/greenish background
    borderRadius: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minWidth: 110, // Ensures consistent width
    position: 'relative',
  },
  icon: {
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  starIcon: {
    marginLeft: 4,
    marginTop: 2,
  },
  label: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '500',
    textAlign: 'center',
  },
  divider: {
    position: 'absolute',
    right: 0,
    top: '20%',
    height: '60%',
    width: 1,
    backgroundColor: '#E0E0E0',
  },
});