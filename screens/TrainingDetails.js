import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TrainingDetails({ route, navigation }) {
  const { exercise } = route.params;

  const [time, setTime] = useState(0); // Cronómetro en segundos
  const [isRunning, setIsRunning] = useState(false); // Estado del cronómetro

  // Manejar el cronómetro
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Guardar el entrenamiento en AsyncStorage
  const saveTrainingLog = async () => {
    try {
      const log = {
        name: exercise.name,
        date: new Date().toISOString(),
        duration: formatTime(time),
      };

      const existingLogs = await AsyncStorage.getItem('trainingLogs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(log);

      await AsyncStorage.setItem('trainingLogs', JSON.stringify(logs));
      console.log('Training saved:', log);
    } catch (error) {
      console.error('Error saving training log:', error);
    }
  };

  // Renderizar cada paso
  const renderStep = ({ item }) => (
    <View style={styles.stepCard}>
      <Text style={styles.stepName}>{item.name}</Text>
      <Text style={styles.stepDetails}>Sets: {item.sets} | Reps: {item.reps}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'\n'}{exercise.name}</Text>
      <Text style={styles.text}>Level: {exercise.level}</Text>
      <Text style={styles.text}>Duration: {exercise.duration}</Text>
      <Text style={styles.timer}>Time: {formatTime(time)}</Text>

      <FlatList
        data={exercise.steps}
        keyExtractor={(item) => item.id}
        renderItem={renderStep}
        contentContainerStyle={styles.stepsList}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.completeButton]}
        onPress={async () => {
          setIsRunning(false); 
          await saveTrainingLog(); 
          Alert.alert('Training Completed', `You completed this training in ${formatTime(time)}!`);
          navigation.goBack(); // Volver a la pantalla anterior
        }}
      >
        <Text style={styles.buttonText}>Complete Training</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#e04dff',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  timer: {
    fontSize: 36,
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  stepsList: {
    paddingBottom: 20,
  },
  stepCard: {
    backgroundColor: '#1f1f1f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  stepName: {
    fontSize: 16,
    color: '#e04dff',
    marginBottom: 5,
  },
  stepDetails: {
    fontSize: 14,
    color: '#fff',
  },
  button: {
    backgroundColor: '#e04dff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
