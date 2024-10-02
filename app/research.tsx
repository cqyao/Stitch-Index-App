import { View, Text, SafeAreaView, StyleSheet, ScrollView, Pressable, Image } from 'react-native'
import React, { useState } from 'react'
import ResearchPost from '@/components/ResearchPost'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const research = () => {
  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={35} color="white" />
          </Pressable>
          <Image
            source={require('../assets/images/LogoWhite.png')} 
            resizeMode='contain'
            style={styles.logo}
          />
          <Image 
            source={require('../assets/images/profilePics/dwayneJo.jpg')}
            style={{height: 45, width: 45, borderRadius: 90}}
          />
        </View>
        {/* End banner */}
      <ScrollView style={styles.postSection}>
        <ResearchPost name="John E. Singhs" likes={3} comments={25} imageSource={require("../assets/images/postImages/aneta.jpg")}/>
        <ResearchPost name="Leonardo DaVinki" likes={125} comments={55} imageSource=""/>
      </ScrollView>
    </View>
  )
}

export default research

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red"
  },
  logo: {
    width: 200,
    height: 70,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#00D6B5",
    flex: 0,
  },
  postSection: {
    flex: 9,
  }
})