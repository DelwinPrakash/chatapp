import 'dotenv/config';

export default {
  expo: {
    name: "chatapp",
    slug: "chatapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon1.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      "eas": {
        "projectId": "a5923275-206f-46eb-a8fc-88676278c791"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon1.png",
        backgroundColor: "#000000"
      },
      package: "com.delwin77.chatapp"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon1.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};
