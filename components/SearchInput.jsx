import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const Input = ({ defaultValue = '', onSearch }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(defaultValue); // Initialize with defaultValue

  const handleSearchSubmit = () => {
    if (inputValue.trim()) {
      // If an `onSearch` function is passed as a prop, call it
      if (onSearch) {
        onSearch(inputValue);
      } else {
        // Otherwise, navigate to the search page with the query as a parameter
        router.push({
          pathname: './search',
          params: { query: inputValue }
        });
      }
    }
  };

  return (
    <View style={[styles.container]}>
      <TextInput
        style={{ flex: 1 }}
        placeholder="Search..."
        placeholderTextColor="#999"
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={handleSearchSubmit} 
      />
      <Pressable onPress={handleSearchSubmit}>
        <View style={styles.searchIcon}>
          <FontAwesome name="search" size={20} color="white" style={styles.icon} />
        </View>
      </Pressable>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: '#00D6B5',
    borderRadius: 20,
    paddingHorizontal: 18,
    gap: 12,
  },
  searchIcon: {
    backgroundColor: '#FF6231',
    height: 30,
    width: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  }
});