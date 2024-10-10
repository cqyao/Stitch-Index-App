// Slider.tsx

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import SliderItem from './SliderItem';
import { Course } from '../app/courses'; // Adjust the import path accordingly

type Props = {
    itemList: Course[];
    isSelected: boolean;
    handleCoursePress: (course: Course) => void;
    handlePurchaseCourse: (course: Course) => void;
};

const Slider = ({ itemList, isSelected, handleCoursePress, handlePurchaseCourse }: Props) => {
    const scrollX = useSharedValue(0);
    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        },
    });

    return (
        <View>
            <Animated.FlatList
                data={itemList}
                renderItem={({ item, index }) => (
                    <SliderItem
                        item={item}
                        index={index}
                        scrollX={scrollX}
                        isSelected={isSelected}
                        handleCoursePress={handleCoursePress}
                        handlePurchaseCourse={handlePurchaseCourse}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScrollHandler}
                keyExtractor={(item) => item.id}
            />
            {/* Include pagination if needed */}
        </View>
    );
};

export default Slider;

const styles = StyleSheet.create({});
