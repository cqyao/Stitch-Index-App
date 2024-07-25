import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Features = ({ name }) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
      </View>
      <Text style={styles.name}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "30%",
    alignItems: "center",
  },
  box: {
    borderWidth: 2,
    borderColor: "#FF6231",
    borderRadius: 15,
    width: "100%",
    height: 120,
    marginTop: 10,
    backgroundColor: "white",
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.2
  },
  name: {
    color: "#7D7D7D",
    paddingTop: 10,
  }
});

export default Features