import { WebView } from "react-native-webview";

export default function Home() {
  return (
    <WebView
      source={{
        uri: "https://cooperation-4rzk.vercel.app"
      }}
    />
  );
}