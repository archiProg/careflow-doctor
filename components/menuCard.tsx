import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { GestureResponderEvent, Text, TouchableOpacity, View } from "react-native";

type MenuCardProps = {
    title: string;
    detail: string;
    icon: React.ComponentProps<typeof FontAwesome5>["name"];
    onPress?: (event: GestureResponderEvent) => void;
};

const MenuCard: React.FC<MenuCardProps> = ({
    title,
    detail,
    icon,
    onPress,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center bg-white rounded-2xl p-4 mb-3 shadow"
        >
            <View className="w-14 h-14 rounded-xl bg-blue-50 items-center justify-center mr-4">
                <FontAwesome5 name={icon} size={28} color="#3B82F6" />
            </View>

            <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                    {title}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                    {detail}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default MenuCard;
