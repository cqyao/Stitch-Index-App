import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { StatusBar } from 'expo-status-bar'
import { router } from "expo-router";
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import Button from '../components/GoogleButton'
import MainButton from '../components/Button'
import Input from '../components/Input'
import { Stack } from "expo-router";

const Login = () => {
    const onSubmit = ()=>{
        router.push({
            pathname: "./dashboard",
        })
    }
    return (
        /* LOGIN SCREEN */
        <ScreenWrapper bg="white">
            <StatusBar style="dark" />
            <View style={styles.container}>
                {/* Place Logo */}
                <Image style={styles.logo} source={require('../assets/images/Logo.png')}/>
                {/* Login text */}
                <View>
                    <Text style={styles.loginText}>Login to Account</Text>
                </View>
                {/* Login Text */}
                <View style={styles.form}>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.text, textAlign: 'center', fontFamily: 'Inter'}}>
                        Log in now to continue with your account
                    </Text>
                </View>
                {/* Google Logo & Button */}
                <View style={styles.form}>
                    <Image style={styles.google} source={require('../assets/images/Google.png')}/>
                    <Button title={'Sign in With Google'} onPress={onSubmit}/>
                </View>
                {/* OR line */}
                <View style={styles.lineStyle}>
                    <View style={{flex:1, height:1, backgroundColor:'black'}}></View>
                    <Text style={{width:wp(15), fontSize: hp(1.5), color: theme.colors.text, textAlign: 'center', fontFamily: 'Inter'}}>
                            OR
                    </Text>
                    <View style={{flex:1, height:1, backgroundColor:'black'}}></View>
                </View>
                {/* Email Input */}
                <View style={styles.form}>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.text, textAlign: 'left', fontFamily: 'Inter', left: wp(2), top: hp(1)}}>
                        Email Address
                    </Text>
                    <Input
                        placeholder='Enter your username'
                        onChangeText={value=>{}}
                    />
                </View>
                {/* Password Input */}
                <View style={styles.form}>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.text, textAlign: 'left', fontFamily: 'Inter', left: wp(2), top: hp(1)}}>
                        Password
                    </Text>
                    <Input
                        placeholder='Enter your password'
                        onChangeText={value=>{}}
                    />
                </View>
                {/* Continue Button */}
                <View style={styles.mainbutton}>
                    <MainButton title={'Continue'} onPress={onSubmit}/>
                </View>
                {/* Forgot Password */}
                <View>
                    <Text style={{fontSize: hp(1.7), color: theme.colors.primary, textAlign: 'center', fontFamily: 'Inter', fontWeight: theme.fonts.bold, top: hp(2.5)}}>
                        Forgot Password?
                    </Text>
                </View>
                {/* Create Account */}
                <View style={styles.footer}>
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.footerText}>
                            Don't have an account?
                        </Text>
                        <Pressable>
                            <Text style={[styles.footerText, {color:theme.colors.primary,fontFamily: 'Inter', fontWeight: theme.fonts.bold}]}>
                                Sign-up
                            </Text>
                        </Pressable>
                    </View>
                </View>

            </View>
        </ScreenWrapper>
    )
}

export default Login

/* style sheets to modify content */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        paddingHorizontal: wp(5),
    },
    logo:{
        alignSelf: 'center',
    },
    google:{
        width: wp(8),
        height: hp(4),
        left: wp(14),
        top: hp(2.3),
        position: "absolute",
        justifyContent:'center',
    },
    mainbutton:{
        top: hp(2.5),
    },
    loginText:{
        fontSize: hp(3),
        fontWeight: theme.fonts.bold,
        color: '#157F86',
        textAlign: 'center',
        fontFamily: 'Lato',
    },
    form: {
        gap: 15,
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
    },
    lineStyle: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        alignItems: 'center',
    },
    footer:{
        gap: 30,
        width: '100%',
    },
    bottomTextContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
        paddingVertical: 50,
    }
})