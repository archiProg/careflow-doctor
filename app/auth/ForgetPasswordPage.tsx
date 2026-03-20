import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Pressable, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgetPasswordPage = () => {
    const colorScheme = useColorScheme();
    const { email } = useLocalSearchParams();
    const { t } = useTranslation();
    const [forgetEmail, setForgetEmail] = useState<string>(Array.isArray(email) ? email[0] : email);
    const { height, width } = useWindowDimensions();
    const router = useRouter();

    const BASE_WIDTH = width > height ? height : width;

    const handleBack = () => {
        router.back();
    };

    useEffect(() => {
        const backAction = () => {
            handleBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);


    return (
        <SafeAreaView className={`h-full bg-white dark:bg-gray-900 justify-center items-center`}
        >
            <View className="flex w-full   justify-start items-start">
                <Pressable
                    className="flex-row items-center justify-start px-3 rounded-full"
                    onPress={() => {
                        handleBack();
                    }}
                >
                    <FontAwesome
                        name="angle-left"
                        size={36}
                        color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                </Pressable>
            </View>
            <ScrollView className="flex p-4" style={{ width: BASE_WIDTH }}>
                {/* Header */}
                <View className="items-center mb-8">
                    <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-4 shadow-lg">
                        <FontAwesome
                            name="envelope"
                            size={36}
                            color="#000"
                            className="text-black dark:text-white"
                        />
                    </View>
                    <Text className="text-3xl font-bold text-gray-800 mb-2 text-center dark:text-white">
                        {t("forget_password_title")}
                    </Text>
                    <Text className="text-base text-gray-600 text-center dark:text-gray-400 mb-4">
                        {t("forget_password_subtitle")}
                    </Text>
                </View>
                <TextInput
                    className={`h-[56px] mb-[8px] rounded-[24px] px-4 border-[1px] border-gray-900 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder:text-gray-400 dark:border-gray-200 dark:text-white`}
                    placeholder={t("placeholder_email")}
                    keyboardType="email-address"
                    value={forgetEmail}
                    onChangeText={setForgetEmail}
                />
            </ScrollView>
            <View className="flex-1 p-4 justify-end" style={{ width: BASE_WIDTH }}
            >
                <TouchableOpacity
                    disabled={forgetEmail == null}
                    className={`bg-black py-4 mb-4 mx-4 rounded-[24px] h-[56px] items-center shadow-lg  dark:bg-[#2196F3] ${forgetEmail == null ? "opacity-50" : ""}`}
                    onPress={() => { }}
                    activeOpacity={0.8}
                >
                    <Text className="text-white text-lg font-semibold">{t("send")}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ForgetPasswordPage
