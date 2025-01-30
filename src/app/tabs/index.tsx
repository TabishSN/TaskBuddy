import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFire, faClock, faDumbbell, faCalendar, faTrophy, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useRoute, RouteProp } from '@react-navigation/native';

// Define proper types for route params and API responses
type RootStackParamList = {
  Index: {
    username: string;
    id: string;
  };
};

type IndexScreenRouteProp = RouteProp<RootStackParamList, 'Index'>;

interface ApiResponse<T> {
  success: boolean;
  stats: T;
  message?: string;
}

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

const workoutCategories = [
  { id: 1, name: 'Technique Drills', icon: faFire },
  { id: 2, name: 'Conditioning', icon: faClock },
  { id: 3, name: 'Strength Training', icon: faDumbbell },
  { id: 4, name: 'Flexibility', icon: faCalendar },
  { id: 5, name: 'Shadow Work', icon: faTrophy },
  { id: 6, name: 'Partner Drills', icon: faHeart },
];

const Index = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({
    workouts_completed: 0,
    achievements_earned: 0,
    current_streak: 0
  });
  
  const route = useRoute<IndexScreenRouteProp>();
  const { id: userId } = route.params;

  useEffect(() => {
    if (userId) {
      fetchUserStats();
    }
  }, [userId]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get<ApiResponse<Stats>>(`http://204.236.195.55:8000/user-stats/${userId}`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const completeWorkout = async (workoutType: string) => {
    try {
      const response = await axios.post<ApiResponse<Stats>>('http://204.236.195.55:8000/complete-workout', {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Combat Training</Text>
        <Text style={styles.headerSubtitle}>Choose your discipline</Text>
      </View>

      <View style={styles.disciplinesGrid}>
        {disciplines.map((discipline) => (
          <TouchableOpacity
            key={discipline.id}
            style={[
              styles.disciplineCard,
              selectedDiscipline === discipline.id && styles.selectedDiscipline,
            ]}
            onPress={() => setSelectedDiscipline(discipline.id)}
          >
            <Text style={styles.disciplineIcon}>{discipline.icon}</Text>
            <Text style={styles.disciplineName}>{discipline.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Training Categories</Text>
        <View style={styles.categoriesGrid}>
          {workoutCategories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard}
              onPress={() => completeWorkout(category.name)}
            >
              <FontAwesomeIcon icon={category.icon} size={24} color="#fff" />
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
  disciplinesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  disciplineCard: {
    width: '48%',
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  selectedDiscipline: {
    backgroundColor: '#444',
    borderWidth: 2,
    borderColor: '#ff3b30',
  },
  disciplineIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  disciplineName: {
    color: '#fff',
    fontSize: 16,
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