import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
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
import {Transaction} from '../store/transactionsSlice';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteTransaction, updateTransaction} from '../utils/api';
import {useUser} from '../context/UserContext';

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
  const {user} = useUser();

  const [transaction1, setTransaction1] = useState<Transaction>(
    route.params.transaction,
  );
  const DEFAULT_IMAGE_URL =
    'https://vive-media.s3.us-west-2.amazonaws.com/staging/images/transaction/67c029676e497c7a392a6048/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWW6QHOQBG7RJSYXW%2F20250227%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250227T092949Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=5d4bc823ea233993e83529cf886e338dd5635b5c64abe7a6332b16bd6702a048';
  useEffect(() => {
    setTransaction1(route.params.transaction);
  }, [route.params.transaction]);

  const handleImagePick = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setTransaction1(prev => ({...prev, image_url: result.assets![0].uri!}));
    }
  };

  const handleDeleteTransaction = async () => {
    if (transaction1.id) {
      await deleteTransaction(user!, transaction1.id.$oid);
    }
    navigation.navigate('LandingScreen');
  };

  const handleSaveTransaction = async () => {
    if (transaction1.id) {
      console.log(transaction1);
      await updateTransaction(user!, transaction1.id.$oid, transaction1);
    }
    navigation.navigate('LandingScreen');
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Remove Transaction',
      'Are you sure want to remove this transaction',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          onPress: handleDeleteTransaction,
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Icon name="ellipsis-v" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Selling Transaction</Text>

      <TouchableOpacity onPress={handleImagePick} style={styles.cameraButton}>
        <View style={styles.plusIconContainer}>
          {transaction1.image_url &&
          transaction1.image_url !== DEFAULT_IMAGE_URL ? (
            <Image
              source={{uri: transaction1.image_url}}
              style={styles.imagePreview}
            />
          ) : (
            <Icon name="camera" size={50} color="black" />
          )}
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.title}
        onChangeText={(text: string) => {
          console.log(text);
          setTransaction1(prev => ({...prev, name: text}));
        }}>
        {transaction1.name}
      </TextInput>

      <TextInput
        placeholder="Address of the house"
        value={transaction1.full_address || ''}
        onChangeText={(text: string) =>
          setTransaction1(prev => ({...prev, full_address: text}))
        }
        placeholderTextColor="grey"
        style={styles.textInput}
      />

      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: '#007bff',
          },
        ]}
        onPress={handleSaveTransaction}>
        <Text style={styles.saveButtonText}>Save Transaction</Text>
      </TouchableOpacity>

      <Text style={styles.listingheader}>ACTIVITIES</Text>
      <View style={styles.horizontalAlign}>
        <TouchableOpacity onPress={() => navigation.navigate('ListingPlan')}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Listing Plan</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('HomePrep', {transaction: transaction1})
          }>
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
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
    color: 'black',
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
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: 'red',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
});

export default NewTransactionScreen;
