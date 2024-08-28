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
        text: 'lemme put my ballws in yooo jawwss',
        textColor: '#005b4f',
        backgroundColor: '#e4e5df',
    },
    {
        id: 2,
        animation: require('../assets/Animations/Lottie2.json'),
        text: '(yo balls)',
        textColor: '#1e2169',
        backgroundColor: '#bae4fd',
    },
    {
        id: 3,
        animation: require('../assets/Animations/Lottie3.json'),
        text: 'balls in yo jawws',
        textColor: '#F15937',
        backgroundColor: '#faeb8a',
    },
];

export default data;