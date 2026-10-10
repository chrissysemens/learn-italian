import {
  StyleSheet,
  Text,
} from 'react-native';

import { colours } from '../../theme/colours';
import { typography } from '../../theme/typography';
import { Screen } from '../../components/screen';

export const ErrorScreen = () => {
  return (
    <Screen style={styles.container}>
      <Text style={styles.text}>
        Oops! Something went wrong.
      </Text>   
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  text: {
    color: colours.text,
    fontFamily: typography.regular,
  },
});
