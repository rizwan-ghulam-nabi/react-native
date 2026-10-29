
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, Platform, ImageBackground
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext'; 

const COLORS = {
  primary: '#1B4D2E', // Darker green matching the image
  leafGreen: '#689F38', // Lighter green for "Scape"
  textDark: '#111111', 
  textLight: '#666666',
  lightGreen: '#F3F9F4', 
  white: '#FFFFFF',
  bgDecor: '#F2F7F4' // Very light green for header background
};

export default function Header({
  cartCount = 0,
  searchQuery = '',
  setSearchQuery = () => {}
}) {
  const navigation = useNavigation();
  const { user } = useAuth(); 

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : null;

  return (
    <View style={styles.container}>
      {/* Decorative Background Leaves (Optional: replace URI with local asset) */}
      <ImageBackground 
        source={{ uri: 'https://img.freepik.com/free-vector/hand-drawn-tropical-leaves-background_23-2148097092.jpg' }} 
        style={styles.bgImage}
        imageStyle={{ opacity: 0.15, resizeMode: 'cover' }}
      >
        
        {/* TOP ROW: Menu, Logo, Icons */}
        <View style={styles.topRow}>
          
          {/* Left: Hamburger Menu */}
          <TouchableOpacity 
            style={styles.menuBtn}
            onPress={() => navigation.navigate('Categories')} // Change to your Drawer or Menu screen
          >
            <Feather name="menu" size={28} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Center: Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoTextRow}>
              <Text style={styles.logoTextMain}>Green</Text>
              <View style={styles.logoScapeWrapper}>
                <MaterialCommunityIcons 
                  name="leaf" 
                  size={20} 
                  color={COLORS.leafGreen} 
                  style={styles.logoLeaf} 
                />
                <Text style={styles.logoTextScape}>Scape</Text>
              </View>
            </View>
            <Text style={styles.tagline}>PLANTS • GARDEN • HOME</Text>
          </View>

          {/* Right: Search & Cart Icons */}
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('SearchTab')}>
              <Feather name="search" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
              <Feather name="shopping-cart" size={24} color={COLORS.primary} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{String(cartCount)}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgDecor,
    paddingTop: Platform.OS === 'android' ? 35 : 10, // Adjust for notch
    zIndex: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  bgImage: {
    width: '100%',
    paddingBottom: 15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  
  // Menu Button
  menuBtn: {
    padding: 5,
    width: 40, // Fixed width to balance center logo
  },

  // Logo Section
  logoContainer: { 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  logoTextRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  logoTextMain: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: COLORS.primary, 
    letterSpacing: -0.8 
  },
  logoScapeWrapper: {
    position: 'relative',
  },
  logoTextScape: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: COLORS.leafGreen, 
    letterSpacing: -0.8 
  },
  logoLeaf: {
    position: 'absolute',
    top: -16,
    right: 8,
    transform: [{ rotate: '15deg' }],
  },
  tagline: { 
    fontSize: 9, 
    fontWeight: '600', 
    color: COLORS.textLight, 
    letterSpacing: 2, 
    marginTop: 2,
    textTransform: 'uppercase',
  },

  // Icons Section
  iconsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15,
    width: 80, // Fixed width to balance center logo
    justifyContent: 'flex-end',
  },
  iconBtn: { 
    padding: 4, 
    position: 'relative' 
  },
  badge: { 
    position: 'absolute', 
    top: -2, 
    right: -4, 
    backgroundColor: COLORS.leafGreen, 
    borderRadius: 10, 
    width: 18, 
    height: 18, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: COLORS.bgDecor 
  },
  badgeText: { 
    color: COLORS.white, 
    fontSize: 9, 
    fontWeight: 'bold' 
  },
});