import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { Course } from '../app/courses';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

type SliderProps = {
    item: Course;
    index: number;
    scrollX: SharedValue<number>;
    isSelected: boolean;
    handleCoursePress: (course: Course) => void;
    handlePurchaseCourse: (course: Course) => void;
};

const { width } = Dimensions.get('window');

const SliderItem = ({
                        item,
                        index,
                        scrollX,
                        isSelected,
                        handleCoursePress,
                        handlePurchaseCourse,
                    }: SliderProps) => {
    const rnAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [-width * 0.25, 0, width * 0.25],
                        Extrapolation.CLAMP
                    ),
                },
                {
                    scale: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [0.8, 1, 0.8],
                        Extrapolation.CLAMP
                    ),
                },
            ],
        };
    });

    const handlePress = () => {
        if (isSelected) {
            console.log(item.image);
            handlePurchaseCourse(item);
        } else {
            handleCoursePress(item);
        }
    };

    return (
        <Animated.View style={[styles.ItemContainer, rnAnimatedStyle]}>
            <TouchableOpacity onPress={handlePress} activeOpacity={60}>
                {/* Display course image if available, otherwise show a placeholder */}
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderImage}>
                    </View>
                )}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.background}
                >
                    <View style={styles.topIcons}>
                        <View style={styles.infoRow}>
                            <Text style={styles.time}>{item.time} min</Text>
                            <Text style={styles.price}>${item.price}</Text>
                        </View>
                    </View>
                    <View style={styles.text}>
                        {/*<Text style={styles.description}>{item.tag}</Text>*/}
                        <StarRatingDisplay
                            rating={item.rating}
                            starSize={20}
                            maxStars={Math.floor(item.rating)}
                            style={styles.star}
                        />

                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.blurb}</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default SliderItem;

const styles = StyleSheet.create({
    ItemContainer: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 300,
        height: 500,
        borderRadius: 25,
    },
    placeholderImage: {
        width: 300,
        height: 500,
        borderRadius: 15,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        position: 'absolute',
        width: 300,
        height: 500,
        borderRadius: 25,
        justifyContent: 'space-between',
    },
    topIcons: {
        alignItems: 'flex-end',
        padding: 10,
    },
    text: {
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    description: {
        color: '#fff',
        fontSize: 12,
        letterSpacing: 1.2,
    },
    star: {
        left: -6,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    time: {
        color: '#fff',
        fontSize: 12,
        width: 80, // Fixed width for time to prevent stretching
        textAlign: 'left',
        right: 100,
    },
    price: {
        color: '#fff',
        fontSize: 12,
        width: 80, // Fixed width for price to prevent stretching
        textAlign: 'right',
    },
});
