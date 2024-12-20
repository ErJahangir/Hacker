import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required!';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email!';
    }

    if (!formData.password) {
      errors.password = 'Password is required!';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters!';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prevForm => ({
      ...prevForm,
      [field]: value,
    }));
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [field]: null,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post('https://reqres.in/api/login', formData);
      await AsyncStorage.setItem('token', res?.data?.token);
      Toast.show({
        type: 'success',
        text1: 'Logged In successfully',
      });
      navigation.replace('home');
    } catch (error) {
      console.log('Something went wrong:', error.message);
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar animated={true} backgroundColor="black" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}>
            {/* Logo */}
            <Image
              source={require('../public/Assets/image.png')}
              style={styles.logo}
            />

            {/* Title */}
            <Text style={styles.title}>Login</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={25} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email ID"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
                value={formData.email}
                onChangeText={text => handleInputChange('email', text)}
              />
            </View>
            {formErrors.email && (
              <Text style={styles.errorText}>{formErrors.email}</Text>
            )}

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Icon
                name="lock-outline"
                size={25}
                color="#666"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!visible}
                placeholderTextColor="#aaa"
                value={formData.password}
                onChangeText={text => handleInputChange('password', text)}
              />
              <TouchableOpacity onPress={() => setVisible(!visible)}>
                <Icon
                  name={visible ? 'eye-off' : 'eye'}
                  size={25}
                  color="#666"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {formErrors.password && (
              <Text style={styles.errorText}>{formErrors.password}</Text>
            )}

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>

            <TouchableOpacity style={styles.googleButton}>
              <Icon name="google" size={30} color="#000" />
              <Text style={styles.googleButtonText}>Login with Google</Text>
            </TouchableOpacity>
            <View style={styles.register}>
              <Text style={styles.registerText}>New to Logistics?</Text>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Register</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9EAFD',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    gap: 10,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  register: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 18,
    marginRight: 5,
  },
});
