import React, {useEffect, useState} from 'react';
import {HomePrepTask} from '../store/transactionsSlice';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {RouteProp} from '@react-navigation/native';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getDefaultAreaTag, getDefaultWorkTag} from '../utils/api';
import {useUser} from '../context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedPill, setSelectedPill] = useState<'Work' | 'Area' | null>(
    null,
  );
  const {user} = useUser();
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  console.log(task);

  useEffect(() => {
    setTask(route.params.task);
  }, [route.params]);

  useEffect(() => {
    const getDefaultOptions = async () => {
      if (selectedPill === 'Area') {
        var options = await getDefaultAreaTag(user!, task.transaction_id.$oid);
        setOptions(options.place_tags);
      } else if (selectedPill == 'Work') {
        var options = await getDefaultWorkTag(user!, task.transaction_id.$oid);
        setOptions(options.work_tags);
      }
    };

    getDefaultOptions();
  }, [selectedPill]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
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

        <TouchableOpacity style={styles.saveButton} onPress={() => {}}>
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
          {selectedPill ? (
            <FlatList
              data={options}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.optionPill,
                    selectedOptions.includes(item) && styles.selectedOptionPill,
                  ]}
                  onPress={() => {}}>
                  <Text
                    style={[
                      styles.optionText,
                      selectedOptions.includes(item) &&
                        styles.selectedOptionText,
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.pill}
                onPress={() => setSelectedPill('Area')}>
                <Text style={styles.pillText}>Area</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pill}
                onPress={() => setSelectedPill('Work')}>
                <Text style={styles.pillText}>Work</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter text here..."
            placeholderTextColor={'grey'}
            value={inputText}
            onChangeText={setInputText}
          />
        </View>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>
            Due Date: {dueDate.toDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
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
});

export default HomePreptask;
