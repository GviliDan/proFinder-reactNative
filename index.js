import 'react-native-gesture-handler'; // Import this line at the top of the file
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

// Enable React Native Web
if (window.document) {
  AppRegistry.registerComponent(appName, () => () => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  ));
  AppRegistry.runApplication(appName, { initialProps: {}, rootTag: document.getElementById('app-root') });
}
