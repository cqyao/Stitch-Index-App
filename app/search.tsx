import { View, Text, Image, SafeAreaView, StyleSheet, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Link, useNavigation, useRouter } from "expo-router";
import Input from '../components/SearchInput'
import TagsInput from '../components/TagsInput'
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import entitycomponent from '@/components/entitycomponent';
import EntityComponent from '@/components/entitycomponent';

const search = () => {
    const router = useRouter();
    return (
    <View style={{flex: 1,backgroundColor: 'white'}}>
        <View style={styles.banner}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={35} color="black" />
          </Pressable>
          <Image 
            source={require('../assets/images/profilePics/dwayneJo.jpg')}
            style={{height: 45, width: 45, borderRadius: 90}}
          />
        </View>

        <View style={styles.searchInput}>
            <Input
                placeholder='Search'
                onChangeText={()=>{}}
            />
            <View style={styles.lineStyle}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
            </View>
            <TagsInput/>
        </View>
        {/* Patients */}
        <View>
            <View style={styles.headerRow}>
                <Text style={styles.titles}> Patients</Text>
                {/* navigate to Patients page */}
                <Pressable onPress={() => ({})}>
                    <Text style={styles.seeall}> See All</Text>
                </Pressable>
            </View>
          {/* CAN CHANGE THESE FIELDS BASED ON SEARCH RESULTS WILL HAVE TO CHANGE THEIR NAVIGATION TOO */}
            <View style={styles.section}>
            <Pressable onPress={() => ({})}>
                <EntityComponent imageSource={require("../assets/images/profilePics/dwayneJo.jpg")} title="Dr. John Le"/>
            </Pressable>
            <Pressable onPress={() => ({})}>
                <EntityComponent imageSource={require("../assets/images/profilePics/dwayneJo.jpg")} title="Aneta Guzowska"/>
            </Pressable>
            <Pressable onPress={() => ({})}>
                <EntityComponent imageSource={require("../assets/images/profilePics/dwayneJo.jpg")} title="Drake Graham"/>
            </Pressable>
            </View>
        </View>
        {/* Records */}
        <View>
            <View style={styles.headerRow}>
                <Text style={styles.titles}> Records</Text>
                {/* navigate to records page */}
                <Pressable onPress={() => ({})}>
                    <Text style={styles.seeall}> See All</Text>
                </Pressable>
            </View>
          {/* CAN CHANGE THESE FIELDS BASED ON SEARCH RESULTS WILL HAVE TO CHANGE THEIR NAVIGATION TOO */}
          <View style={styles.section}>
            <Pressable onPress={() => ({})}>
                <EntityComponent imageSource={require("../assets/images/medical-records.png")} title="Dr. John Le Records"/>
            </Pressable>
            <Pressable onPress={() => ({})}>
                <EntityComponent imageSource={require("../assets/images/medical-records.png")} title="Aneta Guzowska Records"/>
            </Pressable>
            <Pressable onPress={() => ({})}>
                <EntityComponent imageSource={require("../assets/images/medical-records.png")} title="Drake Graham Records"/>
            </Pressable>
            </View>
        </View>
        {/* Courses */}
        <View>
            <View style={styles.headerRow}>
                <Text style={styles.titles}> Courses</Text>
                {/* navigate to courses page */}
                <Pressable onPress={() => ({})}>
                    <Text style={styles.seeall}> See All</Text>
                </Pressable>
            </View>
          {/* CAN CHANGE THESE FIELDS BASED ON SEARCH RESULTS WILL HAVE TO CHANGE THEIR NAVIGATION TOO */}
          <View style={styles.section}>
            <Pressable onPress={() => ({})}>
                <EntityComponent imageSource={require("../assets/images/courses.png")} title="Anatomy Foundations"/>
            </Pressable>
            <Pressable onPress={() => ({})}>
                <EntityComponent imageSource={require("../assets/images/courses.png")} title="Optometry For Beginners"/>
            </Pressable>
            <Pressable onPress={() => ({})}>
                <EntityComponent imageSource={require("../assets/images/courses.png")} title="Identifying Cancer"/>
            </Pressable>
            </View>
        </View>
    </View>
    
    )
}

export default search

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, 
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  searchInput: {
    marginTop: 5,
    marginHorizontal: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  lineStyle: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    alignItems: "center",
  },
  orText: {
    width: wp(15),
    fontSize: hp(1.5),
    color: theme.colors.text,
    textAlign: "center",
    fontFamily: "Inter",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titles: {
    paddingTop: 30,
    paddingHorizontal: 25,
    color: "#666666",
    fontFamily: "Inter",
    fontWeight: 'bold',
  },
  seeall: {
    paddingTop: 30,
    paddingHorizontal: 25,
    color: "#00D6B5",
    fontFamily: "Inter",
    fontWeight: "700",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
  }
})