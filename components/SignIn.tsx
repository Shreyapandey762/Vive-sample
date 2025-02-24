import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Vive from '../assets/Vive';
import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useUser} from '../context/UserContext';

const countries = [
  {code: '+1', name: 'USA'},
  {code: '+91', name: 'India'},
  {code: '+44', name: 'UK'},
];

const SignIn: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[1]);
  const [phoneNumber, setPhoneNumber] = useState('7000335933');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {setUser} = useUser();

  const handleSignIn = async () => {
    if (phoneNumber.length < 9 || phoneNumber.length > 13) {
      Alert.alert(
        'Validation Error',
        'Phone number must be between 9 and 13 characters.',
      );
      return;
    }
    if (password.length < 8) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 8 characters long.',
      );
      return;
    }

    const formData = new FormData();
    formData.append('area_code', selectedCountry.code);
    formData.append('mobile', phoneNumber);
    formData.append('password', password);
    try {
      const response = await axios.post(
        'https://staging.gotvive.com/api/v1/users/sign_in',
        {
          area_code: selectedCountry.code,
          mobile: phoneNumber,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      console.log('Response Data:', response.data);
      setUser(response.data.user);
      navigation.navigate('LandingScreen');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          'Sign-In Failed',
          error.response?.data?.message || 'An error occurred',
        );
        console.error('Axios Error:', error.response?.data || error.message);
      } else {
        Alert.alert(
          'Unexpected Error',
          'Something went wrong. Please try again.',
        );
        console.error('Unexpected Error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signInLink} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      <Vive color="black" scale={0.3} style={styles.logo} />
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.countryText}>{selectedCountry.code}</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholderTextColor="grey"
          style={styles.phoneInput}
          keyboardType="phone-pad"
        />
      </View>
      \
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="grey"
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showButtonText}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <FlatList
            data={countries}
            keyExtractor={item => item.code}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCountry(item);
                  setModalVisible(false);
                }}>
                <Text style={styles.modalText}>
                  {item.name} ({item.code})
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '80%',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  countrySelector: {
    marginRight: 10,
  },
  countryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  showButton: {
    padding: 10,
  },
  showButtonText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: 'bold',
  },
  signInLink: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  signInText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  modalItem: {
    padding: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 100,
  },
});

export default SignIn;
