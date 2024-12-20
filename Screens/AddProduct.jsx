import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ProductContext} from '../Context/ProductContext';
import {ActivityIndicator} from 'react-native';

const AddProduct = ({navigation}) => {
  const {isLoading, createProduct} = useContext(ProductContext);
  const [AddProduct, setAddProduct] = useState({
    name: '',
    price: '',
    image: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!AddProduct.name) {
      errors.name = 'Name is required!';
    }
    if (!AddProduct.price) {
      errors.price = 'Price is required!';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setAddProduct({...AddProduct, [field]: value});

    setFormErrors(prevErrors => ({
      ...prevErrors,
      [field]: null,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    createProduct({AddProduct, navigation});
  };

  const handleImagePick = async type => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 1,
    };

    const callback = response => {
      if (response.didCancel) {
        console.log('Image selection canceled');
      } else if (response.errorMessage) {
        console.log('Error: ', response.errorMessage);
      } else {
        const image = response.assets[0]?.uri;
        setAddProduct({...AddProduct, image});
      }
      setModalVisible(false);
    };

    if (type === 'camera') {
      launchCamera(options, callback);
    } else if (type === 'gallery') {
      launchImageLibrary(options, callback);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>
            <Icon name="left" size={22} color={'black'} />
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add a New Product</Text>
      </View>

      <View style={styles.form}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Headphone"
              value={AddProduct.name}
              placeholderTextColor={'#E5E1DA'}
              onChangeText={value => handleInputChange('name', value)}
            />
          </View>
          {formErrors.name && (
            <Text style={styles.errorText}>{formErrors.name}</Text>
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price:</Text>
            <TextInput
              style={styles.input}
              placeholder="$105.50"
              keyboardType="numeric"
              placeholderTextColor={'#E5E1DA'}
              value={AddProduct.price}
              onChangeText={value => handleInputChange('price', value)}
            />
          </View>
          {formErrors.price && (
            <Text style={styles.errorText}>{formErrors.price}</Text>
          )}
          {AddProduct.image && (
            <View style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAddProduct({...AddProduct, image: null})}>
                <Icon name="close" size={20} color="white" />
              </TouchableOpacity>
              <Image
                source={{uri: AddProduct.image}}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => setModalVisible(true)}>
            <Icon name="upload" size={30} color="#007bff" />
            <Text style={styles.uploadText}>
              {AddProduct.image ? 'Change Image' : 'Upload Image'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            {isLoading ? (
              <ActivityIndicator size="large" color={'white'} />
            ) : (
              <Text style={styles.buttonText}>Create Product</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Image</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleImagePick('camera')}>
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleImagePick('gallery')}>
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 20,
  },
  backText: {
    fontSize: 16,
    color: 'blue',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    borderStyle: 'dashed',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#e9f5ff',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 8,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ccc',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalCancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 20,
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f4f4f4',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    padding: 5,
    zIndex: 10,
  },
});
