// components/GradeningTips.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, 
  ActivityIndicator, Platform, Linking, Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_URL = 'http://192.168.18.80:5000/api/tips'; 

const COLORS = {
  primary: '#235A32', 
  textDark: '#111111',
  textLight: '#666666',
  cardBg: '#FFFFFF',
  borderColor: '#E5E7EB',
};

export default function GardeningTips({ navigation }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();
        if (json.success && json.data) {
          setTips(json.data);
        }
      } catch (error) {
        console.warn("Error fetching tips:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  if (loading) {
    return (
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gardening Tips & Inspiration</Text>
        <TouchableOpacity onPress={() => navigation?.navigate('AllTips')}>
          <Text style={styles.viewAllText}>View All Posts →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tips.map((tip) => (
          <TouchableOpacity 
            key={tip._id} 
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation?.navigate('TipDetails', { id: tip._id })}
          >
            <View style={styles.imageContainer}>
              {/* The Base64 string will render perfectly here */}
              <Image source={{ uri: tip.image }} style={styles.image} />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{tip.category}</Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>{tip.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={3}>{tip.excerpt}</Text>
              
              <View style={styles.readMoreRow}>
                <Text style={styles.readMoreText}>Read More</Text>
                <Feather name="arrow-right" size={12} color={COLORS.textDark} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Expert Card */}
        <View style={styles.expertCard}>
          <View style={styles.expertContent}>
            <Text style={styles.expertTitle}>Need Help Choosing?</Text>
            <Text style={styles.expertSubtitle}>Our plant experts are here for you!</Text>
            
            <View style={styles.checkList}>
              <View style={styles.checkItem}>
                <Feather name="check" size={14} color="#A3C4A9" />
                <Text style={styles.checkText}>Plant Recommendations</Text>
              </View>
              <View style={styles.checkItem}>
                <Feather name="check" size={14} color="#A3C4A9" />
                <Text style={styles.checkText}>Care Guidance</Text>
              </View>
              <View style={styles.checkItem}>
                <Feather name="check" size={14} color="#A3C4A9" />
                <Text style={styles.checkText}>Order Support</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.chatBtn}
            onPress={() => {
              const url = 'https://wa.me/1234567890'; 
              Platform.OS === 'web' ? window.open(url, '_blank') : Linking.openURL(url);
            }}
          >
            <Feather name="message-circle" size={16} color={COLORS.white} />
            <Text style={styles.chatBtnText}>Chat with Expert</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ... (Your styles remain exactly the same)
const styles = StyleSheet.create({
  container: { marginTop: 30, marginBottom: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  viewAllText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  scrollContent: { paddingHorizontal: 20, gap: 15, paddingBottom: 10 },
  card: {
    width: SCREEN_WIDTH * 0.75, backgroundColor: COLORS.cardBg,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.borderColor,
    overflow: 'hidden',
  },
  imageContainer: { height: 160, width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryBadge: {
    position: 'absolute', bottom: 12, left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  categoryText: { fontSize: 10, fontWeight: '700', color: COLORS.textDark },
  cardContent: { padding: 16 },
  cardTitle: {
    fontSize: 15, fontWeight: '800', color: COLORS.textDark,
    marginBottom: 8, lineHeight: 20,
  },
  cardDesc: {
    fontSize: 11, color: COLORS.textLight,
    lineHeight: 16, marginBottom: 16,
  },
  readMoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  readMoreText: { fontSize: 11, fontWeight: '700', color: COLORS.textDark },
  expertCard: {
    width: SCREEN_WIDTH * 0.75, backgroundColor: '#2F4F43',
    borderRadius: 12, padding: 20, justifyContent: 'space-between',
  },
  expertContent: { flex: 1 },
  expertTitle: { fontSize: 18, fontWeight: '800', color: COLORS.white, marginBottom: 6 },
  expertSubtitle: { fontSize: 12, color: '#D1E8D5', marginBottom: 20 },
  checkList: { gap: 10 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkText: { fontSize: 12, color: '#D1E8D5', fontWeight: '500' },
  chatBtn: {
    backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12, borderRadius: 8,
    marginTop: 20, gap: 8,
  },
  chatBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.white },
});