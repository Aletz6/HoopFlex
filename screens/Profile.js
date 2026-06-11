import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth'; 
import { auth } from '../firebaseConfig'; 

export default function Profile({ navigation }) {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    photo: null,
  });
  const [bestTimes, setBestTimes] = useState({});

  // cerrar sesión
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged Out', 'You have been logged out.');
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Error signing out:', error.message);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  // Cargar datos del perfil y mejores tiempos al recibir enfoque
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const storedProfile = await AsyncStorage.getItem('userProfile');
          if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile);

            // Verificar si la foto es válida
            if (parsedProfile.photo) {
              const fileInfo = await FileSystem.getInfoAsync(parsedProfile.photo);
              if (!fileInfo.exists) {
                parsedProfile.photo = null;
              }
            }

            setProfile(parsedProfile);
          }

          // Cargar mejores tiempos del Training Log
          const trainingLogs = await AsyncStorage.getItem('trainingLogs');
          if (trainingLogs) {
            calculateBestTimes(JSON.parse(trainingLogs));
          }
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };

      loadData();
    }, [])
  );

  // Calcular los mejores tiempos por entrenamiento
  const calculateBestTimes = (logs) => {
    const times = {};
    logs.forEach((log) => {
      const { name, duration } = log;
      const timeInSeconds = convertTimeToSeconds(duration);

      if (!times[name] || timeInSeconds < times[name]) {
        times[name] = timeInSeconds;
      }
    });

    // Convertir los mejores tiempos de nuevo a formato mm:ss
    const formattedTimes = Object.keys(times).reduce((acc, key) => {
      acc[key] = convertSecondsToTime(times[key]);
      return acc;
    }, {});

    setBestTimes(formattedTimes);
  };

  // Convertir tiempo en formato mm:ss a segundos
  const convertTimeToSeconds = (time) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Convertir segundos a formato mm:ss
  const convertSecondsToTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Guardar datos del perfil en AsyncStorage
  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Camera access is needed to take a profile picture.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const photoUri = result.assets[0].uri;
        const newPath = `${FileSystem.documentDirectory}profile-photo.jpg`;

        // Mover la imagen al sistema de archivos
        await FileSystem.moveAsync({
          from: photoUri,
          to: newPath,
        });

        // Actualizar el estado local inmediatamente
        setProfile((prevProfile) => ({ ...prevProfile, photo: newPath }));

        // Guardar los cambios en AsyncStorage
        const updatedProfile = { ...profile, photo: newPath };
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));

        Alert.alert('Success', 'Profile photo updated!');
      }
    } catch (error) {
      console.error('Error handling image:', error);
      Alert.alert('Error', 'An error occurred while updating the photo.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{"\n"}Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        <View style={styles.photoContainer}>
          {profile.photo ? (
            <Image
              source={{ uri: `${profile.photo}?timestamp=${new Date().getTime()}` }}
              style={styles.photo}
            />
          ) : (
            <Text style={styles.photoPlaceholder}>Tap to add a photo</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
        />

        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          keyboardType="numeric"
          value={profile.age}
          onChangeText={(text) => setProfile({ ...profile, age: text })}
        />

        <Text style={styles.label}>Height (cm):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your height"
          keyboardType="numeric"
          value={profile.height}
          onChangeText={(text) => setProfile({ ...profile, height: text })}
        />

        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your weight"
          keyboardType="numeric"
          value={profile.weight}
          onChangeText={(text) => setProfile({ ...profile, weight: text })}
        />
      </View>

      <Button title="Save Profile" onPress={saveProfile} color="#4CAF50" />
      
      <View style={styles.logOutButtonContainer}>
        <TouchableOpacity style={styles.logOutButton} onPress={handleSignOut}>
          <Text style={styles.logOutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bestTimesContainer}>
        <Text style={styles.sectionTitle}>Best Times</Text>
        {Object.keys(bestTimes).length > 0 ? (
          Object.entries(bestTimes).map(([exercise, time]) => (
            <Text key={exercise} style={styles.bestTime}>
              {exercise}: {time}
            </Text>
          ))
        ) : (
          <Text style={styles.noBestTimes}>No best times recorded yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#e04dff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e04dff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: '#ffffff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e04dff',
    marginBottom: 15,
    fontSize: 16,
  },
  logOutButtonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  logOutButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logOutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bestTimesContainer: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#1f1f1f',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bestTime: {
    fontSize: 16,
    color: '#e04dff',
    marginBottom: 5,
    textAlign: 'center',
  },
  noBestTimes: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
});
