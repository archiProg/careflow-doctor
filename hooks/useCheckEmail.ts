import i18n from "@/services/i18nService";
import { RequestApi } from "@/services/requestApiService";
import { CheckEmailResponse } from "@/types/checkEmailModel";

const UseCheckEmail = async (email: string): Promise<CheckEmailResponse> => {
  const body = { email };
  const api = new RequestApi();
  try {
    const response = await api.postApi("/check-email", JSON.stringify(body));

    if (!response.success) {
      return { message: response.response, status: -1 };
    }
    let getResponse: CheckEmailResponse;

    getResponse = JSON.parse(response.response);

    if (getResponse != null) {
      return getResponse;
    } else {
      return { message: i18n.t("error.serverError"), status: -1 };
    }
  } catch (error) {
    console.error("checkEmail error:", error);
    return { message: i18n.t("error.serverError"), status: -1 };
  }
};

const UseCheckFormmartEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export { UseCheckEmail, UseCheckFormmartEmail };

