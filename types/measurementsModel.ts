interface MeasurementsTypesResponse {
    id: number
    code: string
    name: string
}

interface ReadBMI {
    id: number
    device_id: string
    patient_id: number
    type_id: number
    created_at: string
    values: BMIValues
}

export interface BMIValues {
    height: string
    weight: string
    bmi: string
    bmi_normal: string
}


export { MeasurementsTypesResponse, ReadBMI }




