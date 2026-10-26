import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, Text, View, Animated, Platform 
} from 'react-native';

const BRANDS = [
  { id: 1, name: 'BURPEE', color: '#D32F2F', fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif', fontWeight: '900' },
  { id: 2, name: 'Espoma', color: '#2E7D32', fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif', fontStyle: 'italic', fontWeight: 'bold' },
  { id: 3, name: 'Proven Winners', color: '#111111', fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif', fontWeight: 'bold' },
  { id: 4, name: 'Vigoro', color: '#C62828', fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif', fontStyle: 'italic', fontWeight: 'bold' },
  { id: 5, name: 'Miracle-Gro', color: '#2E7D32', fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif', fontWeight: 'bold' },
  { id: 6, name: 'FISKARS', color: '#111111', fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif', fontWeight: '900' },
  { id: 7, name: 'Scotts', color: '#2E7D32', fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif', fontStyle: 'italic', fontWeight: 'bold' },
  { id: 8, name: 'GARDENA', color: '#EF6C00', fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif', fontWeight: '900' },
];

const DOUBLE_BRANDS = [...BRANDS, ...BRANDS];

export default function BrandScroller() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ONE_SET_WIDTH = BRANDS.length * 160; 

    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: -ONE_SET_WIDTH,
        duration: 25000, 
        useNativeDriver: Platform.OS !== 'web',
      })
    ).start();
  }, [animatedValue]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trusted by Top Brands</Text>
      </View>

      <View style={{ width: '100%', overflow: 'hidden' }}>
        <Animated.View
          style={[
            styles.scrollRow,
            { transform: [{ translateX: animatedValue }] }
          ]}
        >
          {DOUBLE_BRANDS.map((brand, index) => (
            <View key={`${brand.id}-${index}`} style={styles.brandItem}>
              <Text 
                style={[
                  styles.brandText, 
                  { 
                    color: brand.color, 
                    fontFamily: brand.fontFamily,
                    fontWeight: brand.fontWeight,
                    fontStyle: brand.fontStyle || 'normal'
                  }
                ]}
              >
                {brand.name}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5', 
    paddingVertical: 30,
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
  },
  scrollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    width: 160 * 16, 
  },
  brandItem: {
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 20,
  },
});