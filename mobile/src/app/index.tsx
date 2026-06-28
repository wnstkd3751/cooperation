import { WebView } from "react-native-webview";

export default function Home() {
  return (
    <WebView
      source={{
        uri: "https://cooperation-chi.vercel.app"
      }}
    />
  );
}