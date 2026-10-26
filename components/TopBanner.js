import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = { primary: '#235A32', white: '#FFFFFF' };

export default function TopBanner() {
  const translateX = useRef(new Animated.Value(0)).current;

  // The text we want to scroll
  const marqueeText = "Spring Sale is Live! Up to 40% OFF   •   Free Shipping Over 1000Rs   •   ";

  useEffect(() => {
    // Calculate how far to scroll based on the text length
    // (approx 7.5 pixels per character based on your font size)
    const textWidth = marqueeText.length * 7.5; 

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -textWidth,
        duration: textWidth * 40, // Controls the speed (higher = slower)
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [translateX]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.marqueeWrapper, { transform: [{ translateX }] }]}>
        {/* Render the text twice so it loops seamlessly */}
        <Text style={styles.text}>{marqueeText}</Text>
        <Text style={styles.text}>{marqueeText}</Text>
        <Text style={styles.text}>{marqueeText}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    height: 35,
    justifyContent: 'center',
    overflow: 'hidden', // Hides the text when it goes off-screen
  },
  marqueeWrapper: {
    flexDirection: 'row',
    width: width * 3, // Wide enough to hold the repeating text
  },
  text: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    width: 'auto',
  },
});