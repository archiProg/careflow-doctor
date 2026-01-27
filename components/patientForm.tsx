import { PatientDataForm } from '@/types/patientData';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// type ของ props
interface PatientFormProps {
    onSetPatientDataForm: (data: PatientDataForm) => void;
    onReview: () => void;
    onCancel: () => void;
}



const { height: screenHeight } = Dimensions.get("window");
const videoHeight = Math.max((screenHeight / 3), 280); // h-1/3

const overlayTop = videoHeight - 8; // เลื่อน overlay ขึ้น 16px


const PatientForm: React.FC<PatientFormProps> = ({ onSetPatientDataForm, onReview, onCancel }) => {
    const [symptoms, setSymptoms] = useState<string>('');
    const [doctorNote, setDoctorNote] = useState<string>('');
    const [diagnosis, setDiagnosis] = useState<string>('');
    const [medication, setMedication] = useState<string>('');
    const [needHospital, setNeedHospital] = useState<boolean>(false);
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const handleSave = () => {
        if (!symptoms.trim()) {
            Alert.alert(t('notification'), t('patient-form-notification'));
            return;
        }

        const data: PatientDataForm = {
            symptoms: symptoms || "ไม่ระบุ",
            doctorNote: doctorNote || "ไม่ระบุ",
            medication: medication || "ไม่ระบุ",
            diagnosis: diagnosis || "ไม่ระบุ",
            needHospital: needHospital,
        };

        if (onSetPatientDataForm) {
            onSetPatientDataForm(data);
        }

    };




    return (
        <View className="flex-1 bg-gray-50">

            <KeyboardAvoidingView
                className="flex-1 bg-gray-50"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <ScrollView
                    className="flex-1"
                    contentContainerClassName="p-5 pb-10"
                    showsVerticalScrollIndicator={false}
                >
                    {/* อาการผู้ป่วย */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-gray-900 text-base font-semibold ml-2">
                                {t("symptoms")}
                            </Text>
                        </View>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900 min-h-[100px]"
                            placeholder=""
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={symptoms}
                            onChangeText={setSymptoms}
                        />
                    </View>

                    {/* ยาที่สั่งจ่าย */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-gray-900 text-base font-semibold ml-2">
                                {"ผลวินิจฉัย"}
                            </Text>
                        </View>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900 min-h-[100px]"
                            placeholder=""
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={diagnosis}
                            onChangeText={setDiagnosis}
                        />
                    </View>
                    {/* ยาที่สั่งจ่าย */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-gray-900 text-base font-semibold ml-2">
                                {t("medication")}
                            </Text>
                        </View>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900 min-h-[100px]"
                            placeholder=""
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={medication}
                            onChangeText={setMedication}
                        />
                    </View>

                    {/* ควรไปโรงพยาบาล */}
                    <TouchableOpacity
                        className="flex-row items-center bg-white rounded-xl p-4 mb-6 border border-gray-300"
                        onPress={() => setNeedHospital(!needHospital)}
                        activeOpacity={0.7}
                    >
                        <View
                            className={`w-6 h-6 border-2 rounded-md justify-center items-center mr-3 ${needHospital ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                }`}
                        >
                            {needHospital && (
                                <FontAwesome5 name="check" size={16} color="#FFFFFF" />
                            )}
                        </View>
                        <View className="flex-1 mr-3">
                            <Text className="text-blue-900 text-base font-semibold mb-1">
                                {t("needHospital")}
                            </Text>
                        </View>

                    </TouchableOpacity>

                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-gray-900 text-base font-semibold ml-2">
                                {t('doctorNote')}
                            </Text>
                        </View>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-xl p-4 text-base text-gray-900 min-h-[100px]"
                            placeholder=""
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={doctorNote}
                            onChangeText={setDoctorNote}
                        />
                    </View>

                    {/* ปุ่มดำเนินการ */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className="flex-1 flex-row items-center justify-center bg-blue-600 rounded-xl py-4"
                            onPress={() => handleSave()}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-base font-semibold ml-2">
                                {t("review")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>

    );
};

export default PatientForm;
