import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Task,
} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {sampleFunction} from '../utils/api';
import {useUser} from '../context/UserContext';
import {useDispatch, useSelector} from 'react-redux';
import {setAllTasks, Transaction} from '../store/transactionsSlice';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {RouteProp} from '@react-navigation/native';
import {RootState} from '../store';

type HomePrepNavigationProps = StackNavigationProp<
  RootStackParamList,
  'HomePrep'
>;

interface HomePrepProps {
  route: RouteProp<RootStackParamList, 'HomePrep'>;
  navigation: HomePrepNavigationProps;
}

const HomePrep: React.FC<HomePrepProps> = ({route, navigation}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const {user} = useUser();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const {transaction} = route.params || {};

  const tasks = useSelector((state: RootState) => state.transactions.tasks);

  useEffect(() => {
    const apiCall = async () => {
      try {
        const res = await sampleFunction(user!, transaction.id.$oid);
        dispatch(setAllTasks(res.tasks));
      } catch (error) {
        console.error('Error calling sampleFunction:', error);
      }
    };

    apiCall();
  }, [transaction, modalVisible]);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 1});

    if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home Prep</Text>

      <TouchableOpacity onPress={handleImagePick} style={styles.cameraButton}>
        <Icon name="camera" size={50} color="black" />
      </TouchableOpacity>

      {imageUri && (
        <Image source={{uri: imageUri}} style={styles.imagePreview} />
      )}

      <Text style={styles.taskHeader}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.$oid}
        renderItem={({item}) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.work_tag?.name}</Text>
            <Text>Status: {item.status}</Text>
            {item.images.length > 0 && (
              <Image
                source={{uri: item.images[0].image_thumb_url}}
                style={styles.taskImage}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  cameraButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  taskHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskImage: {
    width: 60,
    height: 60,
    marginTop: 10,
  },
});

export default HomePrep;
