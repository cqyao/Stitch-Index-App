import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'

const GoogleButton = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading = false,
    hasShadow = false,
}) => {
    const shadowStyle = {
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
    }

    if(loading)
    {
        return (
            <View style={[styles.button, buttonStyle, {backgroundColor: 'white'}]}>
                <Loading/>
            </View>
        )
    }
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  )
}

export default GoogleButton

const styles = StyleSheet.create({
    button:{
        backgroundColor: 'transparent',
        height: hp(8.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl,
        borderColor: '#00D6B5',
        borderWidth: 1,

    },
    text: {
        fontSize: hp(2.5),
        color: '#7D7D7D',
        fontWeight: theme.fonts.bold,
        fontFamily: 'Lato',
        left: wp(5.5),
    }
})