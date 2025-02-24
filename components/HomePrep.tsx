import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  TextInput,
  Dimensions,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {sampleFunction} from '../utils/api';
import {useUser} from '../context/UserContext';
import {useDispatch, useSelector} from 'react-redux';
import {HomePrepTask, setAllTasks} from '../store/transactionsSlice';
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

const {width} = Dimensions.get('window');
const CARD_SIZE = width * 0.5;

const HomePrep: React.FC<HomePrepProps> = ({route, navigation}) => {
  const {transaction} = route.params || {};
  const {user} = useUser();
  const dispatch = useDispatch();
  const slideAnim = useState(new Animated.Value(100))[0];

  const tasks = useSelector((state: RootState) => state.transactions.tasks);

  const [task, setTask] = useState<HomePrepTask>({} as HomePrepTask);

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
  }, [transaction]);

  const handleImagePick = async () => {
    const result = await launchCamera({mediaType: 'photo', quality: 1});
    if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      console.log('Image picked:', result.assets[0].uri);
      const updatedtask: HomePrepTask = {
        transaction_id: transaction.id,
        images: [{image_thumb_url: result.assets![0].uri!}],
      };
      setTask(updatedtask);
      navigation.navigate('HomePreptask', {task: updatedtask});
    }
  };

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Icon name="arrow-left" size={20} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Home Prep</Text>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id?.$oid ?? ''}
        contentContainerStyle={styles.listContainer}
        renderItem={({item}) => (
          <View style={styles.taskWrapper}>
            <View style={styles.taskCard}>
              <Text style={styles.taskTitle}>{item.work_tag?.name}</Text>
              <Text style={styles.taskStatus}>Status: {item.status}</Text>
              <Image
                source={{
                  uri:
                    item?.images!.length > 0
                      ? item.images![0].image_thumb_url!
                      : '',
                }}
                style={styles.taskImage}
              />
            </View>
          </View>
        )}
      />

      <Animated.View
        style={[
          styles.cameraContainer,
          {transform: [{translateX: slideAnim}]},
        ]}>
        <TouchableOpacity onPress={handleImagePick} style={styles.cameraButton}>
          <Icon name="camera" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.cameraButton}>
          <Icon name="edit" size={20} color={'black'} />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={slideIn} style={styles.arrowButton}>
        <Icon name="arrow-left" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    alignItems: 'flex-start',
  },
  taskWrapper: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  taskCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  taskStatus: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  taskImage: {
    width: 60,
    height: 60,
    marginBottom: 5,
    borderRadius: 5,
  },
  noteInput: {
    width: CARD_SIZE,
    padding: 6,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 12,
    marginTop: 5,
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  cameraButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  arrowButton: {
    // position: 'absolute',
    // bottom: 25,
    // right: 100,
    // backgroundColor: 'white',
    // padding: 10,
    // elevation: 5,
  },
});

export default HomePrep;
