import { DoctorProfile } from "@/types/profileModel";


const isProfileIncomplete = (profile : DoctorProfile) => {
  if (!profile) return true;

  return Object.values(profile).some(
    (value) => value == null || value == "" || value == undefined
  );
};

const checkStrongPassword = (password : string) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/


  return strongPasswordRegex.test(password);
};

const isValidThaiIdCard = (id = "") => {
    if (!/^[0-9]{13}$/.test(id)) return false;

    let sum = 0;

    for (let i = 0; i < 12; i++) {
        sum += parseInt(id[i]) * (13 - i);
    }

    const checkDigit = (11 - (sum % 11)) % 10;

    return checkDigit == parseInt(id[12]);
};

const formatThaiIdPDPC = (id = "") => {
    if (!/^\d{13}$/.test(id)) return "";

return id.replace(
  /(\d)(\d{4})(\d{5})(\d{2})(\d)/,
  "$1-$2-$3-$4-$5"
);
};


export { isProfileIncomplete, checkStrongPassword , isValidThaiIdCard , formatThaiIdPDPC };
