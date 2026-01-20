import { TEXT_SIZE } from "@/constants/styles";
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
        <SafeAreaView className="flex-1 h-full bg-secondary ">
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

            {/* Content */}
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-8"
            >
                {/* Card Container */}
                <View className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <View className="bg-blue-500 px-6 py-8">
                        <Text className="text-2xl font-bold text-white text-center">
                            {t('summarize-diagnosis')}
                        </Text>
                    </View>

                    {/* Content Section */}
                    <View className="p-6">
                        {/* Patient Info */}
                        <View className="rounded-2xl p-5 mb-4 border-l-4 border-blue-500">
                            <Text className={`${TEXT_SIZE.medium} font-semibold text-blue-700 mb-1`}>
                                {t('patient')}
                            </Text>
                            <Text className="text-lg text-gray-900 font-medium">
                                {record.patientName}
                            </Text>
                        </View>

                        {/* Doctor Info */}
                        <View className="bg-emerald-50 rounded-2xl p-5 mb-4 border-l-4 border-emerald-500">
                            <Text className="text-sm font-semibold text-emerald-700 mb-1">
                                {t('doctor-check')}
                            </Text>
                            <Text className="text-lg text-gray-900 font-medium">
                                {Provider.Profile?.name}
                            </Text>
                        </View>

                        {/* Symptoms */}
                        <View className="bg-amber-50 rounded-2xl p-5 mb-4 border-l-4 border-amber-500">
                            <Text className="text-sm font-semibold text-amber-700 mb-2">
                                {t('symptoms')}
                            </Text>
                            <Text className="text-base text-gray-800 leading-6">
                                {record?.symptoms}
                            </Text>
                        </View>

                        {/* Medication */}
                        <View className="bg-purple-50 rounded-2xl p-5 mb-4 border-l-4 border-purple-500">
                            <Text className="text-sm font-semibold text-purple-700 mb-2">
                                {t('medication')}
                            </Text>
                            <Text className="text-base text-gray-800 leading-6">
                                {record?.medication}
                            </Text>
                        </View>

                        {/* Doctor Note */}
                        <View className="bg-indigo-50 rounded-2xl p-5 border-l-4 border-indigo-500">
                            <Text className="text-sm font-semibold text-indigo-700 mb-2">
                                {t('doctorNote')}
                            </Text>
                            <Text className="text-base text-gray-800 leading-6">
                                {record?.doctorNote}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PatientHisDetail;