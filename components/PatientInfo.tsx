import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';

export interface PatientProps {
    id: string | number,
    picture: string,
    name: string,
    gender: string,
    birthdateString: string,
    pronouns: string,
    mobile: string,
    email: string,
    symptoms: string[],
    tags: string[],
    PatientReport: string
}

const PatientInfo: React.FC<PatientProps> = ({
                                                 picture,
                                                 name,
                                                 gender,
                                                 birthdateString,
                                                 pronouns,
                                                 PatientReport
                                             }) => {
    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image
                    source={
                        picture
                            ? {uri: picture}
                            : require('../assets/images/postImages/aneta.jpg')
                    }
                    style={styles.profileImage}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.nameHeader}>{name}</Text>
                    <Text style={styles.regText}>Gender: {gender}</Text>
                    <Text style={styles.regText}>DOB: {birthdateString}</Text>
                    <Text style={styles.regText}>Pronouns: {pronouns}</Text>
                </View>
            </View>
        </View>
    );
};

export default PatientInfo;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: 'white',
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        height: 80,
        width: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    nameHeader: {
        color: '#FF6231',
        fontFamily: 'Lato',
        fontWeight: '900',
        fontSize: 20,
    },
    regText: {
        fontSize: 14,
        color: '#7D7D7D',
        fontWeight: 'bold',
        fontFamily: 'Lato',
        marginTop: 2,
    },
});
