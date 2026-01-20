import { TEXT } from "@/constants/styles";
import Provider from "@/services/providerService";
import { DiagnosisRecord } from "@/types/diagnosisHistory";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Pressable, ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PatientHisDetail = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const router = useRouter();
    const { diagnosisRecord } = useLocalSearchParams();
    const record: DiagnosisRecord = diagnosisRecord
        ? JSON.parse(diagnosisRecord as string)
        : null;

    const handleBack = () => {
        router.back();
    };


    //back handler
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
        <SafeAreaView className="flex-1 h-full bg-white">
            <View className="flex w-full p-5 justify-start items-start">
                <Pressable
                    className="flex-row items-center justify-start px-3 rounded-full"
                    onPress={() => {
                        handleBack();
                    }}
                >
                    <FontAwesome
                        name="angle-left"
                        size={36}
                        className=" text-black dark:text-white"
                        color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                </Pressable>
            </View>
            <View className="flex-1 bg-white">
                <View className="flex-1">
                    <ScrollView
                        className="flex-1"
                        contentContainerClassName="p-4 pb-24"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="flex-1 bg-gray-100 rounded-[16px] p-4 shadow-lg">
                            <View className="flex-1 justify-center items-center">
                                <Text className={`${TEXT.subtitle} text-blue-500`}>{t('summarize-diagnosis')}</Text>
                            </View>

                            <View className="flex-1 my-8 gap-y-8">
                                <View className="flex-row">
                                    <Text className={`text-gray-600 text-md text-blue-500`}>{t('patient')} : </Text>
                                    <Text className="flex-1">{record.patientName}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className={`text-gray-600 text-md text-blue-500`}>{t('doctor-check')} : </Text>
                                    <Text className="flex-1">{Provider.Profile?.name} </Text>
                                </View>
                                <View className="flex-row">
                                    <Text className={`text-gray-600 text-md text-blue-500`}>{t('symptoms')} : </Text>
                                    <Text className="flex-1">{record?.symptoms}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className={`text-gray-600 text-md text-blue-500`}>{t('medication')} : </Text>
                                    <Text className="flex-1">{record?.medication}</Text>
                                </View>
                                <View className="flex-row">
                                    <Text className={`text-gray-600 text-md text-blue-500`}>{t('doctorNote')} : </Text>
                                    <Text className="flex-1">{record?.doctorNote}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PatientHisDetail;