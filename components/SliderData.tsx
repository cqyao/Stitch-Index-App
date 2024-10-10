import { ImageSourcePropType} from "react-native";

export type ImageSliderType = {
    title: string;
    image: ImageSourcePropType;
    description: string;
}

export const ImageSlider = [
    {
        title: "Welcome to the App!",
        image: require("../assets/images/1.png"),
        description: "This is the first slide of the app!"
    },
    {
        title: "Second Slide",
        image: require("../assets/images/2.png"),
        description: "This is the second slide of the app!"
    },
    {
        title: "Third Slide",
        image: require("../assets/images/3.png"),
        description: "This is the third slide of the"
    }
]