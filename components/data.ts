import {AnimationObject} from 'lottie-react-native';

export interface OnboardingData {
    id: number;
    animation: AnimationObject;
    text: string;
    textColor: string;
    backgroundColor: string;
}

const data: OnboardingData[] = [
    {
        id: 1,
        animation: require('../assets/Animations/Lottie1.json'),
        text: 'One app ,                       One Account',
        textColor: '#67beb1',
        backgroundColor: '#efefef',
    },
    {
        id: 2,
        animation: require('../assets/Animations/Lottie2.json'),
        text: 'Your meetings,                  calendars ',
        textColor: '#1e2169',
        backgroundColor: '#bae4fd',
    },
    {
        id: 3,
        animation: require('../assets/Animations/Lottie3.json'),
        text: 'Consultations and Records',
        textColor: '#FF6231',
        backgroundColor: '#84d9ca',
    },
];

export default data;