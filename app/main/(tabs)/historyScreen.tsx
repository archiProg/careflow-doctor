import DiagnosisHistoryComp from "@/components/diagnosisHistoryComp";
import { BG } from "@/constants/styles";
import { RequestApi } from "@/services/requestApiService";
import { DiagnosisRecord } from "@/types/diagnosisHistory";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HistoryScreen: React.FC = () => {
  const { height, width } = useWindowDimensions();

  const BASE_WIDTH = width > height ? height : width;
  const router = useRouter();
  const [treatMent, setTreatMent] = useState([]);

  const GetTreatment = async () => {
    const api = new RequestApi();
    try {
      const response = await api.postApiJwt(
        "/get-treatment_doctor",
        JSON.stringify({
          date_start: null,
          date_end: null,
        }),
      );
      if (response.success && response.response) {
        const raw = response.response;
        const data = JSON.parse(raw);
        setTreatMent(data);
      }
    } catch (error) {
      console.error("GetTreatment error:", error);
      return;
    }
  };

  useEffect(() => {
    GetTreatment();
  }, []);

  const handleRecordPress = (record: DiagnosisRecord) => {
    router.push({
      pathname: "/main/pages/historys/patientHisDetail",
      params: {
        diagnosisRecord: JSON.stringify(record),
      },
    });
  };

  return (
    <SafeAreaView className={`${BG.default} bg-secondary p-4 flex-1 justify-center items-center`}>
      <ScrollView className="flex p-4 " style={{ width: BASE_WIDTH }}
        showsVerticalScrollIndicator={false}>
        <DiagnosisHistoryComp
          records={treatMent}
          onRecordPress={handleRecordPress}
        />
      </ScrollView>

    </SafeAreaView>
  );
};

export default HistoryScreen;
