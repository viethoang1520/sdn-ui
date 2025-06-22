import { getToken } from "@/utils/storage";
import axiosClient from "./axiosClient";

export const applyStudentDiscount = async (exemptionForm: any): Promise<{error_code: number, message: string}> => {
  const { validTo } = exemptionForm;
  const token = getToken()
  return await axiosClient(token).post('discount/student', {
    user_id: '684657ed0b397c8f35851eb0',
    discount: 50,
    expiry_date: validTo ? `${validTo.year}-${validTo.month}` : null
  })
}

export const applyFreeDiscount = async (exemptionForm: any): Promise<{error_code: number, message: string}> => {
  const {validTo, priorityGroup} = exemptionForm
  const token = getToken()
  return await axiosClient(token).post('discount/free', {
    user_id: '6846b280e5ba92c24b66201b',
    user_type: priorityGroup,
    expiry_date: validTo ? `${validTo.year}-${validTo.month}` : null
  })
}