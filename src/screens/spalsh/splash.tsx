import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import {
  useEffect,
  useRef,
} from 'react';

import { colours } from '../../theme/colours';
import { Screen } from '../../components/screen';
import Logo from '../../../assets/logo.svg';

export const SplashScreen = () => {
    const dot1Opacity = useRef(
    new Animated.Value(0.2),
    ).current;

    const dot2Opacity = useRef(
    new Animated.Value(0.2),
    ).current;

    const dot3Opacity = useRef(
    new Animated.Value(0.2),
    ).current;

    const dot4Opacity = useRef(
    new Animated.Value(0.2),
    ).current;

    const dot5Opacity = useRef(
    new Animated.Value(0.2),
    ).current;

    

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence(
        [dot1Opacity, dot2Opacity, dot3Opacity, dot4Opacity, dot5Opacity].map(
          opacity => Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.2,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    );

    animation.start();

    return () => animation.stop();
  }, [dot1Opacity, dot2Opacity, dot3Opacity, dot4Opacity, dot5Opacity]);

  return (
    <Screen style={styles.container}>
      <Logo width={180} height={90} />

      <View style={styles.dots}>
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot1Opacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot2Opacity, 
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot3Opacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot4Opacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot5Opacity,
            },
          ]}
        />
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  dots: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 28,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colours.muted,
  },
});
