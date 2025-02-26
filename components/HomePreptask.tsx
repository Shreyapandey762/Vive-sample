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
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createTask, getDefaultAreaTag, getDefaultWorkTag} from '../utils/api';
import {useUser} from '../context/UserContext';

type HomePreptaskNavigationProps = StackNavigationProp<
  RootStackParamList,
  'HomePreptask'
>;

interface HomePrepTaskProps {
  route: RouteProp<RootStackParamList, 'HomePreptask'>;
  navigation: HomePreptaskNavigationProps;
}

type OptionType = {
  id: string;
  name: string;
};

const HomePreptask: React.FC<HomePrepTaskProps> = ({route, navigation}) => {
  const [task, setTask] = useState<HomePrepTask>(route.params.task ?? {});
  const [options, setOptions] = useState<OptionType[]>([]);
  const [selectedArea, setSelectedArea] = useState<OptionType | null>(null);
  const [selectedWork, setSelectedWork] = useState<OptionType[]>([]);

  const [inputText, setInputText] = useState<string>('');
  const [selectedPill, setSelectedPill] = useState<'Work' | 'Area' | null>(
    null,
  );
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {user} = useUser();

  useEffect(() => {
    setTask(route.params.task);
  }, [route.params]);

  useEffect(() => {
    const getDefaultOptions = async () => {
      if (selectedPill === 'Area') {
        const res = await getDefaultAreaTag(user!, task.transaction_id.$oid);
        setOptions(res.place_tags);
      } else if (selectedPill === 'Work') {
        const res = await getDefaultWorkTag(user!, task.transaction_id.$oid);
        setOptions(res.work_tags);
      }
    };

    if (selectedPill) getDefaultOptions();
  }, [selectedPill]);

  const handleTagSelection = (item: OptionType) => {
    if (selectedPill === 'Area') {
      setSelectedArea(item);
      setSelectedPill(null);
    } else if (selectedPill === 'Work') {
      setSelectedWork(prevSelected => {
        const exists = prevSelected.some(tag => tag.id === item.id);
        if (exists) {
          return prevSelected.filter(tag => tag.id !== item.id);
        } else {
          return [...prevSelected, {...item, note: ''}];
        }
      });
      setSelectedPill(null);
    }
  };
  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) setDueDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleCreateTask = async () => {
    const payload = {
      homeprep_task: {
        place_tag_id: selectedArea?.id,
        work_tag_id: selectedWork[0]?.id,
        notes: inputText,
      },
    };
    await createTask(user!, task.transaction_id.$oid, payload);
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        <Text style={styles.header}>Home Prep</Text>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleCreateTask()}>
          <Text style={styles.saveButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: task.images?.[0]?.image_thumb_url || ''}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.secondRow}>
        <View style={styles.pillContainer}>
          {selectedPill === 'Area' ? (
            <FlatList
              data={options}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.optionPill}
                  onPress={() => handleTagSelection(item)}>
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <TouchableOpacity
              style={styles.pill}
              onPress={() => setSelectedPill('Area')}>
              <Text style={styles.pillText}>
                {selectedArea ? selectedArea.name : 'Area'}
              </Text>
            </TouchableOpacity>
          )}

          {selectedPill === 'Work' ? (
            <View style={styles.multiselectContainer}>
              <FlatList
                data={options}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  const isSelected = selectedWork.some(
                    tag => tag.id === item.id,
                  );
                  return (
                    <TouchableOpacity
                      style={[
                        styles.optionPill,
                        isSelected && styles.selectedOptionPill,
                      ]}
                      onPress={() => handleTagSelection(item)}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.pill}
              onPress={() => setSelectedPill('Work')}>
              <Text style={styles.pillText}>
                {selectedWork.length > 0
                  ? selectedWork.map(tag => tag.name).join(', ')
                  : 'Work'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            style={styles.pill}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.pillText}>
              {dueDate ? dueDate.toDateString() : 'Set Due Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>
        {selectedWork.map(e => {
          return (
            <View style={styles.inputRow} key={e.id}>
              <TextInput
                style={styles.input}
                placeholder="Enter text here..."
                placeholderTextColor={'grey'}
                value={inputText}
                onChangeText={setInputText}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    flex: 0.5,
  },
  imageContainer: {
    flex: 1,
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
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'turquoise',
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
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    borderBottomWidth: 1,
  },
  secondRow: {
    flex: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },

  pillContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 15,
    gap: 10,
  },

  pillRow: {
    alignSelf: 'stretch',
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  inputRow: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  datePickerButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  datePickerText: {
    color: 'black',
    fontSize: 16,
  },
  datePickerContainer: {marginTop: 10},
  multiselectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HomePreptask;
