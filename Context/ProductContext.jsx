import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {createContext, useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';

export const ProductContext = createContext();

export const ProductProvider = ({children}) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const fetchProducts = async () => {
        const products = await AsyncStorage.getItem('products');
        setProducts(JSON.parse(products));
      };
      fetchProducts();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'somethis error try again',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = async ({AddProduct, navigation}) => {
    const {name, price, image} = AddProduct;
    const newProduct = {id: Date.now(), name, price, image};
    setIsLoading(true);
    try {
      const oldProducts = await AsyncStorage.getItem('products');

      if (oldProducts?.includes(name)) {
        Toast.show({
          type: 'error',
          text1: 'product is already added',
        });
      } else {
        const updatedProducts = oldProducts
          ? [...JSON.parse(oldProducts), newProduct]
          : [newProduct];
        setProducts(updatedProducts);
        await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
        Toast.show({
          type: 'success',
          text1: 'Product Added successfully',
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      Toast.show({
        type: 'error',
        text1: 'Faild to save product',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async id => {
    setIsLoading(true);
    try {
      const oldProducts = await AsyncStorage.getItem('products');
      const parsedProducts = oldProducts ? JSON.parse(oldProducts) : [];
      const updatedProducts = parsedProducts.filter(
        product => product.id !== id,
      );
      setProducts(updatedProducts);
      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));

      Toast.show({
        type: 'success',
        text1: 'Product deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      // Alert.alert('Error', 'Failed to delete product.');
      Toast.show({
        type: 'error',
        text1: 'Failed to delete product',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        createProduct,
        setIsLoading,
        deleteProduct,
      }}>
      {children}
    </ProductContext.Provider>
  );
};
