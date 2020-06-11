import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker'
import Toast from 'react-native-simple-toast';

const UploadPictureScreen = ({ navigation }) => {
  const [centerCoordinate, setCenterCoordinate] = useState({ place: '', coord: [2.35183, 48.85658] });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const bootstrapAsync = async () => {
        const value = await AsyncStorage.getItem('POS_DATA');
        if (value !== null) {
          // We have data!!
          let data = JSON.parse(value);
          setCenterCoordinate(data);
        }
      };
      bootstrapAsync();
    });
    return unsubscribe;

  }, [navigation]);
  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log(source);
        setImage(source);
      }
    });
  };
  const uploadImage = async () => {
    const { uri } = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const ref = storage().ref(filename)
    const task = ref
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    setImage(null);
    const downloadUrl = await ref.getDownloadURL();
    // Wrtie to firestore database
    firestore().collection('Pictures')
      .add(
        {
          ...
          centerCoordinate,
          picture: downloadUrl
        }
      )
      .then(() => {
        Toast.show('Picture is uploaded successfully.');
        setTimeout(() => {
          navigation.goBack();
        }, 500);    
      });

  };
  return (
    <>
      <View style={styles.container}>
        <Spinner
          visible={uploading} size="large" style={styles.spinnerStyle} />
        <View style={styles.placeViwe}>
          <Text>
            Place Name: {centerCoordinate.place}
          </Text>
          <Text>
            Coordinate: {centerCoordinate.coord}
          </Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
            <Text style={styles.buttonText}>Pick an image</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {image !== null ?
              <Image source={{ uri: image.uri }} style={styles.imageBox} />
              : null}
            {image !== null ?
              <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
              : null
            }
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  placeViwe: {
    padding: 15,
  },
  spinnerStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButton: {
    borderRadius: 5,
    width: 130,
    height: 40,
    marginTop: 5,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadButton: {
    borderRadius: 5,
    width: 120,
    height: 40,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center'
  },
  progressBarContainer: {
    marginTop: 20
  },
  imageBox: {
    width: 300,
    height: 300
  }
});

export default UploadPictureScreen;