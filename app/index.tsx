import {StyleSheet, View, FlatList, ViewToken} from 'react-native';
import React, {useState} from 'react';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedRef,
} from 'react-native-reanimated';
import data, {OnboardingData} from '../components/data';
import Pagination from '../components/Pagination';
import CustomButton from '../components/CustomButton';
import RenderItem from '../components/RenderItem';

const OnboardingScreen = () => {
    const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
    const x = useSharedValue(0);
    const flatListIndex = useSharedValue(0);

    const onViewableItemsChanged = ({
                                        viewableItems,
                                    }: {
        viewableItems: ViewToken[];
    }) => {
        if (viewableItems[0].index !== null) {
            flatListIndex.value = viewableItems[0].index;
        }
    };


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Add a state to switch between sign up and login

  const handleSignUp = () => {
    if (!email || !password) {
      console.error("Email and password are required");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log("User Signed Up: ", user.email);
          router.push({
            pathname: "./dashboard",
          });
        })
        .catch((error) => {
          console.error("Error signing up:", error);
        });
  };

  const handleLogin = () => {
    if (!email || !password) {
      console.error("Email and password are required");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Logged in
          const user = userCredential.user;
          console.log("Logged In With: ", user.email);
          router.push({pathname: "./dashboard"});
        })
        .catch((error) => {
          console.error("Error signing in:", error);
        });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User Logged In: ", user.email);
        router.push("./dashboard");
      } else {
        console.log("User Logged Out");
      }
    });

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={flatListRef}
                onScroll={onScroll}
                data={data}
                renderItem={({item, index}) => {
                    return <RenderItem item={item} index={index} x={x} />;
                }}
                keyExtractor={item => item.id.toString()}
                scrollEventThrottle={16}
                horizontal={true}
                bounces={false}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    minimumViewTime: 300,
                    viewAreaCoveragePercentThreshold: 10,
                }}
            />
            <View style={styles.bottomContainer}>
                <Pagination data={data} x={x} />
                <CustomButton
                    flatListRef={flatListRef}
                    flatListIndex={flatListIndex}
                    dataLength={data.length}
                    x={x}
                />
            </View>
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 30,
        paddingVertical: 30,
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
    },
});