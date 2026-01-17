import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, ViewStyle, StatusBarStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenViewProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  statusBarBackgroundColor?: string;
  statusBarStyle?: StatusBarStyle;
  hideStatusBar?: boolean;
}

const ScreenView: React.FC<ScreenViewProps> = ({
  children,
  style,
  statusBarBackgroundColor = 'white',
  statusBarStyle = 'dark-content',
  hideStatusBar = false,
}) => {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, style]}>
      {!hideStatusBar && (
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={statusBarStyle}
          translucent={false}
          hidden={false}
          animated
        />
      )}
      {children}
    </SafeAreaView>
  );
};

export default ScreenView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
