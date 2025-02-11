import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {useDispatch} from 'react-redux';
import {addTransaction} from '../store/transactionsSlice';
import Icon from 'react-native-vector-icons/FontAwesome';

type NewTransactionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewTransactionScreen'
>;

interface NewTransactionScreenProps {
  route: RouteProp<RootStackParamList, 'NewTransactionScreen'>;
  navigation: NewTransactionScreenNavigationProp;
}

const NewTransactionScreen: React.FC<NewTransactionScreenProps> = ({
  route,
  navigation,
}) => {
  const {transaction} = route.params;
  const dispatch = useDispatch();

  const [subtitle, setSubtitle] = useState<string>(transaction.subtitle ?? '');
  const [image, setImage] = useState<string | null>(transaction.image ?? '');

  const handleImagePick = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri || null);
    }
  };

  const handleSaveTransaction = () => {
    if (subtitle && image) {
      dispatch(addTransaction({...transaction, subtitle, image}));
      navigation.navigate('LandingScreen');
      Alert.alert('Success', 'Transaction saved!');
    } else {
      Alert.alert('Error', 'Please provide subtitle and image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Selling Transaction</Text>

      <TouchableOpacity onPress={handleImagePick} style={styles.cameraButton}>
        <View style={styles.plusIconContainer}>
          <Icon name="camera" size={50} color="black" />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{transaction.title}</Text>
      <TextInput
        placeholder="Address of the house"
        value={subtitle}
        onChangeText={setSubtitle}
        placeholderTextColor="grey"
        style={styles.textInput}
      />
      {image && <Image source={{uri: image}} style={styles.imagePreview} />}
      <TouchableOpacity
        style={[
          styles.saveButton,
          {backgroundColor: subtitle && image ? '#007bff' : '#c0c0c0'},
        ]}
        onPress={handleSaveTransaction}
        disabled={!subtitle}>
        <Text style={styles.saveButtonText}>Save Transaction</Text>
      </TouchableOpacity>
      <Text style={styles.listingheader}>ACTIVITIES</Text>
      <View style={styles.horizontalAlign}>
        <TouchableOpacity onPress={() => navigation.navigate('ListingPlan')}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Listing Plan</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomePrep')}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Home Prep</Text>
          </View>
        </TouchableOpacity>
      </View>
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
  card: {
    marginBottom: 10,
    alignItems: 'center',
    minWidth: '50%',
    maxWidth: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    elevation: 1,
    margin: 10,
    height: '50%',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  cameraButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  plusIconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'heavy',
    fontFamily: 'Comin Sans MS',
    color: '#333',
    marginTop: 20,
    alignSelf: 'center',
  },
  listingheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    margin: 20,
    marginLeft: 0,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    borderBottomWidth: 1,
    width: '100%',
  },
  textInput: {
    borderBottomWidth: 1,
    width: '100%',
    marginVertical: 6,
    padding: 5,
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  horizontalAlign: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  cardText: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
});

export default NewTransactionScreen;
