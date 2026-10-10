import { Pressable, StyleSheet, View } from 'react-native';
import Logo from '../../assets/logo.svg';
import { colours } from '../theme/colours';

export const Header = () => (
  <View style={styles.container}>
    <Logo width={56} height={44} />
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Menu"
      onPress={() => {}}
      style={({ pressed }) => [styles.menu, pressed && styles.pressed]}
    >
      <View style={styles.line} />
      <View style={styles.line} />
      <View style={styles.line} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menu: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 12,
  },
  pressed: {
    backgroundColor: colours.buttonDisabled,
  },
  line: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: colours.text,
  },
});
