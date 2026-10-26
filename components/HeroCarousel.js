
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, Dimensions 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// CONFIGURATION
const PADDING_HORIZONTAL = 20;
const GAP = 15;
const SLIDE_WIDTH = SCREEN_WIDTH - (PADDING_HORIZONTAL * 2);
const SNAP_INTERVAL = SLIDE_WIDTH + GAP;

const COLORS = { primary: '#235A32', white: '#FFFFFF' };

// 👇 LOCAL IMAGES (Make sure hero-section folder exists)
const heroCarouselData = [
  {
    id: '1',
    title: 'Bring Nature to\nYour Home',
    desc: 'Fresh plants, stylish pots and garden essentials — all in one place.',
    img: require('../assets/hero-section/hero1.png'), 
  },
  {
    id: '2',
    title: 'Perfect Plants\nfor Every Space',
    desc: 'Indoor, outdoor, vertical or balcony — find the right plants.',
    img: require('../assets/hero-section/hero2.jpg'), 
  },
  {
    id: '3',
    title: 'Grow Your Own\nUrban Jungle',
    desc: 'Transform your home into a green oasis with our exotic collection.',
    img: require('../assets/hero-section/hero3.jpg'), 
  },
  {
    id: '4',
    title: 'Grow Your Own\nUrban Jungle',
    desc: 'Transform your home into a green oasis with our exotic collection.',
    img: require('../assets/hero-section/hero4.jpg'), 
  }
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Auto-scroll Logic
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= heroCarouselData.length) nextIndex = 0;
      
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * SNAP_INTERVAL,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleDotPress = (index) => {
    setActiveIndex(index);
    flatListRef.current?.scrollToOffset({
      offset: index * SNAP_INTERVAL,
      animated: true,
    });
  };

  // Render each slide
  const renderItem = ({ item }) => {
    // 👇 THIS LINE IS THE MAGIC FIX
    // It checks if the image is a URL (string) or a local file (number).
    const imageSource = typeof item.img === 'string' ? { uri: item.img } : item.img;

    return (
      <View style={styles.heroSlide}>
        {/* 👇 USE imageSource HERE */}
        <Image source={imageSource} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        
        {/* Premium Pill Discount Badge */}
        <View style={styles.discountBadge}>
          <MaterialCommunityIcons name="leaf" size={14} color={COLORS.primary} />
          <Text style={styles.discountTitle}>40% OFF</Text>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroTitleTop}>{item.title.split('\n')[0]}</Text>
          <Text style={styles.heroTitleBottom}>{item.title.split('\n')[1]}</Text>
          <Text style={styles.heroDesc}>{item.desc}</Text>
          
          <TouchableOpacity style={styles.heroBtn} activeOpacity={0.8}>
            <Text style={styles.heroBtnText}>Shop Now</Text>
            <Feather name="arrow-right" size={14} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={heroCarouselData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        ref={flatListRef}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
      />

      {/* Interactive Pagination Dots */}
      <View style={styles.paginationContainer}>
        {heroCarouselData.map((_, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleDotPress(index)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
          >
            <View 
              style={[
                styles.paginationDot, 
                activeIndex === index && styles.paginationDotActive
              ]} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: { marginTop: 20 },
  
  scrollContent: { 
    paddingHorizontal: PADDING_HORIZONTAL, 
    gap: GAP, 
  },
  
  heroSlide: { 
    width: SLIDE_WIDTH, 
    height: 240, 
    borderRadius: 24, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  
  discountBadge: { 
    position: 'absolute', 
    top: 16, 
    right: 16, 
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    gap: 6 
  },
  discountTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },

  heroContent: { position: 'absolute', bottom: 24, left: 24, right: 24 },
  heroTitleTop: { color: '#E0E0E0', fontSize: 18, fontWeight: '600', marginBottom: 2 },
  heroTitleBottom: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', fontStyle: 'italic', marginBottom: 12, lineHeight: 38 },
  heroDesc: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, marginBottom: 18, lineHeight: 18, width: '85%' },
  
  heroBtn: { 
    backgroundColor: COLORS.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 12, 
    alignSelf: 'flex-start', 
    gap: 8 
  },
  heroBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  
  paginationContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 15,
    gap: 6 
  },
  paginationDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#E0E0E0',
  },
  paginationDotActive: { 
    width: 24, 
    backgroundColor: COLORS.primary,
  },
});