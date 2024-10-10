import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {ImageSliderType} from "@/components/SliderData";
import {SharedValue} from "react-native-reanimated";

type Props = {
    items: ImageSliderType[];
    paginationIndex: number;
    scrollX: SharedValue<number>;
}

const CoursesPagination = ({items, paginationIndex, scrollX}: Props) => {
    return (
        <View style={styles.container}>
            {items.map((_,index) => {
            return (
                <View key={index} style={styles.dot} />
                );
                })}
        </View>
    )
}

export default CoursesPagination;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        backgroundColor: '#aaa',
        height: 8,
        width: 8,
        marginHorizontal: 2,
        borderRadius: 8,
    }
});