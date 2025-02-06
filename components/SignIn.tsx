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

const countries = [
  {code: '+1', name: 'USA'},
  {code: '+91', name: 'India'},
  {code: '+44', name: 'UK'},
  {code: '+61', name: 'Australia'},
];

const SignIn: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    formData.append('area_code', '+91');
    formData.append('mobile', '7000335933');
    formData.append('password', 'password');

    try {
      const response = await axios.post(
        'https://staging.gotvive.com/api/v1/users/sign_in',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept':'application/json'          
          },
        },
      );

      console.log('Response Data:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected Error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signInLink} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <Vive color="black" scale={0.4} style={styles.logo} />

      <View style={styles.phoneContainer}>
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.countryText}>{selectedCountry.code}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput, {color: '#333'}]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  signInLink: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  signInText: {
    fontSize: 16,
    color: 'light-grey',
    fontWeight: 'bold',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  phoneContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  countrySelector: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  countryText: {
    fontSize: 16,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginTop: 20,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  showButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  showButtonText: {
    fontSize: 16,
    color: '#3498db',
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
    paddingVertical: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SignIn;
