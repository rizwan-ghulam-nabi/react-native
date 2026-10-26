// pages/AllTipsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, TextInput, StatusBar 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const API_URL = 'http://192.168.18.80:5000/api/tips'; 

const COLORS = {
  primary: '#235A32',
  textDark: '#111111',
  textLight: '#666666',
  bgColor: '#F8F9F6',
  cardBg: '#FFFFFF',
  borderColor: '#E5E7EB',
};

export default function AllTipsScreen({ navigation }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();
        if (json.success) {
          setTips(json.data);
        }
      } catch (error) {
        console.warn("Error fetching tips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  // Filter tips based on search
  const filteredTips = tips.filter(tip => 
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9}
      // 👇 Navigates to the details screen with the specific ID
      onPress={() => navigation.navigate('TipDetails', { id: item._id })} 
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.cat}>{item.category}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.excerpt} numberOfLines={2}>{item.excerpt}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgColor} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Tips</Text>
        <View style={{ width: 24 }} /> {/* Spacer to center title */}
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search by title or category..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredTips}
          keyExtractor={(item, index) => item?._id || index.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.noResults}>No tips found matching "{searchQuery}"</Text>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgColor },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  searchWrapper: { paddingHorizontal: 20, paddingBottom: 15 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 45, 
    borderWidth: 1, 
    borderColor: COLORS.borderColor 
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textDark },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  noResults: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginTop: 20 },
  
  // Card Styles
  card: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 12, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: COLORS.borderColor, 
    overflow: 'hidden' 
  },
  image: { width: 100, height: 100, resizeMode: 'cover' },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  cat: { fontSize: 10, fontWeight: '800', color: COLORS.primary, marginBottom: 4, textTransform: 'uppercase' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
  excerpt: { fontSize: 11, color: COLORS.textLight, lineHeight: 16 }
});