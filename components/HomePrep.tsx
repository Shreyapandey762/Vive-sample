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
  Modal,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createTask, sampleFunction} from '../utils/api';
import {useUser} from '../context/UserContext';
import {useDispatch, useSelector} from 'react-redux';
import {HomePrepTask, setAllTasks} from '../store/transactionsSlice';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {RouteProp} from '@react-navigation/native';
import {RootState} from '../store';
import {useFocusEffect} from '@react-navigation/native';

type HomePrepNavigationProps = StackNavigationProp<
  RootStackParamList,
  'HomePrep'
>;

interface HomePrepProps {
  route: RouteProp<RootStackParamList, 'HomePrep'>;
  navigation: HomePrepNavigationProps;
}

const {width} = Dimensions.get('window');
const CARD_SIZE = width * 0.4;

const HomePrep: React.FC<HomePrepProps> = ({route, navigation}) => {
  const {transaction} = route.params || {};
  const {user} = useUser();
  const dispatch = useDispatch();
  const slideAnim = useState(new Animated.Value(100))[0];

  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'Area' | 'Work' | 'Unassigned'
  >('Area');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const tasks = useSelector((state: RootState) => state.transactions.tasks);

  useFocusEffect(
    React.useCallback(() => {
      const apiCall = async () => {
        try {
          const res = await sampleFunction(user!, transaction.id.$oid);
          dispatch(setAllTasks(res.tasks));
        } catch (error) {
          console.error('Error calling sampleFunction:', error);
        }
      };

      apiCall();
      return () => {};
    }, [transaction, route.params, modalVisible]),
  );

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory === 'Area') return task.place_tag;
    if (selectedCategory === 'Work') return task.work_tag;
    return !task.place_tag && !task.work_tag;
  });

  const handleImagePick = async () => {
    const res = await createTask(user!, transaction.id.$oid, undefined);

    const result = await launchCamera({mediaType: 'photo', quality: 1});
    if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      const updatedTask: HomePrepTask = {
        ...res.task,
        local_image_url: result.assets![0].uri!,
        images: [...res.task.images, {image_url: result.assets![0].uri!}],
      };
      navigation.navigate('HomePreptask', {task: updatedTask});
    }
  };

  const handleSaveNote = async () => {
    try {
      const res = await createTask(user!, transaction.id.$oid, noteText);

      setModalVisible(false);
      setNoteText('');
      Alert.alert('Success', 'Note updated successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update note.');
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

      <TouchableOpacity
        style={styles.pill}
        onPress={() => setDropdownVisible(!dropdownVisible)}>
        <Text style={styles.pillText}>{selectedCategory}</Text>
        <Icon name="chevron-down" size={14} color="black" />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          {['Area', 'Work', 'Unassigned'].map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => {
                setSelectedCategory(category as 'Area' | 'Work' | 'Unassigned');
                setDropdownVisible(false);
              }}
              style={styles.dropdownItem}>
              <Text>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id?.$oid ?? ''}
        contentContainerStyle={styles.listContainer}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('HomePreptask', {task: item})}>
            <View style={styles.taskItem}>
              <Text style={styles.tagBelow}>{item.work_tag?.name}</Text>

              {item?.images &&
              item.images.length > 0 &&
              item.images[0].image_thumb_url ? (
                <Image
                  source={{uri: item.images[0].image_thumb_url}}
                  style={styles.squareImage}
                />
              ) : (
                <View style={[styles.squareImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <View
                style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                <Text style={styles.tagAbove}>{item.place_tag?.name}</Text>
                <Icon
                  name="tag"
                  size={16}
                  color="black"
                  style={{marginRight: 5}}
                />
              </View>
              <TextInput
                style={styles.noteInput}
                placeholder="Add note..."
                value={item.notes}
                placeholderTextColor="black"
              />
            </View>
          </TouchableOpacity>
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
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.cameraButton}>
          <Icon name="edit" size={20} color="black" />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={slideIn} style={styles.arrowButton}>
        <Icon name="arrow-left" size={20} color="black" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeader}>Edit Note</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter note..."
              value={noteText}
              onChangeText={setNoteText}
              placeholderTextColor="#666"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveNote} style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
  },
  taskItem: {
    marginBottom: 20,
    alignItems: 'flex-start',
    width: CARD_SIZE,
  },
  tagAbove: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  squareImage: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#ccc',
    alignItems: 'flex-start',
  },
  placeholderText: {
    color: '#666',
  },
  tagBelow: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  noteInput: {
    width: CARD_SIZE,
    padding: 6,
    fontSize: 14,
    marginTop: 5,
    color: 'black',
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
  },
  cameraButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    marginLeft: 10,
  },
  arrowButton: {},
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#007bff',
    fontSize: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 10,
  },
  pillText: {
    fontSize: 16,
    marginRight: 5,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    alignSelf: 'center',
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
export default HomePrep;
