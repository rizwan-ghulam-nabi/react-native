import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Image, Platform, KeyboardAvoidingView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const COLORS = {
  primary: '#235A32',
  bgGreen: '#D9E6D8', // Light green background from your screenshot
  inputBg: '#E8EFE8',
  white: '#FFFFFF',
  textDark: '#111111',
  textLight: '#4A5D4A',
};

export default function JoinCommunity() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email.trim()) {
      alert(`Subscribed with: ${email}`);
      setEmail('');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        
        {/* Left Decorative Image */}
        <Image 
          source={{ uri: 'https://png.pngtree.com/png-vector/20230415/ourmid/pngtree-watercolor-tropical-flowers-png-image_6705759.png' }} 
          style={styles.leftImage} 
          resizeMode="contain"
        />

        {/* Right Decorative Image */}
        <Image 
          source={{ uri: 'https://png.pngtree.com/png-vector/20230415/ourmid/pngtree-gardening-tools-watercolor-png-image_6705764.png' }} 
          style={styles.rightImage} 
          resizeMode="contain"
        />

        {/* Main Content */}
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Join Our Gardening Community</Text>
          <Text style={styles.subtitle}>Get plant care tips, exclusive offers & new arrivals straight to your inbox.</Text>

          {/* Input and Button Row */}
          <View style={styles.formRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#889988"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleSubscribe} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>

          {/* Trust checkmarks */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Feather name="check" size={12} color={COLORS.primary} />
              <Text style={styles.trustText}>No spam, ever.</Text>
            </View>
            <View style={styles.trustItem}>
              <Feather name="check" size={12} color={COLORS.primary} />
              <Text style={styles.trustText}>Unsubscribe anytime</Text>
            </View>
          </View>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.bgGreen,
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  
  // Absolute Images
  leftImage: {
    position: 'absolute',
    left: -10,
    bottom: -10,
    width: 130,
    height: 130,
    opacity: 0.9,
  },
  rightImage: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 140,
    height: 140,
    opacity: 0.9,
  },

  // Content
  contentWrapper: {
    width: '100%',
    maxWidth: 500, // Keeps it looking good on Desktop/Web
    alignItems: 'center',
    zIndex: 2, // Ensures text stays above background images
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // Form
  formRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
  },
  input: {
    height: 45,
    paddingHorizontal: 15,
    fontSize: 13,
    color: COLORS.textDark,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Trust Badges
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '500',
  },
});