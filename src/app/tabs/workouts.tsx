import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

// Define types for the workout video structure
interface WorkoutVideo {
  title: string;
  url: string;
}

interface WorkoutCategory {
  [key: string]: WorkoutVideo[];
}

interface WorkoutVideos {
  [key: string]: WorkoutCategory;
}

// Workout videos organized by discipline and category
const workoutVideos: WorkoutVideos = {
  'Boxing': {
    'Technique Drills': [
      { title: 'Basic Boxing Combinations', url: 'https://www.youtube.com/watch?v=kKDZuaThvYE' },
      { title: 'Boxing Footwork Drills', url: 'https://www.youtube.com/watch?v=VNqNnUJVcVs' }
    ],
    'Conditioning': [
      { title: 'Boxing HIIT Workout', url: 'https://www.youtube.com/watch?v=ZYUNz_Q8KEU' },
      { title: 'Heavy Bag Conditioning', url: 'https://www.youtube.com/watch?v=kqZjV5hIChw' }
    ],
    'Shadow Work': [
      { title: 'Shadow Boxing Basics', url: 'https://www.youtube.com/watch?v=q1NZZn4WqGw' },
      { title: 'Advanced Shadow Boxing', url: 'https://www.youtube.com/watch?v=166TzD_8gZw' }
    ]
  },
  'Brazilian Jiu-Jitsu': {
    'Technique Drills': [
      { title: 'BJJ Guard Passes', url: 'https://www.youtube.com/watch?v=iZDQ0-Zbpt8' },
      { title: 'Submission Fundamentals', url: 'https://www.youtube.com/watch?v=P_6D-e7thf4' }
    ],
    'Partner Drills': [
      { title: 'Guard Retention Drills', url: 'https://www.youtube.com/watch?v=Hy0a6Ry0Fks' },
      { title: 'Flow Rolling Basics', url: 'https://www.youtube.com/watch?v=_JmhIIhKjPM' }
    ]
  },
  'Muay Thai': {
    'Technique Drills': [
      { title: 'Basic Muay Thai Combos', url: 'https://www.youtube.com/watch?v=HQZKHhvxXaQ' },
      { title: 'Elbow & Knee Techniques', url: 'https://www.youtube.com/watch?v=JN0YY_6hs5k' }
    ],
    'Conditioning': [
      { title: 'Muay Thai HIIT', url: 'https://www.youtube.com/watch?v=Qc0PxL0Tl9k' },
      { title: 'Heavy Bag Drills', url: 'https://www.youtube.com/watch?v=vBl-F6VwCP4' }
    ]
  },
  'Wrestling': {
    'Technique Drills': [
      { title: 'Basic Takedowns', url: 'https://www.youtube.com/watch?v=j_BkUZ3wOQA' },
      { title: 'Wrestling Shots', url: 'https://www.youtube.com/watch?v=CWknAswBVpo' }
    ],
    'Strength Training': [
      { title: 'Wrestling Strength', url: 'https://www.youtube.com/watch?v=0V0YV8Yk9Eg' },
      { title: 'Core for Wrestling', url: 'https://www.youtube.com/watch?v=DHvIhvZ_Yg4' }
    ]
  }
};

export default function Workouts() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<keyof WorkoutVideos | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const openVideo = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Training Videos</Text>
      
      {/* Disciplines */}
      <View style={styles.disciplinesContainer}>
        {Object.keys(workoutVideos).map((discipline) => (
          <TouchableOpacity
            key={discipline}
            style={[
              styles.disciplineButton,
              selectedDiscipline === discipline && styles.selectedButton
            ]}
            onPress={() => {
              setSelectedDiscipline(discipline as keyof WorkoutVideos);
              setSelectedCategory(null);
            }}
          >
            <Text style={styles.buttonText}>{discipline}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categories */}
      {selectedDiscipline && (
        <View style={styles.categoriesContainer}>
          {Object.keys(workoutVideos[selectedDiscipline]).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedButton
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.buttonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Videos */}
      {selectedDiscipline && selectedCategory && (
        <View style={styles.videosContainer}>
          {workoutVideos[selectedDiscipline][selectedCategory].map((video, index) => (
            <TouchableOpacity
              key={index}
              style={styles.videoCard}
              onPress={() => openVideo(video.url)}
            >
              <FontAwesomeIcon icon={faPlay} size={24} color="#ff3b30" />
              <Text style={styles.videoTitle}>{video.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
  },
  disciplinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  disciplineButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  videosContainer: {
    gap: 15,
  },
  videoCard: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
});