import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Vive from '../assets/Vive';

type LandingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LandingScreen'
>;

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionTitle, setTransactionTitle] = useState('');

  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const handleCreate = () => {
    if (transactionTitle) {
      navigation.navigate('NewTransactionScreen', { title: transactionTitle });
      setModalVisible(false);
      setTransactionTitle('');
    } else {
      Alert.alert('Error', 'Please enter a transaction title.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => navigation.navigate('UserProfile')}>
        <Icon name="user-circle" size={30} color="black" />
      </TouchableOpacity>
      <Vive color="black" scale={0.4} style={styles.logo} />

      <Text style={styles.header}>Good Evening!</Text>

      <View style={styles.transactionContainer}>
        <Text style={styles.transactionText}>Selling</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <View style={styles.plusIconContainer}>
            <Icon name="plus" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text>{item.title}</Text>
            <Text>{item.subtitle}</Text>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>New Transaction</Text>
          <TextInput
            placeholder="Enter Transaction Title"
            value={transactionTitle}
            onChangeText={setTransactionTitle}
            style={styles.textInput}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCreate}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  logo: {
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  transactionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  plusIconContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  transactionsList: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  transactionItem: {
    marginBottom: 10,
    alignItems: 'center',
    maxWidth: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    elevation: 1,
    margin: 5,
    height: '30%'
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    borderBottomWidth: 1,
    width: '80%',
    marginVertical: 10,
    padding: 8,
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LandingScreen;
