import { StyleSheet, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { colours } from '../theme/colours';
import { Header } from './header';

interface Props extends ViewProps {
  centered?: boolean;
}

export const Screen = ({ style, children, centered = false, ...props }: Props) => (
  <View {...props} style={styles.container}>
    <Header />
    <View style={[styles.content, centered && styles.centered, style]}>
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 28,
  },
});
