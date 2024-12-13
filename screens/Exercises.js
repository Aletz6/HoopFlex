import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Datos predefinidos
const predefinedRoutines = [
  {
    category: 'Dribble',
    exercises: [
      {
        id: '1',
        name: 'Dribble Basics',
        level: 'Beginner',
        duration: '15 min',
        steps: [
          { id: '1-1', name: 'Right Hand Dribble', sets: 2, reps: 20 },
          { id: '1-2', name: 'Left Hand Dribble', sets: 2, reps: 20 },
          { id: '1-3', name: 'Right Hand Low Dribble', sets: 2, reps: 20 },
          { id: '1-4', name: 'Left Hand Low Dribble', sets: 2, reps: 20 },
          { id: '1-5', name: 'Right Hand Pound Dribble', sets: 2, reps: 20 },
          { id: '1-6', name: 'Left Hand Pound Dribble', sets: 2, reps: 20 },
          { id: '1-7', name: 'Right Hand V Dribble', sets: 2, reps: 20 },
          { id: '1-8', name: 'Left Hand V Dribble', sets: 2, reps: 20 }
        ],
        message: 'Finish 1 set of each exercise without rest, one after the other, rest 2 minutes and finish the second set of each exercise to finish the workout.',
      },
      {
        id: '2',
        name: 'Dribble Control',
        level: 'Intermediate',
        duration: '25 min',
        steps: [
          { id: '2-1', name: 'Right Hand Pound In And Out Dribble', sets: 2, reps: 20 },
          { id: '2-2', name: 'Left Hand Pound In And Out Dribble', sets: 2, reps: 20 },
          { id: '2-3', name: '3 Dribbles And In Between Under Right Leg', sets: 2, reps: 20 },
          { id: '2-4', name: '3 Dribbles And In Between Under Left Leg', sets: 2, reps: 20 },
          { id: '2-5', name: 'In Between Infinity Dribble', sets: 2, reps: 20 },
          { id: '2-6', name: '3 Dribbles And Behind The Back', sets: 2, reps: 20 }
        ],
        message: 'Finish 1 set of each exercise without rest, one after the other, rest 2 minutes and finish the second set of each exercise to finish the workout.',
      },
      {
        id: '3',
        name: 'Advanced Moves',
        level: 'Advanced',
        duration: '35 min',
        steps: [
          { id: '3-1', name: 'Right Hand Pound In And Out Dribble', sets: 2, reps: 20 },
          { id: '3-2', name: 'Left Hand Pound In And Out Dribble', sets: 2, reps: 20 },
          { id: '3-3', name: 'Walking In Between', sets: 2, reps: 40 },
          { id: '3-4', name: 'Backwards Walking In Between', sets: 2, reps: 40 },
          { id: '3-5', name: 'Game Time Stop And Cross Both Sides', sets: 2, reps: 30 },
          { id: '3-6', name: 'Game Time Stop And Between Legs Both Sides', sets: 2, reps: 30 },
          { id: '3-7', name: 'Game Time Stop And Behind Back Both Sides', sets: 2, reps: 30 },
          { id: '3-8', name: 'Full Court Sprint Dribble', sets: 2, reps: 2 }
        ],
        message: 'Finish 1 set of each exercise without rest except last excercise, one after the other, rest 2 minutes and finish the second set of each exercise to finish the workout. Last excercise get creative, practice moves and only real game speed.',
      }
    ],
  },
  {
    category: 'Shooting',
    exercises: [
      {
        id: '1',
        name: 'Basic Shooting',
        level: 'Beginner',
        duration: '15 min',
        steps: [
          { id: '1-1', name: 'Under Basket Right Hand Lay', sets: 2, reps: 10 },
          { id: '1-2', name: 'Under Basket left Hand Lay', sets: 2, reps: 10 },
          { id: '1-3', name: 'Right Side First Line Bankshot', sets: 2, reps: 10 },
          { id: '1-4', name: 'Left Side First Line Bankshot', sets: 2, reps: 10 },
          { id: '1-5', name: 'Mid Range One Dribble Shot', sets: 2, reps: 8 },
          { id: '1-6', name: 'Free Throw line Shot', sets: 2, reps: 8 },
          { id: '1-7', name: 'Right Hand Lay Up', sets: 2, reps: 15 },
          { id: '1-8', name: 'Left Hand Lay Up', sets: 2, reps: 15 }
        ],
        message: 'Finish 1 set of each exercise without rest, one after the other, rest 2 minutes and finish the second set of each exercise to finish the workout. One rep is a made shot.',
      },
      {
        id: '2',
        name: 'Mid-Range Master',
        level: 'Intermediate',
        duration: '25 min',
        steps: [
          { id: '2-1', name: 'Free Throw Line Shot', sets: 2, reps: 20 },
          { id: '2-2', name: 'left Corner One Dribble Shot', sets: 2, reps: 20 },
          { id: '2-3', name: 'left Wing One Dribble Shot', sets: 2, reps: 20 },
          { id: '2-4', name: 'Right Wing One Dribble Shot', sets: 2, reps: 20 },
          { id: '2-5', name: 'Right Corner One Dribble Shot', sets: 2, reps: 20 },
          { id: '2-6', name: 'Throw Rebound Mid Range Shot', sets: 2, reps: 20 }
        ],
        message: 'Finish 1 set of each exercise without rest except last excercise, one after the other, rest 2 minutes and finish the second set of each exercise to finish the workout. Last excercise get creative, practice moves and only real game speed.',
      },
      {
        id: '3',
        name: 'Sniper',
        level: 'Advanced',
        duration: '35 min',
        steps: [
          { id: '3-1', name: 'Free Throw Line Shot', sets: 2, reps: 20 },
          { id: '3-2', name: 'Mid range Catch n Shoot', sets: 2, reps: 15 },
          { id: '3-3', name: 'Top Of Key 3-Point', sets: 2, reps: 5 },
          { id: '3-4', name: 'Left Corner 3-Point', sets: 2, reps: 5 },
          { id: '3-5', name: 'Right Corner 3-Point', sets: 2, reps: 5 },
          { id: '3-6', name: 'Step Back 3-Point', sets: 2, reps: 5 },
          { id: '3-7', name: 'Dribble Stop n Shoot Game Time', sets: 2, reps: 20 },
          { id: '3-8', name: 'Creative Catch n Shoot', sets: 2, reps: 20 }
        ],
        message: 'Finish 1 set of each exercise without rest except last excercise, one after the other, rest 2 minutes and finish the second set of each exercise to finish the workout. Last excercise get creative, practice moves and only real game speed.',
      }
    ],
  },
  {
    category: 'Agility',
    exercises: [
      {
        id: '1',
        name: 'Basic Agility',
        level: 'Beginner',
        duration: '15 min',
        steps: [
          { id: '1-1', name: 'Right Adductor Stretch T-Spine Rotation', sets: 3, reps: 10 },
          { id: '1-2', name: 'Left Adductor Stretch T-Spine Rotation', sets: 3, reps: 10 },
          { id: '1-3', name: 'WGS', sets: 3, reps: 12 },
          { id: '1-4', name: 'Lateral Lunge Complex', sets: 3, reps: 10 },
          { id: '1-5', name: 'Quick Lateral Hop', sets: 3, reps: 20 },
          { id: '1-6', name: 'Single Leg Lateral Hop', sets: 3, reps: 30 },
          { id: '1-7', name: 'Lateral Shuffle', sets: 3, reps: 15 },
          { id: '1-8', name: 'Half Court Suicides', sets: 3, reps: 6 }
        ],
        message: 'Finish 1 set of each exercise without rest, one after the other, rest 2 minutes and finish the second and third set of each exercise to finish the workout.',
      },
      {
        id: '2',
        name: 'Full Agility',
        level: 'Intermediate',
        duration: '25 min',
        steps: [
          { id: '2-1', name: 'Slow Jog Around Court', sets: 3, reps: 2 },
          { id: '2-2', name: 'Zigzag Cones with Direction Changes', sets: 3, reps: 20 },
          { id: '2-3', name: 'Ladder Quick Steps', sets: 3, reps: 20 },
          { id: '2-4', name: 'Defensive Slide Drill', sets: 3, reps: 20 },
          { id: '2-5', name: 'Four-Corner Drill', sets: 3, reps: 20 },
          { id: '2-6', name: 'T-Drill', sets: 3, reps: 20 }
        ],
        message: 'Finish 1 set of each exercise without rest, one after the other, rest 2 minutes and finish the second and third set of each exercise to finish the workout.',
      },
      {
        id: '3',
        name: 'Complete Burnout',
        level: 'Advanced',
        duration: '35 min',
        steps: [
          { id: '3-1', name: 'Ladder Quick Steps', sets: 3, reps: 20 },
          { id: '3-2', name: 'T-Drill', sets: 3, reps: 15 },
          { id: '3-3', name: 'Reaction Sprint Drill', sets: 3, reps: 5 },
          { id: '3-4', name: 'Figure-8 Cone Drill', sets: 3, reps: 5 },
          { id: '3-5', name: '3-Cone Reaction Chase', sets: 3, reps: 5 },
          { id: '3-7', name: 'Reactive Cone Sprint', sets: 3, reps: 20 },
          { id: '3-8', name: 'Full Court Sprint Suicides', sets: 2, reps: 20 }
        ],
        message: 'Finish 1 set of each exercise without rest except last excercise, one after the other, rest 2 minutes and finish the second and third set of each exercise to finish the workout.',
      }
    ],
  },

];


