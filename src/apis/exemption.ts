import { getToken } from "@/utils/storage";
import axiosClient from "./axiosClient";

export const applyStudentDiscount = async (exemptionForm: any) => {
  const { validTo } = exemptionForm;
  return await axiosClient.post('discount/student', {
    discount: 50,
    expiry_date: validTo ? `${validTo.year}-${validTo.month}` : null,
    cccd: exemptionForm.cccd
  })
}

export const applyFreeDiscount = async (exemptionForm: any) => {
  const {validTo, priorityGroup} = exemptionForm
  const token = getToken()
  return await axiosClient.post('discount/free', {
    user_type: priorityGroup,
    expiry_date: validTo ? `${validTo.year}-${validTo.month}` : null,
    cccd: exemptionForm.cccd
  })
}