import { BloodPressureCategoryEnum } from "@/server/db/schema"

export const determineCategory = (bpr: {
  systolic: number
  diastolic: number
}) => {
  if (bpr.systolic > 180 || bpr.diastolic > 120) {
    return BloodPressureCategoryEnum.Hypertension_crisis // "Hypertension_crisis"
  } else if (bpr.systolic >= 140 || bpr.diastolic >= 90) {
    return BloodPressureCategoryEnum.Hypertension_2 // "Hypertension_2"
  } else if (bpr.systolic >= 130) {
    return BloodPressureCategoryEnum.Hypertension_1 // "Hypertension_1"
  } else if (bpr.diastolic >= 80) {
    return BloodPressureCategoryEnum.Hypertension_1 // "Hypertension_1"
  } else if (bpr.systolic >= 120) {
    return BloodPressureCategoryEnum.Elevated // "Elevated"
  } else if (bpr.systolic >= 90) {
    return BloodPressureCategoryEnum.Normal // "Normal"
  } else {
    return BloodPressureCategoryEnum.Low // "Low"
  }
}
