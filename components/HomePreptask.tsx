import React, {useEffect, useState} from 'react';
import {HomePrepTask} from '../store/transactionsSlice';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {RouteProp} from '@react-navigation/native';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type HomePreptaskNavigationProps = StackNavigationProp<
  RootStackParamList,
  'HomePreptask'
>;

interface HomePrepTaskProps {
  route: RouteProp<RootStackParamList, 'HomePreptask'>;
  navigation: HomePreptaskNavigationProps;
}

const HomePreptask: React.FC<HomePrepTaskProps> = ({route, navigation}) => {
  const [task, setTask] = useState<HomePrepTask>(route.params.task ?? {});
  console.log(task);
  useEffect(() => {
    setTask(route.params.task);
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        <Text style={styles.header}>Home Prep</Text>

        <TouchableOpacity style={styles.saveButton} onPress={() => {}}>
          <Text style={styles.saveButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: task.images![0].image_thumb_url! || ''}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
  secondRow: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    gap: 15,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  pillRow: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionPill: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#ddd',
    margin: 5,
  },
  selectedOptionPill: {
    backgroundColor: '#007bff',
  },
  optionText: {
    fontSize: 14,
  },
  selectedOptionText: {
    color: 'white',
  },
  inputRow: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default HomePreptask;
