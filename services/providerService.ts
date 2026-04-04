import { User } from "@/types/profileModel";

class Provider {
  static HostApi: string = "https://archismartsolution.com:5002";
  static HostWebsocket: string = "wss://archismartsolution.com:5003/echo";
  static HostSocketIo: string = "https://archismartsolution.com:5004";
  static Language: string = "en";
  static Token: string = "";
  static auth_google_webClientId: string = '33220421052-2qu91jeoua0j1b1ohd17b49s0c0nisit.apps.googleusercontent.com';
  static Profile: User | null = null;

  static setProfile(profile: User | null) {
    this.Profile = profile;
  }
}

export default Provider;