export default function Exercises() {
  const navigation = useNavigation();
  const [routines, setRoutines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    level: '',
    duration: '15',
    steps: [],
  });
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '' });

  // Cargar rutinas al inicio
  useEffect(() => {
    const loadRoutines = async () => {
      try {
        const storedCustomRoutines = await AsyncStorage.getItem('customRoutines');
        const customRoutines = storedCustomRoutines ? JSON.parse(storedCustomRoutines) : [];
        setRoutines([...predefinedRoutines, { category: 'Custom Routines', exercises: customRoutines }]);
      } catch (error) {
        console.error('Error loading routines:', error);
      }
    };
    loadRoutines();
  }, []);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setNewRoutine({ name: '', level: '', duration: '15', steps: [] });
    setNewExercise({ name: '', sets: '', reps: '' });
  };

  const addExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) {
      Alert.alert('Error', 'Please fill all fields for the exercise.');
      return;
    }

    setNewRoutine((prev) => ({
      ...prev,
      steps: [...prev.steps, { ...newExercise, id: `${Date.now()}` }],
    }));
    setNewExercise({ name: '', sets: '', reps: '' });
  };

  const saveRoutine = async () => {
    if (!newRoutine.name || !newRoutine.level || newRoutine.steps.length === 0) {
      Alert.alert('Error', 'Please fill all fields and add at least one exercise.');
      return;
    }

    try {
      const storedCustomRoutines = await AsyncStorage.getItem('customRoutines');
      const customRoutines = storedCustomRoutines ? JSON.parse(storedCustomRoutines) : [];
      const updatedCustomRoutines = [...customRoutines, { ...newRoutine, id: `${Date.now()}` }];

      await AsyncStorage.setItem('customRoutines', JSON.stringify(updatedCustomRoutines));
      setRoutines([...predefinedRoutines, { category: 'Custom Routines', exercises: updatedCustomRoutines }]);

      Alert.alert('Success', 'Routine saved successfully!');
      toggleForm(); // Cerrar el formulario y limpiar campos
    } catch (error) {
      console.error('Error saving routine:', error);
      Alert.alert('Error', 'Failed to save the routine.');
    }
  };

  const deleteCustomRoutine = async (id) => {
    try {
      const storedCustomRoutines = await AsyncStorage.getItem('customRoutines');
      const customRoutines = storedCustomRoutines ? JSON.parse(storedCustomRoutines) : [];
      const updatedRoutines = customRoutines.filter((routine) => routine.id !== id);
      await AsyncStorage.setItem('customRoutines', JSON.stringify(updatedRoutines));
  
      // Actualizar las rutinas mostradas
      setRoutines([...predefinedRoutines, { category: 'Custom Routines', exercises: updatedRoutines }]);
      Alert.alert('Success', 'Routine deleted successfully!');
    } catch (error) {
      console.error('Error deleting routine:', error);
      Alert.alert('Error', 'Failed to delete the routine.');
    }
  };

  const renderRoutine = ({ item, category }) => (
    <View style={styles.routineContainer}>
      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => navigation.navigate('TrainingDetails', { exercise: item })}
      >
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseLevel}>Level: {item.level}</Text>
        <Text style={styles.exerciseDuration}>{item.duration}</Text>
      </TouchableOpacity>
      {category === 'Custom Routines' && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteCustomRoutine(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <FlatList
        data={item.exercises}
        keyExtractor={(exercise) => exercise.id}
        renderItem={({ item: exercise }) =>
          renderRoutine({
            item: exercise,
            category: item.category,
          })
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'\n'}Exercises</Text>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.category}
        renderItem={renderCategory}
        contentContainerStyle={styles.listContainer}
      />
      {!showForm && (
        <TouchableOpacity style={styles.addButton} onPress={toggleForm}>
          <Text style={styles.addButtonText}>+ Create Routine</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Create New Routine</Text>
          <TextInput
            style={styles.input}
            placeholder="Routine Name"
            value={newRoutine.name}
            onChangeText={(text) => setNewRoutine((prev) => ({ ...prev, name: text }))}
          />
          <Text style={styles.subTitle}>Select Level</Text>
          <View style={styles.levelButtons}>
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  newRoutine.level === level && styles.levelButtonSelected,
                ]}
                onPress={() => setNewRoutine((prev) => ({ ...prev, level }))}
              >
                <Text style={styles.levelButtonText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.subTitle}>Set Duration</Text>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={60}
            step={5}
            value={parseInt(newRoutine.duration, 10)}
            onValueChange={(value) => setNewRoutine((prev) => ({ ...prev, duration: `${value} min` }))}
            minimumTrackTintColor="#e04dff"
            maximumTrackTintColor="#fff"
          />
          <Text style={styles.durationText}>Duration: {newRoutine.duration}</Text>

          <Text style={styles.subTitle}>Add Exercise</Text>
          <TextInput
            style={styles.input}
            placeholder="Exercise Name"
            value={newExercise.name}
            onChangeText={(text) => setNewExercise((prev) => ({ ...prev, name: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Sets"
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            value={newExercise.sets}
            onChangeText={(text) => setNewExercise((prev) => ({ ...prev, sets: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Reps"
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            value={newExercise.reps}
            onChangeText={(text) => setNewExercise((prev) => ({ ...prev, reps: text }))}
          />
          <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
            <Text style={styles.addButtonText}>Add Exercise</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.saveButton} onPress={saveRoutine}>
            <Text style={styles.saveButtonText}>Save Routine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={toggleForm}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    color: '#e04dff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  horizontalList: {
    paddingLeft: 10,
  },
  exerciseCard: {
    backgroundColor: '#1f1f1f',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  exerciseName: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  exerciseLevel: {
    fontSize: 14,
    color: '#e04dff',
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#e04dff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e04dff',
  },
  subTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  levelButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  levelButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e04dff',
  },
  levelButtonSelected: {
    backgroundColor: '#e04dff',
  },
  levelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  durationText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  addExerciseButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  routineContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 10, // Asegura que el botón esté debajo
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
});
