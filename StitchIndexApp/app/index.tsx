import { Text, TouchableOpacity, SafeAreaView, StyleSheet, View } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import Features from "../components/Features";
import Appointment from "../components/Appointment";

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Text>Stitch</Text>
        <TouchableOpacity style={styles.profilePic}>
          <MaterialIcons name="face" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.panel}>
        <View style={styles.search}>
          <Text style={styles.h3}>Search</Text>
          <FontAwesome name="search" size={20} />
        </View>
        <View style={styles.features}>
          <Text style={[styles.h2, { color: "#148085" }]}>Features</Text>
          <View style={styles.row}>
            <Features name="My Patients" /> 
            <Features name="Research" /> 
            <Features name="Calendar" />
          </View>
        </View>
        <View style={styles.appointments}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline"  }}>
            <Text style={[styles.h2, { color: "#148085" }]}>Appointments</Text>
            <Text style={[styles.h3, { color: "#02D6B6", fontWeight: "600", }]}>See All</Text>
          </View>
          <View>
            <Appointment date="Fri Nov 1" timeFrom={"8:30"} timeTo={"9:30"}/>
          </View>
        </View>  
      </View>
      
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  banner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  panel: {
    flex: 3,
    backgroundColor: "white",
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
  },
  profilePic: {
    flexDirection: "row",
    marginRight: 15,
    borderWidth: 2,
    height: 55,
    width: 55,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#02D6B6",
    borderRadius: 45,
  },
  search: {
    flexDirection: "row",
    padding: 10,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#02D6B6",
    borderRadius: 15,
    width: "80%",
    height: 50,
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: '#grey',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.2
  },
  features: {
    marginHorizontal: 40,
    marginTop: 20,
  },
  row: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    gap: 10
  },
  appointments: {
    marginHorizontal: 40,
    marginTop: 20,

  },
  h1: {

  },
  h2: {
    fontSize: 25,
    fontWeight: "600",
  },
  h3: {
    fontSize: 15,
    fontWeight: "300",
    color: "#7D7D7D",
  },
})

export default Dashboard;