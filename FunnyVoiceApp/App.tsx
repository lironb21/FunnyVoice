import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingSize, setRecordingSize] = useState(0);
  
  // Animation values
  const bounceAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      // Start recording timer
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        setRecordingSize(prev => prev + Math.floor(Math.random() * 10) + 5); // Simulate file size increase
      }, 1000);
      
      // Start animations
      startRecordingAnimations();
    } else {
      // Stop animations
      stopRecordingAnimations();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecordingAnimations = () => {
    // Bouncing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopRecordingAnimations = () => {
    bounceAnim.setValue(1);
    rotateAnim.setValue(0);
    scaleAnim.setValue(1);
  };

  const handlePressIn = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setRecordingSize(0);
  };

  const handlePressOut = () => {
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>FunnyVoice</Text>
        <Text style={styles.subtitle}>¡Grabar es divertido!</Text>
      </View>

      {/* Main Recording Area */}
      <View style={styles.mainArea}>
        {/* Mexican Character */}
        <Animated.View 
          style={[
            styles.characterContainer,
            {
              transform: [
                { scale: Animated.multiply(bounceAnim, scaleAnim) },
                { rotate: spin }
              ]
            }
          ]}
        >
          <View style={styles.character}>
            {/* Sombrero */}
            <View style={styles.sombrero}>
              <View style={styles.sombreroTop} />
              <View style={styles.sombreroBrim} />
            </View>
            
            {/* Face */}
            <View style={styles.face}>
              {/* Eyes */}
              <View style={styles.eyes}>
                <View style={[styles.eye, styles.eyeLeft]} />
                <View style={[styles.eye, styles.eyeRight]} />
              </View>
              
              {/* Mustache */}
              <View style={styles.mustache}>
                <View style={styles.mustacheLeft} />
                <View style={styles.mustacheRight} />
              </View>
              
              {/* Mouth */}
              <View style={[styles.mouth, isRecording && styles.mouthOpen]} />
            </View>
            
            {/* Body */}
            <View style={styles.body}>
              <View style={styles.poncho}>
                <View style={styles.ponchoLeft} />
                <View style={styles.ponchoRight} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Recording Button */}
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingActive]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isRecording ? "stop" : "mic"} 
            size={48} 
            color="#fff" 
          />
        </TouchableOpacity>

        {/* Instructions */}
        <Text style={styles.instructions}>
          {isRecording ? "¡Habla ahora! Suelta para parar" : "Presiona y mantén para grabar"}
        </Text>
      </View>

      {/* Recording Stats */}
      {isRecording && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(recordingTime)}</Text>
            <Text style={styles.statLabel}>Tiempo</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatSize(recordingSize)}</Text>
            <Text style={styles.statLabel}>Tamaño</Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>🎵 Tu voz, tu estilo mexicano 🎵</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#f4f4f4',
    fontStyle: 'italic',
  },
  mainArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  characterContainer: {
    marginBottom: 40,
  },
  character: {
    alignItems: 'center',
  },
  sombrero: {
    alignItems: 'center',
    marginBottom: 10,
  },
  sombreroTop: {
    width: 80,
    height: 40,
    backgroundColor: '#8b4513',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#654321',
  },
  sombreroBrim: {
    width: 120,
    height: 20,
    backgroundColor: '#8b4513',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#654321',
  },
  face: {
    width: 100,
    height: 100,
    backgroundColor: '#ffdbac',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#e6b17a',
  },
  eyes: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  eye: {
    width: 12,
    height: 12,
    backgroundColor: '#2c1810',
    borderRadius: 6,
    marginHorizontal: 8,
  },
  eyeLeft: {
    marginRight: 15,
  },
  eyeRight: {
    marginLeft: 15,
  },
  mustache: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  mustacheLeft: {
    width: 25,
    height: 8,
    backgroundColor: '#2c1810',
    borderRadius: 4,
    marginRight: 5,
  },
  mustacheRight: {
    width: 25,
    height: 8,
    backgroundColor: '#2c1810',
    borderRadius: 4,
    marginLeft: 5,
  },
  mouth: {
    width: 20,
    height: 8,
    backgroundColor: '#2c1810',
    borderRadius: 4,
  },
  mouthOpen: {
    height: 15,
    borderRadius: 10,
  },
  body: {
    marginTop: 10,
  },
  poncho: {
    flexDirection: 'row',
  },
  ponchoLeft: {
    width: 40,
    height: 60,
    backgroundColor: '#ff6b35',
    borderRadius: 20,
    marginRight: 5,
  },
  ponchoRight: {
    width: 40,
    height: 60,
    backgroundColor: '#ff6b35',
    borderRadius: 20,
    marginLeft: 5,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordingActive: {
    backgroundColor: '#c0392b',
    transform: [{ scale: 1.1 }],
  },
  instructions: {
    fontSize: 18,
    color: '#f4f4f4',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#f4f4f4',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#f4f4f4',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
