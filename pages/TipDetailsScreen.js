//  pages/TipDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, 
  TouchableOpacity, SafeAreaView, TextInput 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { useNavigation } from '@react-navigation/native'; // 👈 Import this

const API_URL = 'http://192.168.18.80:5000/api/tips'; 

export default function TipDetailsScreen({ route }) {
  // 👇 Get navigation directly using the hook
  const navigation = useNavigation(); 
  
  const id = route?.params?.id; 
  
  const [tip, setTip] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (id) {
      const fetchTipDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/${id}`);
          const json = await response.json();
          if (json.success && json.data) setTip(json.data);
          else setError(true);
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchTipDetails();
    } else {
      const fetchAllTips = async () => {
        try {
          const response = await fetch(API_URL);
          const json = await response.json();
          if (json.success && json.data) setTips(json.data);
          else setError(true);
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchAllTips();
    }
  }, [id]);

  // 👇 THE FIX: Use navigate instead of popToTop to guarantee it works
  const handleGoBack = () => {
    if (id) {
      navigation.goBack(); // If on a single post, go back to the list
    } else {
      navigation.navigate('MainTabs'); // If on the list, go back to Home
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#235A32" />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>Could not load data.</Text>
        <TouchableOpacity onPress={handleGoBack} style={{ marginTop: 20 }}>
          <Text style={{ color: '#235A32', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- RENDER SINGLE POST DETAILS ---
  if (id && tip) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: tip.image }} style={styles.image} />
            <TouchableOpacity style={styles.backBtn} onPress={handleGoBack}>
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{tip.category}</Text>
            </View>
            
            <Text style={styles.title}>{tip.title}</Text>
            
            <View style={styles.metaRow}>
              <Text style={styles.date}>
                {new Date(tip.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.date}>{tip.views || 0} views</Text>
            </View>
            
            <Markdown style={markdownStyles}>
              {tip.content || "No content available."}
            </Markdown>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- RENDER ALL POSTS WITH SEARCH BAR ---
  const filteredTips = tips.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9F6' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backIcon}>
          <Feather name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search tips..."
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        <Text style={styles.pageTitle}>All Gardening Tips</Text>
        
        {filteredTips.length === 0 ? (
          <Text style={styles.noResults}>No tips found matching "{searchQuery}"</Text>
        ) : (
          filteredTips.map((item) => (
            <TouchableOpacity 
              key={item._id} 
              style={styles.card} 
              activeOpacity={0.9}
              // 👇 Use navigate to ensure stack history is correct
              onPress={() => navigation.navigate('TipDetails', { id: item._id })}
            >
              <View style={styles.cardImageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardExcerpt} numberOfLines={2}>{item.excerpt}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... Keep all your existing styles exactly the same
  imageContainer: { width: '100%', height: 250, position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  backBtn: {
    position: 'absolute', top: 40, left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20,
  },
  contentContainer: { padding: 20 },
  categoryBadge: {
    backgroundColor: '#E8F5E9', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 10,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#235A32' },
  title: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 10, lineHeight: 32 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  date: { fontSize: 12, color: '#888' },
  dot: { fontSize: 12, color: '#888', marginHorizontal: 6 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F9F6',
  },
  backIcon: { marginRight: 15 },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 20 },
  noResults: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 20 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardImageContainer: { width: 120, height: 120 },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardInfo: { flex: 1, padding: 15, justifyContent: 'center' },
  cardCategory: { fontSize: 10, fontWeight: '700', color: '#235A32', marginBottom: 4, textTransform: 'uppercase' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#111', marginBottom: 6 },
  cardExcerpt: { fontSize: 11, color: '#666', lineHeight: 16 },
});

const markdownStyles = {
  body: { fontSize: 15, lineHeight: 24, color: '#333' },
  heading1: { fontSize: 22, fontWeight: 'bold', color: '#111', marginVertical: 10 },
  heading2: { fontSize: 18, fontWeight: 'bold', color: '#111', marginVertical: 10 },
  heading3: { fontSize: 16, fontWeight: 'bold', color: '#111', marginVertical: 10 },
  strong: { fontWeight: 'bold' },
};