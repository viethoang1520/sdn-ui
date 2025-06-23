import { getToken } from "@/utils/storage";
import axiosClient from "./axiosClient";

export const applyStudentDiscount = async (exemptionForm: any) => {
  const { validTo } = exemptionForm;
  return await axiosClient.post('discount/student', {
    user_id: '684657ed0b397c8f35851eb0',
    discount: 50,
    expiry_date: validTo ? `${validTo.year}-${validTo.month}` : null
  })
}

export const applyFreeDiscount = async (exemptionForm: any) => {
  const {validTo, priorityGroup} = exemptionForm
  const token = getToken()
  return await axiosClient.post('discount/free', {
    user_id: '6846b280e5ba92c24b66201b',
    user_type: priorityGroup,
    expiry_date: validTo ? `${validTo.year}-${validTo.month}` : null
  })
}