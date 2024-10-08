import { View, Text, StyleSheet, TextInput, Pressable} from 'react-native'
import { theme } from '../constants/theme'
import { useState } from 'react'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

function TagsInput() {
    const [tags, setTags] = useState([])
    const [input, setInput] = useState("")

    function addTag() {
        if(!input.trim())
            return
        setTags([...tags, input])
        this.textInput.clear()
    }

    const removeTag = (index) => {
        const newTagList = [...tags];
        newTagList.splice(index, 1);
        setTags(newTagList);
    }

    return (
        <View style={styles.tagsearch}>
            { tags.map((tag, index) => (
                <View style={styles.items} key={index}>
                    <View><Text style={{color: "white"}}>{tag}</Text></View>
                    <Pressable onPress={() => removeTag(index)}>
                        <View style={styles.close}><Text style={styles.closeText}>&times;</Text></View>
                    </Pressable>
                </View>
            )) }
            <View style={styles.enteritems}>
                <TextInput ref={input => { this.textInput = input }} onChangeText={(text) => setInput(text)} onSubmitEditing={() => {addTag()}} placeholder='Enter tag' placeholderTextColor="#666666" ></TextInput>
            </View>
            <View style={styles.searchIcon}>
                    <FontAwesome name="search" size={20} color="white" style={[styles.icon]}/>
            </View>
        </View>
        
    )
}

export default TagsInput;

const styles = StyleSheet.create({
  tagsearch: {
    paddingTop: 8,
    paddingBottom: 8,
    top: 10,
    gap: 2,
    borderWidth: 0.4,
    borderColor: '#00D6B5',
    borderWidth: 1,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  items: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: 'flex-start',
    borderRadius: 8,
    left: 10,
    backgroundColor: "#FF6231",
    padding: 5,
    paddingRight: 10,
  },
  enteritems: {
    flexDirection: "row",
    borderRadius: 8,
    marginHorizontal: 5,
    marginLeft: 20,
    flex: 1
  },
  close: {
    height: 15,
    width: 15,
    backgroundColor: "white",
    color: "black",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    left: 5,
    fontSize: 18
  },
  mainText: {
    color: "white",
    alignSelf: "center",
    justifyContent: "center",
    left: 2,
  },
  closeText: {
    textAlign: "center",
    fontSize: 10,
  },
  searchIcon: {
    alignContent: "center",
    backgroundColor: '#FF6231',
    height: 30,
    width: 30,
    borderRadius: 8,
    marginRight: 10
  },
  icon: {
    top: 4,
    textAlign: "center",
  },
});