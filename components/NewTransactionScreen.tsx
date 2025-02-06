import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NewTransactionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewTransactionScreen'>;

interface Props {
  route: RouteProp<RootStackParamList, 'NewTransactionScreen'>;
  navigation: NewTransactionScreenNavigationProp;
}

const NewTransactionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title } = route.params;
  const [subtitle, setSubtitle] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);

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
      const newTransaction = { title, subtitle, image };
      navigation.navigate('LandingScreen', { newTransaction });
      Alert.alert('Success', 'Transaction saved!');
    } else {
      Alert.alert('Error', 'Please provide subtitle and image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Transaction</Text>
      <Text style={styles.title}>{title}</Text>

      <TextInput
        placeholder="Enter subtitle"
        value={subtitle}
        onChangeText={setSubtitle}
        style={styles.textInput}
      />

      <Button title="Pick an image" onPress={handleImagePick} />
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: subtitle && image ? '#007bff' : '#c0c0c0' }]}
        onPress={handleSaveTransaction}
        disabled={!subtitle || !image}
      >
        <Text style={styles.saveButtonText}>Save Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  textInput: { borderBottomWidth: 1, width: '80%', marginVertical: 10, padding: 8 },
  imagePreview: { width: 100, height: 100, marginVertical: 10 },
  saveButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginTop: 20 },
  saveButtonText: { color: 'white', fontSize: 16 },
});

export default NewTransactionScreen;
