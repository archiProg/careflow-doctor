import { TEXT } from "@/constants/styles";
import Provider from "@/services/providerService";
import { PatientDataForm } from "@/types/patientData";
import { Pressable, ScrollView, Text, View } from "react-native";

interface SumDiagnosisCompProps {
    patientDataForm: PatientDataForm;
    onSend: (data: PatientDataForm) => void;
    onCancel: () => void;
}

const SumDiagnosisComp = ({ patientDataForm, onSend, onCancel }: SumDiagnosisCompProps) => {
    return (
        <View className="flex-1 bg-white">
            <View className="flex-1">
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="p-4 pb-24"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 bg-gray-100 rounded-[16px] p-4 shadow-lg">
                        <View className="flex-1 justify-center items-center">
                            <Text className={`${TEXT.subtitle} text-blue-500`}>สรุปผลตรวจ</Text>
                        </View>

                        <View className="flex-1 my-8 gap-y-8">
                            <View className="flex-row">
                                <Text className={`text-gray-600 text-md text-blue-500`}>ผู้ป่วย : </Text>
                                <Text className="flex-1">{patientDataForm.userName}</Text>
                            </View>
                            <View className="flex-row">
                                <Text className={`text-gray-600 text-md text-blue-500`}>หมอผู้ตรวจ : </Text>
                                <Text className="flex-1">{Provider.Profile?.name} </Text>
                            </View>
                            <View className="flex-row">
                                <Text className={`text-gray-600 text-md text-blue-500`}>อาการ : </Text>
                                <Text className="flex-1">{patientDataForm.symptoms}</Text>
                            </View>
                            <View className="flex-row">
                                <Text className={`text-gray-600 text-md text-blue-500`}>ยาที่สั่ง : </Text>
                                <Text className="flex-1">{patientDataForm.medication}</Text>
                            </View>
                            <View className="flex-row">
                                <Text className={`text-gray-600 text-md text-blue-500`}>ความคิดเห็นแพทย์ : </Text>
                                <Text className="flex-1">{patientDataForm.doctorNote}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Button */}
                <View className="flex-row gap-3 mx-4 mb-4">
                    {/* Back */}
                    <Pressable
                        onPress={() => onCancel()}
                        className="flex-1 h-[56px] rounded-[16px] items-center justify-center bg-gray-400"
                    >
                        <View className="flex-row items-center gap-2">
                            <Text className="text-white font-semibold">ย้อนกลับ</Text>
                        </View>
                    </Pressable>

                    {/* Submit */}
                    <Pressable
                        onPress={() => onSend(patientDataForm)}
                        className="flex-1 h-[56px] rounded-[16px] items-center justify-center bg-blue-500"
                    >
                        <View className="flex-row items-center gap-2">
                            <Text className="text-white font-semibold">บันทึกข้อมูล</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default SumDiagnosisComp;