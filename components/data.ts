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
        text: 'test ',
        textColor: '#005b4f',
        backgroundColor: '#e4e5df',
    },
    {
        id: 2,
        animation: require('../assets/Animations/Lottie2.json'),
        text: 'test',
        textColor: '#1e2169',
        backgroundColor: '#bae4fd',
    },
    {
        id: 3,
        animation: 'https://lottie.host/9a0ab264-6673-456e-b952-89076683dc39/ZJNSvklkGo.json',
        text: 'test',
        textColor: '#F15937',
        backgroundColor: '#faeb8a',
    },
];

export default data;