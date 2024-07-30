import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window"); 

const deviceHeight = height;
const deviceWidth = width;

export const hp = percentage=>{
    return(percentage*deviceHeight) / 100;
}

export const wp = percentage=>{
    return(percentage*deviceWidth) / 100;
}