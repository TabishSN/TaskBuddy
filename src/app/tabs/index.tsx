import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFire, faClock, faDumbbell, faCalendar, faTrophy, faHeart, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Avatar } from '@kolking/react-native-avatar';

type RootStackParamList = {
  Index: {
    username: string;
    id: string;
  };
};

type IndexScreenRouteProp = RouteProp<RootStackParamList, 'Index'>;

interface Stats {
  workouts_completed: number;
  achievements_earned: number;
  current_streak: number;
}

const disciplines = [
  { id: 1, name: 'Boxing', icon: '🥊' },
  { id: 2, name: 'Brazilian Jiu-Jitsu', icon: '🥋' },
  { id: 3, name: 'Muay Thai', icon: '🏆' },
  { id: 4, name: 'Wrestling', icon: '🤼' },
  { id: 5, name: 'MMA', icon: '👊' },
  { id: 6, name: 'Kickboxing', icon: '🦵' },
];

const disciplineCategories = {
  'Boxing': [
    { id: 1, name: 'Technique Drills', icon: faFire },
    { id: 2, name: 'Conditioning', icon: faClock },
    { id: 3, name: 'Shadow Work', icon: faTrophy },
  ],
  'Brazilian Jiu-Jitsu': [
    { id: 1, name: 'Technique Drills', icon: faFire },
    { id: 2, name: 'Partner Drills', icon: faHeart },
    { id: 3, name: 'Strength Training', icon: faDumbbell },
  ],
  'Muay Thai': [
    { id: 1, name: 'Technique Drills', icon: faFire },
    { id: 2, name: 'Conditioning', icon: faClock },
    { id: 3, name: 'Partner Drills', icon: faHeart },
  ],
  'Wrestling': [
    { id: 1, name: 'Technique Drills', icon: faFire },
    { id: 2, name: 'Strength Training', icon: faDumbbell },
    { id: 3, name: 'Partner Drills', icon: faHeart },
  ],
  'MMA': [
    { id: 1, name: 'Technique Drills', icon: faFire },
    { id: 2, name: 'Conditioning', icon: faClock },
    { id: 3, name: 'Strength Training', icon: faDumbbell },
    { id: 4, name: 'Partner Drills', icon: faHeart },
  ],
  'Kickboxing': [
    { id: 1, name: 'Technique Drills', icon: faFire },
    { id: 2, name: 'Conditioning', icon: faClock },
    { id: 3, name: 'Shadow Work', icon: faTrophy },
  ],
};

const Index = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<Stats>({
    workouts_completed: 0,
    achievements_earned: 0,
    current_streak: 0
  });
  
  const route = useRoute<IndexScreenRouteProp>();
  const { username, id: userId } = route.params || {};

  useEffect(() => {
    if (userId) {
      fetchUserStats();
    }
  }, [userId]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get<{ success: boolean; stats: Stats }>(`http://204.236.195.55:8000/user-stats/${userId}`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const completeWorkout = async (workoutType: string) => {
    try {
      const response = await axios.post<{ success: boolean; stats: Stats }>('http://204.236.195.55:8000/complete-workout', {
        userId,
        workoutType
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  const getCategories = () => {
    if (!selectedDiscipline) return [];
    return disciplineCategories[selectedDiscipline as keyof typeof disciplineCategories] || [];
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Combat Training</Text>
            <Text style={styles.headerSubtitle}>Choose your discipline</Text>
          </View>
          <Avatar
            size={40}
            name={username || 'User'}
            style={{ backgroundColor: '#ff3b30' }}
          />
        </View>
        
        <View style={styles.searchBar}>
          <FontAwesomeIcon icon={faSearch} size={16} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.disciplinesScroll}
      >
        {disciplines.map((discipline) => (
          <TouchableOpacity
            key={discipline.id}
            style={[
              styles.disciplineCard,
              selectedDiscipline === discipline.name && styles.selectedDiscipline,
            ]}
            onPress={() => setSelectedDiscipline(discipline.name)}
          >
            <Text style={styles.disciplineIcon}>{discipline.icon}</Text>
            <Text style={styles.disciplineName}>{discipline.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>
          {selectedDiscipline ? `${selectedDiscipline} Training` : 'Select a Discipline'}
        </Text>
        <View style={styles.categoriesGrid}>
          {getCategories().map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard}
              onPress={() => completeWorkout(category.name)}
            >
              <FontAwesomeIcon icon={category.icon} size={20} color="#fff" />
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.workouts_completed}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.achievements_earned}</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.current_streak}</Text>
          <Text style={styles.statLabel}>Streaks</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#888',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  disciplinesScroll: {
    paddingHorizontal: 20,
  },
  disciplineCard: {
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    alignItems: 'center',
    width: 120,
  },
  selectedDiscipline: {
    backgroundColor: '#444',
    borderWidth: 2,
    borderColor: '#ff3b30',
  },
  disciplineIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  disciplineName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  categoryName: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#222',
    marginTop: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff3b30',
  },
  statLabel: {
    color: '#888',
    marginTop: 5,
  },
});

export default Index;