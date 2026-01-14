import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SummarizeScreen = () => {
  const { consult_id } = useLocalSearchParams<{
    consult_id: string;
  }>();

  const handleSubmit = () => {
    router.replace("/main/(tabs)/homeScreen");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text>{consult_id}</Text>
      <Button title="Submit" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

export default SummarizeScreen;
