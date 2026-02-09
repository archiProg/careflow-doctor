import i18n from "@/services/i18nService";
import * as ImagePicker from "expo-image-picker";
import { PermissionsAndroid, Platform } from "react-native";

export class PermissionService {
  static async requestGalleryPermission(): Promise<boolean> {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: i18n.t("permission.gallery.title"),
            message: i18n.t("permission.gallery.message"),
            buttonNeutral: i18n.t("permission.askMeLater"),
            buttonNegative: i18n.t("cancel"),
            buttonPositive: i18n.t("ok"),
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS handled by Expo Image Picker
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  }

  /**
   * Request camera permission
   */
  static async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: i18n.t("permission.camera.title"),
            message: i18n.t("permission.camera.message"),
            buttonNeutral: i18n.t("permission.askMeLater"),
            buttonNegative: i18n.t("cancel"),
            buttonPositive: i18n.t("ok"),
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    }
  }

  static async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: i18n.t("permission.microphone.title"),
            message: i18n.t("permission.microphone.message"),
            buttonNeutral: i18n.t("permission.askMeLater"),
            buttonNegative: i18n.t("cancel"),
            buttonPositive: i18n.t("ok"),
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS (Expo)
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    }
  }
}
