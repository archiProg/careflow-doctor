import LoadingComp from "@/components/loadingComp";
import { UseCheckEmail } from "@/hooks/useCheckEmail";
import { useInternet } from "@/hooks/useInternet";
import Provider from "@/services/providerService";
import { RequestApi } from "@/services/requestApiService";
import { LoginResponse } from "@/types/loginModel";
import { JWT } from "@/utilitys/jwt";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const google_icon = require("@/assets/images/google_64.png");

const LoginPage = () => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState("dang@gmail.com");
  const [password, setPassword] = useState("1");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = useInternet();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!isConnected) {
        Alert.alert("No Internet", "Please check your connection");
        return;
      }

      if (!email || !password) {
        Alert.alert("Error", "Please enter email and password");
        return;
      }

      const api = new RequestApi();

      const body = {
        email,
        password,
      };

      const response = await api.postApi("/login", JSON.stringify(body));

      if (!response.success) {
        Alert.alert("API Error", JSON.stringify(response.response));
        return;
      }

      let getResponse: LoginResponse;

      try {
        getResponse = JSON.parse(response.response);
        Provider.Token = getResponse.token;
      } catch {
        Alert.alert("Parse Error", "Invalid response format");
        return;
      }

      if (!getResponse) {
        Alert.alert("Response Error", "Empty response");
        return;
      }

      if (getResponse.token) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
        await AsyncStorage.setItem("token", getResponse.token);
        JWT.setToken(getResponse.token);

        router.replace("/");
      } else {
        Alert.alert("Notification", getResponse.message ?? "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Unexpected Error", error?.message ?? "Something went wrong");
    }
  };

  const handleCheckEmail = async () => {
    try {
      let checkEmail = await UseCheckEmail(email);
      if (checkEmail.status == 0) {
        // router.replace({
        //   pathname: "/auth/RegisterPage",
        //   params: {
        //     email_param: email,
        //   },
        // });
        Alert.alert("Notification", "Email not found, please register.");
      } else {
        setIsPasswordVisible(true);
      }
    } catch (error: any) {
      console.error("Check email error:", error);
      Alert.alert("Unexpected Error", error?.message ?? "Something went wrong");
    }
  };

  const handleLanguageSelector = () => {
    router.replace({
      pathname: "/pages/settings/languagePage",
      params: {
        reference_page: "loginPage",
      },
    });
  };

  const handleApi = async (action: string) => {
    setIsLoading(true);
    if (action == "LOGIN") {
      await handleLogin();
    } else if (action == "CHECK_EMAIL") {
      await handleCheckEmail();
    }
    setIsLoading(false);
  };

  return (
    <>
      <SafeAreaView className="h-full p-4 bg-white dark:bg-gray-900">
        <View>
          <View className="flex flex-row justify-between items-center mb-8">
            <View>
              {isPasswordVisible && (
                <Pressable
                  className="flex-row items-center justify-start px-3 rounded-full"
                  onPress={() => {
                    setIsPasswordVisible(false);
                  }}
                >
                  <FontAwesome
                    name="angle-left"
                    size={36}
                    className=" text-black dark:text-white"
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                  />
                </Pressable>
              )}
            </View>
            <View className="flex flex-row ">
              {!isPasswordVisible && (
                <Pressable
                  className="flex-row items-center justify-center bg-white px-3 py-2 rounded-full shadow"
                  onPress={() => handleLanguageSelector()}
                >
                  <FontAwesome
                    name="globe"
                    size={24}
                    className=" text-black dark:text-white"
                  />
                </Pressable>
              )}
            </View>
          </View>

          {!isPasswordVisible ? (
            <>
              <Text className="text-lg font-bold text-black mb-[16px] dark:text-white">
                {t("please_email")}
              </Text>
              <TextInput
                className="h-[56px] mb-[16px] rounded-[24px]  border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 p-4 
                dark:border-gray-200 dark:text-white"
                placeholder={t("placeholder_email")}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <Pressable
                onPress={async () => {
                  await handleApi("CHECK_EMAIL");
                }}
                className="h-[56px] w-full rounded-[24px] bg-black items-center justify-center dark:bg-[#2196F3]"
              >
                <Text className=" text-center text-white font-bold">
                  {t("continue")}
                </Text>
              </Pressable>
              <Text className="text-center text-gray-400 mt-[16px] mb-[16px]">
                {t("or")}
              </Text>
              <Pressable
                onPress={async () => { }}
                className="h-[56px] w-full rounded-[24px] bg-white border-[1px] border-gray-900 items-center justify-center dark:border-gray-200"
              >
                <View className="flex flex-row items-center">
                  <Image
                    source={google_icon}
                    className="w-[24px] h-[24px] mr-4"
                  />
                  <Text className=" text-center text-black font-bold">
                    {t("continue_google")}
                  </Text>
                </View>
              </Pressable>
            </>
          ) : (
            <>
              <Text className="py-4  font-bold text-black dark:text-white">
                {email}
              </Text>
              <View className="flex-row items-center h-[56px] mb-[16px] rounded-[24px] px-4 border border-gray-900 dark:border-gray-200 focus-within:border-[#2196F3] dark:focus-within:border-[#64B5F6]">
                <TextInput
                  className="flex-1 text-black dark:text-white"
                  placeholder={t("placeholder_password")}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome
                    name={showPassword ? "eye" : "eye-slash"}
                    size={20}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </TouchableOpacity>
              </View>
              <Pressable
                onPress={async () => {
                  await handleApi("LOGIN");
                }}
                className="h-[56px] w-full rounded-[24px] bg-black items-center justify-center dark:bg-[#2196F3]"
              >
                <Text className=" text-center text-white font-bold">
                  {t("login")}
                </Text>
              </Pressable>
              <Text className="text-center text-gray-400 mt-[16px] mb-[16px]">
                {t("or")}
              </Text>
              <Pressable
                onPress={async () => { }}
                className="h-[56px] w-full rounded-[24px] bg-white border-[1px] border-gray-900 items-center justify-center dark:border-gray-200"
              >
                <View className="flex flex-row items-center">
                  <Image
                    source={google_icon}
                    className="w-[24px] h-[24px] mr-4"
                  />
                  <Text className=" text-center text-black font-bold">
                    {t("continue_google")}
                  </Text>
                </View>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
      {isLoading && (
        <SafeAreaView className="absolute w-full h-full flex items-center justify-center bg-black/50">
          <View className="w-48 h-48 rounded-xl bg-white overflow-hidden justify-center items-center dark:bg-gray-900">
            <LoadingComp />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default LoginPage;
