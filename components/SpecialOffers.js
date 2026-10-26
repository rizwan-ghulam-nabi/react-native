import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const COLORS = {
  primary: '#235A32',
  textDark: '#111111',
  textLight: '#888888',
  white: '#FFFFFF',
};

// 👇 Replace these with your own images or local requires
const OFFERS = [
  {
    id: '1',
    title: 'New Arrivals',
    subtitle: 'Fresh plants & tools just for your garden.',
    buttonText: 'Explore Now',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop',
    overlayColor: 'rgba(0,0,0,0.4)', // Dark overlay for text readability
  },
  {
    id: '2',
    title: 'Seasonal Sale',
    subtitle: 'Get up to 40% OFF on selected gardening items.',
    buttonText: 'Shop Sale',
    image: 'https://images.unsplash.com/photo-1416879598555-220b85293297?q=80&w=800&auto=format&fit=crop',
    overlayColor: 'rgba(35, 90, 50, 0.7)', // Green tinted overlay (like the middle card)
  },
  {
    id: '3',
    title: 'Garden Essentials',
    subtitle: 'Everything you need for growing a beautiful garden.',
    buttonText: 'Shop Essentials',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop',
    overlayColor: 'rgba(0,0,0,0.5)',
  },
];

export default function SpecialOffers({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Special Offers</Text>
          <Text style={styles.subtitle}>Discover our hand-picked deals just for you</Text>
        </View>
      </View>

      {/* Horizontal Scroll of Offers */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {OFFERS.map((offer) => (
          <TouchableOpacity 
            key={offer.id} 
            activeOpacity={0.9}
            style={styles.cardWrapper}
            onPress={() => console.log('Navigate to offer:', offer.title)}
          >
            <ImageBackground 
              source={{ uri: offer.image }} 
              style={styles.cardImage}
              imageStyle={{ borderRadius: 16 }} // Rounds the image corners
            >
              {/* Overlay to make text readable */}
              <View style={[styles.overlay, { backgroundColor: offer.overlayColor }]} />
              
              {/* Card Content */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{offer.title}</Text>
                <Text style={styles.cardSubtitle}>{offer.subtitle}</Text>
                
                {/* White Button */}
                <View style={styles.button}>
                  <Text style={styles.buttonText}>{offer.buttonText}</Text>
                  <Feather name="arrow-right" size={14} color={COLORS.primary} />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 15,
    paddingBottom: 10,
  },
  cardWrapper: {
    width: 280,
    height: 160,
    // Shadow for iOS and Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  cardContent: {
    padding: 20,
    alignItems: 'flex-start', // Aligns everything to the left
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 15,
    width: '85%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});