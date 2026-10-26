import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, Image, TouchableOpacity, 
  ActivityIndicator, Platform, Linking 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.18.80:5000/api/banners'; 

const COLORS = {
  primary: '#2B7A4B',
  white: '#FFFFFF',
};

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        
        if (json.success && json.data && json.data.length > 0) {
          setBanners(json.data);
        }
      } catch (error) {
        console.warn("Banner fetch failed (Backend might be down):", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (banners.length === 0) return null;

  const banner = banners[0];

  const handlePress = () => {
    if (banner.linkType === 'Category' && banner.categoryId) {
      navigation.navigate('Categories', { categoryId: banner.categoryId });
    } else if (banner.linkType === 'Product' && banner.productId) {
      navigation.navigate('ProductDetails', { productId: banner.productId });
    } else if (banner.linkType === 'Custom' && banner.customUrl) {
      Platform.OS === 'web' ? window.open(banner.customUrl, '_blank') : Linking.openURL(banner.customUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        
        {/* Background Image */}
        <Image source={{ uri: banner.image }} style={styles.image} resizeMode="cover" />

        {/* Dark Overlay (Keeps text readable) */}
        <View style={styles.overlay} />

        {/* Top Right Badge (50% OFF) */}
        {banner.badge?.show && banner.badge.text ? (
          <View style={[styles.badge, { backgroundColor: banner.badge.bgColor }]}>
            <Text style={[styles.badgeText, { color: banner.badge.textColor }]}>
              {banner.badge.text}
            </Text>
          </View>
        ) : null}

        {/* 👇 CONTENT CONTAINER (Pushed to Bottom-Left) */}
        <View style={styles.bottomLeftContent}>
          
          {/* Dynamic Title from Database ("Big Sales") */}
          <Text style={styles.title}>{banner.title}</Text>
          
          <Text style={styles.description} numberOfLines={2}>
            Discover a wide range of premium plants that add freshness, beauty and life to your space.
          </Text>

          {/* Shop Now Button */}
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={{ marginTop: 10 }}>
            <View style={[styles.button, { backgroundColor: banner.button?.bgColor || COLORS.primary }]}>
              <Text style={[styles.buttonText, { color: banner.button?.textColor || COLORS.white }]}>
                {banner.button?.text || 'Shop Now'}
              </Text>
              <Feather name="chevron-right" size={16} color={banner.button?.textColor || COLORS.white} />
            </View>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { height: 250, justifyContent: 'center', alignItems: 'center' },
  container: { marginTop: 15, paddingHorizontal: 15 },
  card: {
    width: '100%',
    height: 220, // Reduced height since features are removed
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E8F5E9',
  },
  image: { width: '100%', height: '100%' },
  
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.4)' // Darker overlay for text readability
  },
  
  badge: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },

  // 👇 Pushes text and button to the bottom left
  bottomLeftContent: {
    position: 'absolute',
    bottom: 20, // Adjusted since features are gone
    left: 20,   
    right: 20,
    justifyContent: 'flex-end',
  },
  
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 12,
    color: '#F5F5F5',
    lineHeight: 16,
    marginBottom: 8,
    width: '75%', // Prevents text from going all the way across
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Button
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Left aligned
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: { fontSize: 13, fontWeight: 'bold', marginRight: 4 },
});