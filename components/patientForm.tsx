import { PatientDataForm } from '@/types/patientData';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// type ของ props
interface PatientFormProps {
    onSubmit: (data: PatientDataForm) => void;
    onReview: () => void;
    onCancel: () => void;
}



const { height: screenHeight } = Dimensions.get("window");
const videoHeight = Math.max((screenHeight / 3), 280); // h-1/3

const overlayTop = videoHeight - 8; // เลื่อน overlay ขึ้น 16px


const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onReview, onCancel }) => {
    const [symptoms, setSymptoms] = useState<string>('');
    const [doctorNote, setDoctorNote] = useState<string>('');
    const [medication, setMedication] = useState<string>('');
    const [needHospital, setNeedHospital] = useState<boolean>(false);
    const [saveData, setSaveData] = useState<boolean>(false);
    const insets = useSafeAreaInsets();

    const handleSubmit = () => {
        if (!symptoms.trim()) {
            Alert.alert('แจ้งเตือน', 'กรุณากรอกอาการผู้ป่วย');
            return;
        }

        const data: PatientDataForm = {
            symptoms,
            doctorNote,
            medication,
            needHospital,
            timestamp: new Date().toISOString(),
        };

        if (onSubmit) {
            onSubmit(data);
        }

        Alert.alert('บันทึกสำเร็จ', 'บันทึกข้อมูลผู้ป่วยเรียบร้อยแล้ว');
        resetForm();
    };

    const resetForm = () => {
        setSymptoms('');
        setDoctorNote('');
        setMedication('');
        setNeedHospital(false);
    };

    const handleReset = () => {
        Alert.alert('ยืนยันการล้างข้อมูล', 'คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?', [
            { text: 'ยกเลิก', style: 'cancel' },
            { text: 'ล้างข้อมูล', style: 'destructive', onPress: resetForm },
        ]);
    };

    return (
        <View className="flex-1 bg-gray-50">
            {saveData ? <View className="flex-1">
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="p-5 pb-24"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1">
                        <Text>ข้อมูลผู้ป่วย</Text>
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
                        onPress={handleSubmit}
                        className="flex-1 h-[56px] rounded-[16px] items-center justify-center bg-blue-500"
                    >
                        <View className="flex-row items-center gap-2">
                            <Text className="text-white font-semibold">บันทึกข้อมูล</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
                :
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
                                    อาการผู้ป่วย
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

                        {/* ความคิดเห็นของแพทย์ */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Text className="text-gray-900 text-base font-semibold ml-2">
                                    ความคิดเห็นของแพทย์
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

                        {/* ยาที่สั่งจ่าย */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Text className="text-gray-900 text-base font-semibold ml-2">
                                    ยาที่สั่งจ่าย
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
                                    ควรส่งตัวไปโรงพยาบาล
                                </Text>
                            </View>

                        </TouchableOpacity>

                        {/* ปุ่มดำเนินการ */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 flex-row items-center justify-center bg-blue-600 rounded-xl py-4"
                                onPress={() => setSaveData(true)}
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-base font-semibold ml-2">
                                    ดำเนินการ
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>}
        </View>

    );
};

export default PatientForm;
