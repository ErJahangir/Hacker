import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      const userdata = await AsyncStorage.getItem('token');
      if (userdata) {
        navigation.replace('home');
      } else {
        navigation.replace('login');
      }
    };
    fetchData();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.text}>Hacker</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
