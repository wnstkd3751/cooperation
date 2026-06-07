import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{
          uri: "https://cooperation-4rzk.vercel.app"
        }}
        javaScriptEnabled
        domStorageEnabled
      />
    </SafeAreaView>
  );
}