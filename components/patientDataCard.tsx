import { Skeleton } from "moti/skeleton";
import React from "react";
import { Text, View } from "react-native";

type PatientValue = {
    title: string;
    value: string;
    unit: string;
};

type Props = {
    data?: PatientValue;
    loading?: boolean;
};

export default function PatientDataCard({ data, loading = false }: Props) {
    return (
        <View
            style={{ width: 160, height: 120 }} // fixed width & height
            className="bg-[#CCE4F7] rounded-xl shadow p-4"
        >
            {loading || !data ? (
                <View className="flex-1 justify-center items-center space-y-2">
                    <View className="mt-2">
                        <Skeleton width={100} height={18} radius={4} colorMode="light" />
                    </View>
                    <View className="mt-2">
                        <Skeleton width={100} height={18} radius={4} colorMode="light" />
                    </View>
                    <View className="mt-2">
                        <Skeleton width={100} height={18} radius={4} colorMode="light" />
                    </View>
                </View>
            ) : (
                <View className="flex-1 justify-center items-center space-y-2">
                    <Text className="text-2xl text-[#4E97E3] ">{data.value}</Text>
                    <Text className="text-md text-[#4E97E3]">{data.unit}</Text>
                    <Text className="text-lg font-bold text-gray-600">{data.title}</Text>

                </View>
            )}
        </View>
    );
}
