import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native'
import React from 'react'
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Link, useNavigation, useRouter } from "expo-router";

const Input = (props) => {
  const router = useRouter();
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
      {
        props.icon && props.icon
      }
      <TextInput
        style={{flex: 1}}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
      {/* CAN ADD THE QUERY INSERTION HERE TO LOAD SEARCH WITH INPUT PARAMETERS*/}
      <Pressable onPress={() => router.push({pathname: './search'})}>
        <View style={[styles.searchIcon]}>
          <FontAwesome name="search" size={20} color="white" style={[styles.icon]}/>
        </View>
      </Pressable>
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(5.6),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: '#00D6B5',
        borderWidth: 1,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12
    },
    searchIcon: {
      backgroundColor: '#FF6231',
      height: 30,
      width: 30,
      borderRadius: 8,
    },
    icon : {
      top: 4,
      textAlign: "center",
    }
})