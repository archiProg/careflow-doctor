import { BG } from "@/constants/styles";
import Provider from "@/services/providerService";
import { RootState } from "@/stores";
import { closeSocket } from "@/utilitys/socket";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";



export default function SettingsScreen() {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [biometric, setBiometric] = useState(false);
    const [appVersion, setAppVersion] = useState('');
    const [buildNumber, setBuildNumber] = useState('');
    const router = useRouter();
    const { status, startWork, times } = useSelector(
        (state: RootState) => state.work
    );
    const logout = async () => {
        try {
            Provider.Token = "";
            await AsyncStorage.multiRemove(["email", "password", "token", "user"]);
            closeSocket();
            router.replace("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        const appVersion = DeviceInfo.getVersion();
        const buildNumber = DeviceInfo.getBuildNumber();
        setAppVersion(appVersion);
        setBuildNumber(buildNumber);
    }, []);

    return (
        <SafeAreaView edges={['top', 'bottom']} className={`flex-1 ${BG.default} bg-gray-50 p-4`}>
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header */}
                <View className="flex-row items-center bg-white rounded-2xl dark:bg-gray-800 p-4">
                    {/* Profile Image */}
                    <View className="relative">
                        {Provider.Profile?.profile_image_url ? (
                            <Image
                                source={{
                                    uri: Provider.HostApi + Provider.Profile.profile_image_url,
                                }}
                                className="w-20 h-20 rounded-2xl"
                            />
                        ) : (
                            <View className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center">
                                <FontAwesome name="user-md" size={32} color="" />
                            </View>
                        )}
                        {/* Status Indicator */}
                        <View
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${status === "start_work"
                                ? "bg-green-500"
                                : status === "paused_work"
                                    ? "bg-orange-500"
                                    : "bg-gray-400"
                                }`}
                        />
                    </View>

                    {/* Profile Info */}
                    <View className="flex-1 ml-4 ">
                        <Text className={`text-black dark:text-white mb-1`}>
                            {Provider.Profile?.name || "Doctor"}
                        </Text>
                        <Text
                            className={`text-gray-500 dark:text-gray-400 mb-2`}
                        >
                            {t('role-doctor')}
                        </Text>
                    </View>
                </View>

                {/* Account */}
                <View className="mt-6">
                    <Text className="text-xs font-semibold text-gray-500 uppercase px-6 mb-2">
                        {t('account')}
                    </Text>
                    <View className="bg-white  rounded-2xl dark:bg-gray-800">
                        <Pressable className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100" onPress={() => router.push("/main/pages/settings/manageProfile")}>
                            <View className="flex-row items-center">
                                <FontAwesome name="user" size={20} color="#6B7280" />
                                <Text className="ml-4 text-gray-800 dark:text-white">{t('manage-profile')}</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
                        </Pressable>
                        <Pressable className="flex-row items-center justify-between px-6 py-4" onPress={() => router.push("/main/pages/settings/changePasswordPage")}>
                            <View className="flex-row items-center">
                                <FontAwesome name="lock" size={20} color="#6B7280" />
                                <Text className="ml-4 text-gray-800 dark:text-white">{t('change-password')}</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
                        </Pressable>
                    </View>
                </View>

                {/* Preferences */}
                <View className="mt-6">
                    <Text className="text-xs font-semibold text-gray-500 uppercase px-6 mb-2">
                        {t('preferences')}
                    </Text>
                    <View className="bg-white dark:bg-gray-800 rounded-t-2xl">
                        <Pressable className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <FontAwesome name="bell" size={20} color="#6B7280" />
                                <Text className="ml-4 text-gray-800 dark:text-white">{t('notifications')}</Text>
                            </View>
                            <View className={`w-12 h-7 rounded-full ${notifications ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                <View className={`w-5 h-5 rounded-full bg-white dark:bg-gray-800 mt-1 ${notifications ? 'ml-6' : 'ml-1'}`} />
                            </View>
                        </Pressable>
                        {/* <Pressable className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <FontAwesome name="moon-o" size={20} color="#6B7280" />
                                <Text className="ml-4 text-gray-800">Dark Mode</Text>
                            </View>
                            <View className={`w-12 h-7 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                <View className={`w-5 h-5 rounded-full bg-white mt-1 ${darkMode ? 'ml-6' : 'ml-1'}`} />
                            </View>
                        </Pressable>
                        <Pressable className="flex-row items-center justify-between px-6 py-4">
                            <View className="flex-row items-center">
                                <FontAwesome5 name="fingerprint" size={20} color="#6B7280" />
                                <Text className="ml-4 text-gray-800">Biometric Login</Text>
                            </View>
                            <View className={`w-12 h-7 rounded-full ${biometric ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                <View className={`w-5 h-5 rounded-full bg-white mt-1 ${biometric ? 'ml-6' : 'ml-1'}`} />
                            </View>
                        </Pressable> */}
                    </View>
                    <View className="bg-white dark:bg-gray-800 rounded-b-2xl">
                        <Pressable className="flex-row items-center justify-between px-6 py-4 " onPress={() => router.push("/main/pages/settings/languagePage")}>
                            <View className="flex-row items-center">
                                <FontAwesome name="language" size={20} color="#6B7280" />
                                <Text className="ml-4 text-gray-800 dark:text-white">{t('language')}</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
                        </Pressable>
                    </View>
                </View>

                {/* Legal */}
                <View className="mt-6">
                    <Text className="text-xs font-semibold text-gray-500 uppercase px-6 mb-2">
                        {t('legal')}
                    </Text>
                    <View className="bg-white dark:bg-gray-800 rounded-2xl">
                        <Pressable className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <FontAwesome name="shield" size={20} color="#6B7280" />
                                <Text className="ml-4 text-gray-800 dark:text-white">{t('privacy-policy')}</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
                        </Pressable>
                        <Pressable className="flex-row items-center justify-between px-6 py-4">
                            <View className="flex-row items-center">
                                <FontAwesome name="file-text-o" size={20} color="#6B7280" />
                                <Text className="ml-4 text-gray-800 dark:text-white">{t('terms-conditions')}</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
                        </Pressable>
                    </View>
                </View>

                {/* Logout */}
                <View className="mt-6 ">
                    <Pressable
                        onPress={() => {
                            logout();
                        }}
                        className="bg-red-500 py-4 rounded-lg items-center"
                    >
                        <Text className="text-white font-semibold text-base">{t('logout')}</Text>
                    </Pressable>
                </View>

                {/* Version */}
                <View className="items-center py-6 mb-20" >
                    <Text className="text-gray-400 text-sm">
                        {t('version')} {appVersion}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}
