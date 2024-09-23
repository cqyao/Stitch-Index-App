import { View, Text, StyleSheet, Image, Pressable, ImageRequireSource } from 'react-native'
import React from 'react'

interface EntityComponentProps {
    imageSource: string | ImageRequireSource; // Use string for URI or ImageRequireSource for local images
    title: String;
}

const EntityComponent: React.FC<EntityComponentProps> = ({ imageSource, title}) => {
    function RenderImage() {
        return (
          <View>
            {imageSource != "" ? (
              <Image 
              source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
              style={{height: 60, width: 60, borderRadius: 90, borderColor: "#FF6231",
                borderWidth: 2}}
              />
            ) : (
              <View />
            )
            }
          </View>
        )
      }

      return (
        <View style={styles.container}>
          <RenderImage />
          <Text style={styles.text} numberOfLines={2}>{title}</Text>
        </View>
      )
}

export default EntityComponent

const styles = StyleSheet.create({
  container: {
    margin: 5,
    backgroundColor: "white",
    width: 100,
    height: 100,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    top: 5,
    textAlign: "center",
  }
})