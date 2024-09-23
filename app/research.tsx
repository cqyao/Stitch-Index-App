import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import ResearchPost from '@/components/ResearchPost'

const research = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ResearchPost name="John E. Singhs" likes={3} comments={25} imageSource={require("../assets/images/postImages/aneta.jpg")}/>
        <ResearchPost name="Leonardo DaVinki" likes={125} comments={55} imageSource=""/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default research

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30, 
  }
})