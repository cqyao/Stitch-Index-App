import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import ResearchPost from '@/components/ResearchPost'

const research = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ResearchPost name="John E. Singhs" likes={3} comments={25} imageSource={require("../assets/images/postImages/aneta.jpg")}/>
    </SafeAreaView>
  )
}

export default research

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30, 
  }
})