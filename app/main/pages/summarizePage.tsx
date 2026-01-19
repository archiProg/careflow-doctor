import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SummarizeScreen = () => {
  const { consult_id } = useLocalSearchParams<{
    consult_id: string;
  }>();

  const handleSubmit = () => {
    router.replace("/main/(tabs)/homeScreen");
  };

  const handleViewDetails = () => {
    // นำทางไปหน้ารายละเอียด
    console.log("View details for:", consult_id);
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-green-50 to-blue-50">
      <ScrollView
        contentContainerClassName="flex-1 items-center justify-center p-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          {/* Success Icon */}
          <View className="items-center mb-6">
            <View className="bg-blue-100 rounded-full p-4">
              <Ionicons name="checkmark-circle" size={64} color="#60a3fcff" />
            </View>
          </View>

          {/* Main Message */}
          <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
            บันทึกสำเร็จ!
          </Text>

          <Text className="text-base text-gray-600 text-center leading-6 mb-8">
            ข้อมูลการปรึกษาของคุณได้รับการบันทึกเรียบร้อยแล้ว{"\n"}
            สามารถดูรายละเอียดได้ตลอดเวลา
          </Text>

          {/* Consult ID Box */}


          {/* Action Buttons */}
          <TouchableOpacity
            className="w-full bg-blue-500 active:bg-blue-500 py-4 px-6 rounded-xl mb-3"
            onPress={handleSubmit}
          >
            <Text className="text-white text-base font-semibold text-center">
              กลับหน้าหลัก
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SummarizeScreen;