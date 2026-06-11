import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomePage() {
  const [trainingLogs, setTrainingLogs] = useState([]);

  // Cargar los registros desde AsyncStorage
  const loadLogs = async () => {
    try {
      const logs = await AsyncStorage.getItem('trainingLogs');
      setTrainingLogs(logs ? JSON.parse(logs) : []);
    } catch (error) {
      console.error('Error loading training logs:', error);
    }
  };

  // Actualizar los registros al enfocar la pantalla
  useFocusEffect(
    React.useCallback(() => {
      loadLogs();
    }, [])
  );

  const deleteLog = async (index) => {
    try {
      const updatedLogs = trainingLogs.filter((_, i) => i !== index);
      setTrainingLogs(updatedLogs);
      await AsyncStorage.setItem('trainingLogs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error deleting training log:', error);
    }
  };

  const confirmDeleteLog = (index) => {
    Alert.alert(
      'Delete Training',
      'Are you sure you want to delete this training log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteLog(index),
        },
      ]
    );
  };

  const renderLog = ({ item, index }) => (
    <View style={styles.logCard}>
      <View>
        <Text style={styles.logName}>{item.name}</Text>
        <Text style={styles.logDetails}>Date: {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.logDetails}>Time: {item.duration}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteLog(index)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{"\n"}HoopFlex</Text>
        <Text style={styles.headerSubtitle}>Track your progress and beat your best!</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Training Logs</Text>
        {trainingLogs.length > 0 ? (
          <FlatList
            data={trainingLogs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLog}
            contentContainerStyle={styles.logsContainer}
          />
        ) : (
          <Text style={styles.noLogsText}>No trainings completed yet.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  headerTitle: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#b0b0b0',
    marginTop: 10,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  logsContainer: {
    paddingBottom: 20,
  },
  logCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  logName: {
    fontSize: 18,
    color: '#e04dff',
    fontWeight: '600',
    marginBottom: 5,
  },
  logDetails: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    elevation: 3,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  noLogsText: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    marginTop: 30,
  },
});

