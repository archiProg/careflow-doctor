import { PatientInfo } from "@/types/patientData";
import { useEffect, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

interface LineData {
    value: number;
    dataPointText: string;
    label: string;
}

interface Props {
    data?: any;
    loading?: boolean;
    patientInfo?: PatientInfo | null;
};

const CardLineChart = ({
    data,
    loading = false,
    patientInfo,
}: Props) => {
    const colorScheme = useColorScheme();
    const [lineData, setLineData] = useState<LineData[]>([
        { value: 10, dataPointText: '0', label: '1/3/22' },
        { value: 20, dataPointText: '20', label: '1/4/22' },
        { value: 18, dataPointText: '18', label: '1/5/22' },
        { value: 40, dataPointText: '40', label: '1/6/22' },
        { value: 36, dataPointText: '36', label: '1/7/22' }
    ]);

    useEffect(() => {
        const newData: LineData[] = data ? data.map((item: any) => ({
            value: item.value,
            dataPointText: item.value.toString(),
            label: item.label
        })) : [];
        setLineData(newData);
    }, []);

    return (
        <>
            <View style={{ flexDirection: "column", }}>

                {/* Y Axis Title */}
                <Text
                    style={{
                        marginRight: 10,
                        fontSize: 24,
                        color: colorScheme === 'dark' ? '#90ffff' : '#000',
                    }}
                >
                    BMI
                </Text>

                <LineChart
                    data={lineData}
                    stepValue={10}
                    rotateLabel={true}
                    textFontSize={13}
                    dataPointsColor1={colorScheme === 'dark' ? '#90ffff' : '#0000FF'}
                    yAxisTextStyle={colorScheme === 'dark' ? { color: '#90ffff' } : { color: '#000' }}
                    thickness={5}
                    dataPointsColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    maxValue={lineData.reduce((max, item) => item.value > max ? item.value : max, 0) + 5}
                    xAxisLabelTextStyle={colorScheme === 'dark' ? { color: '#90ffff' } : { color: '#000' }}
                    showVerticalLines
                    color={colorScheme === 'dark' ? '#0000FF' : '#90ffff'}
                    textColor={colorScheme === 'dark' ? '#90ffff' : '#000'}
                />
            </View>
        </>
    );

}


export default CardLineChart;

