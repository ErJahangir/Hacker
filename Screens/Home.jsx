import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProductContext} from '../Context/ProductContext';
import Toast from 'react-native-toast-message';

const Home = ({navigation}) => {
  const {isLoading, setIsLoading, products, deleteProduct} =
    useContext(ProductContext);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleLogout = () => {
    setIsLoading(true);
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            navigation.replace('login');
            Toast.show({
              type: 'success',
              text1: 'logged Out successfull',
            });
          },
        },
      ],
      {cancelable: true},
    );
    setIsLoading(false);
  };
  const handleDelete = id => {
    deleteProduct(id);
  };

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = text => {
    setSearchText(text);
    setIsLoading(true);

    if (text.trim().length > 0) {
      const filteredData = products.filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filteredData);
    } else {
      setFilteredProducts(products);
    }
    setIsLoading(false);
  };

  if (isLoading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchbox}>
          <Icon name="search1" size={25} color="#007bff" />
          <TextInput
            placeholder="Search items..."
            placeholderTextColor="#888"
            style={styles.searchtext}
            value={searchText}
            onChangeText={text => handleSearch(text)}
          />
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#007bff',
            borderRadius: 5,
            padding: 2,
            elevation: 5,
          }}>
          <Text style={styles.logoutButton}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.shopInfo}>
        <Text style={styles.shopTitle}>Hi-Fi Shop & Service</Text>
        <Text style={styles.shopSubtitle}>Audio shop on Rusavali Ave 57.</Text>
        <Text style={styles.shopSubtitle}>
          This shop offers both products and services.
        </Text>
      </View>

      <View style={styles.productHeader}>
        <View style={styles.productHeaderLeft}>
          <Text style={styles.productTitle}>Products</Text>
          <Text style={styles.productCount}>{filteredProducts?.length}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.showAllButton}>Show all</Text>
        </TouchableOpacity>
      </View>

      {filteredProducts?.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredProducts}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          renderItem={({item}) => (
            <View style={styles.productCard}>
              {item.image && (
                <View style={styles.productImageContainer}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.productImage}
                  />
                </View>
              )}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 15,
                  top: 15,
                  backgroundColor: '#fffb',
                  padding: 5,
                  borderRadius: 50,
                  zIndex: 50,
                }}
                onPress={() => handleDelete(item.id)}>
                <Icon name="delete" size={25} color={'black'} />
              </TouchableOpacity>
              <View style={styles.content}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
            </View>
          )}
          // contentContainerStyle={styles.productList}
        />
      ) : (
        <View style={styles.notFound}>
          <Image
            source={require('../public/Assets/not-found.png')}
            style={{
              width: 150,
              height: 150,
              objectFit: 'cover',
              borderRadius: 20,
            }}
          />
          <Text style={styles.notFoundText}>Product not found</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.Add}
        onPress={() => navigation.navigate('add-product')}>
        <Icon name="plus" color="white" size={40} />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  loadingText: {
    fontSize: 18,
    color: '#007bff',
    marginTop: 10,
  },
  searchbox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  searchtext: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: 'black',
  },
  logoutButton: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
    padding: 5,
  },
  shopInfo: {
    marginBottom: 20,
  },
  shopTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBlock: 10,
  },
  shopSubtitle: {
    fontSize: 16,
    color: '#939185',
    marginBlock: 2,
  },

  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productCount: {
    fontSize: 16,
    color: '#939185',
  },
  showAllButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '700',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 5,
    width: '46%',
    marginHorizontal: '2.5%',
    elevation: 1,
  },
  productImageContainer: {
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  productImage: {
    width: 120,
    height: 130,
    resizeMode: 'cover',
    marginInline: 'auto',
    borderRadius: 5,
  },
  content: {
    padding: 10,
  },
  productName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 15,
    color: '#939185',
  },
  Add: {
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 25,
    right: 25,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 25,
    fontWeight: '700',
    color: '#007bff',
    // fontFamily: 'roboto',
  },
});
