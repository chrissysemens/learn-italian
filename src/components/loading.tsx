import { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Screen } from './screen';
import { colours } from '../theme/colours';
import { typography } from '../theme/typography';

interface Props {
    text?: string;
}

export const Loading = ({ text }: Props) => {
    const dots = useRef(Array.from({ length: 5 }, () => new Animated.Value(0.2))).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence(dots.map(opacity => Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.2,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]))),
        );
        animation.start();
        return () => animation.stop();
    }, [dots]);

    return (
        <Screen centered>
            {text && <Text style={styles.text}>{text}</Text>}
            <View style={styles.dots}>
                {dots.map((opacity, index) => (
                    <Animated.View
                        key={index}
                        style={[styles.dot, { opacity }]}
                    />
                ))}
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    text: {
        color: colours.muted,
        fontFamily: typography.regular,
        fontSize: 15,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    dots: {
        flexDirection: 'row',
        gap: 9,
    },

    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#B8B8B4',
    },
});
