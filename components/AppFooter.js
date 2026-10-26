import React from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, Linking, 
  Platform, useWindowDimensions 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  bgDark: '#1A3323', 
  white: '#FFFFFF',
  textLight: '#A3B8A8',
  borderColor: '#2E4F38',
};

export default function AppFooter({ navigation }) { // 👈 Added navigation prop
  const { width } = useWindowDimensions(); 
  const isMobile = width < 768; 

  const openLink = (url) => {
    Platform.OS === 'web' ? window.open(url, '_blank') : Linking.openURL(url);
  };

  // 👇 Function to handle navigation to the policy pages
  const handlePolicyPress = (title) => {
    navigation.navigate('PolicyScreen', { title });
  };

  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        
        {/* TOP SECTION (Brand & Socials) */}
        <View style={styles.topSection}>
          <View style={styles.colBrand}>
            <View style={styles.logoRow}>
              <MaterialCommunityIcons name="leaf" size={24} color="#8BC34A" />
              <Text style={styles.logoText}>GreenScape</Text>
            </View>
            <Text style={styles.tagline}>Grow. Nurture. Thrive.</Text>
            <Text style={styles.brandDesc}>
              Your trusted online store for premium plants, tools, and outdoor essentials. 
              Everything you need for a beautiful garden.
            </Text>
            
            {/* Social Icons */}
            <View style={styles.socialRow}>
              {['facebook', 'instagram', 'twitter', 'youtube'].map((icon, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={styles.socialBtn} 
                  onPress={() => openLink('https://google.com')}
                >
                  <Feather name={icon} size={18} color={COLORS.white} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* BOTTOM SECTION (Copyright & Legal Links) */}
        <View style={[
          styles.bottomSection, 
          { flexDirection: isMobile ? 'column' : 'row' }
        ]}>
          
          <Text style={[
            styles.copyright, 
            { marginBottom: isMobile ? 15 : 0 } 
          ]}>
            © {new Date().getFullYear()} GreenScape. All rights reserved.
          </Text>
          
          <View style={[
            styles.legalRow, 
            { justifyContent: isMobile ? 'center' : 'flex-end' }
          ]}>
            {['Privacy Policy', 'Terms & Conditions', 'Shipping Policy', 'Refund Policy'].map((link, i) => (
              <TouchableOpacity 
                key={i} 
                style={{ marginBottom: isMobile ? 8 : 0 }}
                onPress={() => handlePolicyPress(link)} // 👈 Added onPress here
              >
                <Text style={styles.legalText}>{link}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: COLORS.bgDark,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: -30, 
  },
  container: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  topSection: {
    marginBottom: 30,
  },
  colBrand: {
    maxWidth: 400, 
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 10,
    color: '#8BC34A', 
    fontWeight: '600',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  brandDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    alignItems: 'center', 
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    width: '100%',
  },
  copyright: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  legalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  legalText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});