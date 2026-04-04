interface LoginResponse {
  token: string;
  user: UserInfo;
  message: string;
}

interface Payload_Google {
    sub: string | undefined;
    name: string | null | undefined;
    given_name: string | null | undefined;
    family_name: string | null | undefined;
    picture: string | null | undefined;
    email: string | undefined;
    email_verified: boolean;
}

interface UserInfo {
  id: string;
  role: string;
  email: string;
  name: string;
  
}

export { LoginResponse, UserInfo , Payload_Google };

