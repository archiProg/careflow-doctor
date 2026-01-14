import { ApiResponse } from "@/types/apiModel";
import { JWT } from "@/utilitys/jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Provider from "./providerService";

export class RequestApi {
  baseUrl: string = Provider.HostApi;


  async jwt() {
    const email = await AsyncStorage.getItem("email");
    const password = await AsyncStorage.getItem("password");
    let body =
    {
      email: email,
      password: password,
    };

    let res = await this.postApi("/login", JSON.stringify(body));
    if (res.success) {
      let jwt = JSON.parse(res.response);

      if (jwt.token) {
        JWT.setToken(jwt.token);
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }

  }

  public async postApiJwt(
    endpoint: string,
    jsonData: string = "",
    headers?: Record<string, string>,
    files?: Record<string, string>
  ): Promise<ApiResponse> {
    const apiResponse: ApiResponse = { success: false, response: "" };
    if (JWT.expire == 0 || JWT.expire <= Date.now() / 1000) {

      const status = await this.jwt();
      if (!status) {
        apiResponse.response = "JWT Error";
        return apiResponse;
      }
    }

    const bearerToken = JWT.token;

    try {
      let body: FormData | string = "";

      if (files && Object.keys(files).length > 0) {
        const formData = new FormData();

        for (const key in files) {
          formData.append(key, {
            uri: Platform.OS === "ios" ? files[key] : "file://" + files[key],
            type: "application/octet-stream",
            name: key,
          } as any);
        }

        if (headers) {
          for (const key in headers) {
            formData.append(key, headers[key]);
          }
        }

        body = formData;
      } else if (jsonData != "") {
        body = jsonData;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": files ? "multipart/form-data" : "application/json",
          ...headers,
          Authorization: `Bearer ${bearerToken}`,
        },
        body,
      });

      const contentType = response.headers.get("content-type") || "";

      let responseData: string = "";

      responseData = await response.text();

      if (response.status === 500) {
        apiResponse.success = false;
        apiResponse.response = "Server error (500): " + responseData;
      } else if (response.ok || response.status === 401) {
        apiResponse.success = true;
        apiResponse.response = responseData;
      } else {
        apiResponse.success = false;
        apiResponse.response = `Error ${response.status}: ${responseData}`;
      }

      return apiResponse;
    } catch (error: any) {
      apiResponse.success = false;
      apiResponse.response = `Exception: ${error.message}`;
      return apiResponse;
    }
  }

  public async postApi(
    endpoint: string,
    jsonData: string = "",
    headers?: Record<string, string>,
    files?: Record<string, string>
  ): Promise<ApiResponse> {
    const apiResponse: ApiResponse = { success: false, response: "" };

    try {
      let body: FormData | string = "";

      if (files && Object.keys(files).length > 0) {
        const formData = new FormData();

        for (const key in files) {
          formData.append(key, {
            uri: Platform.OS === "ios" ? files[key] : "file://" + files[key],
            type: "application/octet-stream",
            name: key,
          } as any);
        }

        if (headers) {
          for (const key in headers) {
            formData.append(key, headers[key]);
          }
        }

        body = formData;
      } else if (jsonData != "") {
        body = jsonData;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": files ? "multipart/form-data" : "application/json",
          ...headers,
        },
        body,
      });

      let responseData: string = "";

      responseData = await response.text();

      if (response.status === 500) {
        apiResponse.success = false;
        apiResponse.response = "Server error (500): " + responseData;
      } else if (response.ok || response.status === 401) {
        apiResponse.success = true;
        apiResponse.response = responseData;
      } else {
        apiResponse.success = false;
        apiResponse.response = `Error ${response.status}: ${responseData}`;
      }

      return apiResponse;
    } catch (error: any) {
      apiResponse.success = false;
      apiResponse.response = `Exception: ${error.message}`;
      return apiResponse;
    }
  }

  public async getApi(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> {
    const apiResponse: ApiResponse = { success: false, response: "" };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers,
      });

      let responseData: string = "";

      responseData = await response.text();

      if (response.ok) {
        apiResponse.success = true;
        apiResponse.response = responseData;
      } else {
        apiResponse.success = false;
        apiResponse.response = `Error ${response.status}: ${responseData}`;
      }

      return apiResponse;
    } catch (error: any) {
      apiResponse.success = false;
      apiResponse.response = `Exception: ${error.message}`;
      return apiResponse;
    }
  }

  public async getApiJwt(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> {
    const apiResponse: ApiResponse = { success: false, response: "" };

    if (JWT.expire == 0 || JWT.expire <= Date.now() / 1000) {
      const status = await this.jwt();
      if (!status) {
        apiResponse.response = "JWT Error";
        return apiResponse;
      }
    }

    const bearerToken = JWT.token;

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      let responseData: string = "";

      responseData = await response.text();

      if (response.ok) {
        apiResponse.success = true;
        apiResponse.response = responseData;
      } else {
        apiResponse.success = false;
        apiResponse.response = `Error ${response.status}: ${responseData}`;
      }

      return apiResponse;
    } catch (error: any) {
      apiResponse.success = false;
      apiResponse.response = `Exception: ${error.message}`;
      return apiResponse;
    }
  }
}
