import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingSize, setRecordingSize] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [selectedVoiceEffect, setSelectedVoiceEffect] = useState('baby-voice');
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isListening, setIsListening] = useState(true);

  // Request audio permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Audio recording permission is required to use this app.');
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Set up the app
      setIsListening(true);
    })();
  }, []);


  
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





  const startRecording = async () => {
    try {
      // Start audio recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingTime(0);
      setRecordingSize(0);
      
      // Start silence detection
      startVoiceActivityTimer();
      
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        
        if (uri) {
          // Play back immediately with selected effect
          playRecording(uri);
        }
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const startVoiceActivityMonitoring = () => {
    // Wait 1 second to let the recording stabilize, then start monitoring
    setTimeout(() => {
      if (recording) {
        // Now start the silence detection timer
        startVoiceActivityTimer();
      }
    }, 1000);
  };

  const startContinuousSilenceMonitoring = () => {
    // Clear any existing timer
    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }
    
    // Don't start silence timer immediately - wait for actual audio input
    // The timer will be started when we detect voice activity
  };

  const startVoiceActivityTimer = () => {
    // Clear any existing timer
    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }
    
    // Start 3-second silence timer only when voice activity is detected
    const timer = setTimeout(() => {
      if (isRecording && recordingTime > 0) {
        stopRecordingAndPlay();
      }
    }, 3000);
    
    setSilenceTimer(timer);
  };

  const startSilenceDetection = () => {
    // Clear any existing silence timer
    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }
    
    // Set a new silence timer for 3 seconds
    const timer = setTimeout(() => {
      if (isRecording && recordingTime > 0) {
        stopRecordingAndPlay();
      }
    }, 3000);
    
    setSilenceTimer(timer);
  };

  const resetSilenceTimer = () => {
    // Clear existing timer
    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }
    
    // Set new timer for 3 seconds
    const timer = setTimeout(() => {
      if (isRecording && recordingTime > 0) {
        stopRecordingAndPlay();
      }
    }, 3000);
    
    setSilenceTimer(timer);
  };

  const stopRecordingAndPlay = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      
      if (uri && recordingTime > 0) {
        // Play back with selected effect
        await playRecording(uri);
        

      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsRecording(false);
    }
  };



  const playRecording = async (uri: string) => {
    try {
      setIsPlaying(true);
      
      // Get the selected voice effect settings
      const selectedEffect = voiceEffects.find(effect => effect.id === selectedVoiceEffect);
      const playbackRate = selectedEffect ? selectedEffect.rate : 2.0;
      
      // Play back your actual recorded voice with the selected effect
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: uri },
        { 
          shouldPlay: true,
          volume: 1.0,
          // Apply the selected voice effect
          rate: playbackRate,
          shouldCorrectPitch: false, // Don't correct pitch when changing rate
        }
      );
      
      setSound(newSound);
      
      // Set up sound completion handler
      newSound.setOnPlaybackStatusUpdate((status) => {
        if ('didJustFinish' in status && status.didJustFinish) {
          setIsPlaying(false);
          setSound(null);
        }
      });
      
    } catch (err) {
      console.error('Failed to play recording', err);
      setIsPlaying(false);
      Alert.alert('Error', 'Failed to play recording');
    }
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

  // Voice effects configuration
  const voiceEffects = [
    { id: 'baby-voice', name: 'Baby Voice', icon: require('./assets/voices/baby-voice.png'), rate: 2.0, pitch: 'High' },
    { id: 'robot-voice', name: 'Robot Voice', icon: require('./assets/voices/robot-voice.png'), rate: 0.8, pitch: 'Low' },
    { id: 'monster-voice', name: 'Monster Voice', icon: require('./assets/voices/monster-voice.png'), rate: 0.5, pitch: 'Very Low' },
    { id: 'witch-voice', name: 'Witch Voice', icon: require('./assets/voices/witch-voice.png'), rate: 0.7, pitch: 'Low' },
    { id: 'satan-voice', name: 'Satan Voice', icon: require('./assets/voices/satan-voice.png'), rate: 0.6, pitch: 'Very Low' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>FunnyVoice</Text>
      </View>

      {/* Main Recording Area */}
      <View style={styles.mainArea}>
                         {/* Mexican Character - Press and Hold to Record */}
         <TouchableOpacity
           style={styles.characterContainer}
           onPressIn={startRecording}
           onPressOut={stopRecording}
           activeOpacity={0.8}
         >
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
             <Image 
               source={require('./assets/mexican-character.png')} 
               style={styles.characterImage}
               resizeMode="contain"
             />
           </Animated.View>
         </TouchableOpacity>

         {/* Voice Effect Selector */}
         <View style={styles.voiceEffectSelector}>
           <Text style={styles.selectorTitle}>Choose Your Voice Effect</Text>
           <ScrollView 
             horizontal 
             showsHorizontalScrollIndicator={false}
             style={styles.voiceEffectsScroll}
           >
             {voiceEffects.map((effect) => (
               <TouchableOpacity
                 key={effect.id}
                 style={[
                   styles.voiceEffectOption,
                   selectedVoiceEffect === effect.id && styles.selectedVoiceEffect
                 ]}
                 onPress={() => setSelectedVoiceEffect(effect.id)}
               >
                 <Image 
                   source={effect.icon} 
                   style={styles.voiceEffectIcon}
                   resizeMode="contain"
                 />
                 <Text style={[
                   styles.voiceEffectName,
                   selectedVoiceEffect === effect.id && styles.selectedVoiceEffectName
                 ]}>
                   {effect.name}
                 </Text>
                 {/* <Text style={styles.voiceEffectPitch}>{effect.pitch}</Text> */}
               </TouchableOpacity>
             ))}
           </ScrollView>
         </View>

                           {/* Recording Status Indicator */}
         <View style={styles.listeningIndicator}>
           <View style={[styles.listeningDot, isRecording && styles.listeningActive]} />
           <Text style={styles.listeningText}>
             {isRecording ? "🎤 Recording..." : "🎵 Ready to Record"}
           </Text>
         </View>







        {/* Instructions */}
        <Text style={styles.instructions}>
          {isRecording ? "🎤 Habla ahora! Suelta para detener la grabación" : "🎵 Presiona y mantén el personaje para grabar"}
        </Text>

        {/* Recording Status */}
        {isRecording && (
          <Text style={styles.recordingStatus}>
            🎤 Grabando... Suelta para detener
          </Text>
        )}
        {!isRecording && (
          <Text style={styles.recordingStatus}>
            🎵 Presiona y mantén el personaje para grabar
          </Text>
        )}

        {/* Voice Effect Indicator */}
        {isPlaying && (
          <View style={styles.babyVoiceIndicator}>
            <Text style={styles.babyVoiceText}>
              🎵 Playing with {voiceEffects.find(e => e.id === selectedVoiceEffect)?.name} Effect! 🎵
            </Text>
            <Text style={styles.babyVoiceSubtext}>
              Rate: {voiceEffects.find(e => e.id === selectedVoiceEffect)?.rate}x | 
              Pitch: {voiceEffects.find(e => e.id === selectedVoiceEffect)?.pitch}
            </Text>
          </View>
        )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterImage: {
    width: 200,
    height: 200,
  },
  voiceEffectSelector: {
    marginBottom: 30,
    alignItems: 'center',
  },
  selectorTitle: {
    fontSize: 18,
    color: '#f4f4f4',
    marginBottom: 15,
    fontWeight: '600',
  },
  voiceEffectsScroll: {
    paddingHorizontal: 20,
  },
  voiceEffectOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    marginHorizontal: 8,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedVoiceEffect: {
    backgroundColor: 'rgba(255, 107, 53, 0.3)',
    borderColor: '#ff6b35',
  },
  voiceEffectIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  voiceEffectName: {
    fontSize: 12,
    color: '#f4f4f4',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedVoiceEffectName: {
    color: '#ff6b35',
    fontWeight: '600',
  },
  voiceEffectPitch: {
    fontSize: 10,
    color: '#a0a0a0',
    textAlign: 'center',
  },
  listeningIndicator: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  listeningDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#666',
    marginBottom: 10,
  },
  listeningActive: {
    backgroundColor: '#ff6b35',
  },
  listeningText: {
    fontSize: 16,
    color: '#f4f4f4',
    textAlign: 'center',
  },
  manualStopButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#c0392b',
  },
  manualStopText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recordingStatus: {
    fontSize: 14,
    color: '#ff6b35',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  startRecordingButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#229954',
  },
  startRecordingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },


  instructions: {
    fontSize: 18,
    color: '#f4f4f4',
    textAlign: 'center',
    marginBottom: 20,
  },
  babyVoiceIndicator: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ff6b35',
    marginTop: 10,
  },
  babyVoiceText: {
    fontSize: 16,
    color: '#ff6b35',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  babyVoiceSubtext: {
    fontSize: 12,
    color: '#ff6b35',
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.8,
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

});
