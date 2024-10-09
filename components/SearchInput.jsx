import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const Input = ({ defaultValue = '', onSearch, placeholder = 'Search...' }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(defaultValue);

  // Ensure the input value updates when the defaultValue changes
  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleSearchSubmit = () => {
    if (inputValue.trim()) {
      if (onSearch) {
        onSearch(inputValue);  // Trigger the onSearch function if passed as a prop
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
        placeholder={placeholder}  // Use a custom placeholder or other will default to 'Search...'
        placeholderTextColor="#999"
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={handleSearchSubmit} // Trigger search on enter
      />
      <Pressable onPress={handleSearchSubmit}>
        <View style={styles.searchIcon}>
          <FontAwesome name="search" size={20} color="white" />
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
  }
});
