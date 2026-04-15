import { apiClient } from "@/lib/api-client";
import { AuthResponse } from "@/types/auth/auth";

export const PENDING_SIGNUP_EMAIL_STORAGE_KEY = "leaders-tutors-signup-email";
export const PENDING_SIGNUP_VERIFICATION_STORAGE_KEY =
  "leaders-tutors-pending-signup";

interface LoginPayload {
  emailAddress: string;
  password: string;
}

interface SignupPayload {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  departmentId: string;
  examId: string;
  password: string;
  confirmPassword: string;
}

interface VerifySignupOtpPayload {
  userId: string;
  otp: number;
  password: string;
  confirmPassword: string;
}

export interface PendingSignupVerification {
  userId: string;
  emailAddress: string;
  signupPayload: SignupPayload;
}

type AuthApiResponse = Record<string, unknown>;

interface Department {
  departmentId: number;
  departmentName: string;
}

interface Exam {
  examId: string;
  examAbbreviation: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

export const fetchDepartments = async (): Promise<DropdownOption[]> => {
  const data = await apiClient.get<Department[]>(
    "/preset-data/fetch-departments",
  );

  const finalData = Array.isArray(data) ? data : (data as any)?.data || [];

  return finalData.map((item: Department) => ({
    value: String(item.departmentId),
    label: item.departmentName,
  }));
};

export const fetchSubjects = async (
  departmentId?: string,
): Promise<DropdownOption[]> => {
  const data = await apiClient.get<any[]>(
    departmentId
      ? `/preset-data/fetch-subjects?departmentId=${departmentId}`
      : "/preset-data/fetch-subjects",
  );

  const finalData = Array.isArray(data) ? data : (data as any)?.data || [];

  return finalData.map((item: any) => ({
    value: String(item.subjectId || item.id),
    label: item.subjectName || item.name,
  }));
};

export const fetchExams = async (): Promise<DropdownOption[]> => {
  const data = await apiClient.get<Exam[]>(
    "/preset-data/fetch-external-exams",
  );

  const finalData = Array.isArray(data) ? data : (data as any)?.data || [];

  return finalData.map((item: Exam) => ({
    value: item.examId,
    label: item.examAbbreviation,
  }));
};

const getStringValue = (
  source: AuthApiResponse,
  keys: string[],
  fallback = "",
) => {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return fallback;
};

const getNameParts = (fullName: string) => {
  const [firstName = "User", ...rest] = fullName.trim().split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" ") || "Account",
  };
};

export const mapSignupPayload = (formData: {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  department: string;
  exam: string;
  password: string;
  confirmPassword: string;
}): SignupPayload => {
  return {
    fullName: formData.fullName.trim(),
    emailAddress: formData.emailAddress,
    phoneNumber: formData.phoneNumber,
    departmentId: formData.department.trim(),
    examId: formData.exam.trim(),
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };
};

export const signupUser = async (payload: SignupPayload) =>
  apiClient.post<AuthApiResponse, SignupPayload>("/user/auth/signup", payload);

export const loginUser = async (payload: LoginPayload) =>
  apiClient.post<AuthApiResponse, LoginPayload>("/user/auth/login", payload);

export const verifySignupOtp = async (payload: VerifySignupOtpPayload) =>
  apiClient.post<AuthApiResponse, VerifySignupOtpPayload>(
    "/user/auth/create-new-password",
    payload,
  );

export const getSignupVerificationData = (
  response: AuthApiResponse,
  signupPayload: SignupPayload,
): PendingSignupVerification => {
  const userId = getStringValue(response, ["userId", "id"]);

  if (!userId) {
    throw new Error(
      "Signup succeeded but no user ID was returned for account verification.",
    );
  }

  return {
    userId,
    emailAddress: getStringValue(
      response,
      ["emailAddress", "email"],
      signupPayload.emailAddress,
    ),
    signupPayload,
  };
};

export const savePendingSignupVerification = (
  pendingSignup: PendingSignupVerification,
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    PENDING_SIGNUP_VERIFICATION_STORAGE_KEY,
    JSON.stringify(pendingSignup),
  );
  window.sessionStorage.setItem(
    PENDING_SIGNUP_EMAIL_STORAGE_KEY,
    pendingSignup.emailAddress,
  );
};

export const readPendingSignupVerification =
  (): PendingSignupVerification | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedValue = window.sessionStorage.getItem(
      PENDING_SIGNUP_VERIFICATION_STORAGE_KEY,
    );

    if (!storedValue) {
      return null;
    }

    try {
      return JSON.parse(storedValue) as PendingSignupVerification;
    } catch {
      return null;
    }
  };

export const clearPendingSignupVerification = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PENDING_SIGNUP_VERIFICATION_STORAGE_KEY);
  window.sessionStorage.removeItem(PENDING_SIGNUP_EMAIL_STORAGE_KEY);
};

export const normalizeAuthResponse = (
  response: AuthApiResponse,
  fallbackEmail: string,
): { token: string; user: AuthResponse } => {
  const token = getStringValue(response, ["accessToken", "token", "accessKey"]);

  if (!token) {
    throw new Error("Login succeeded but no access token was returned.");
  }

  const fullName = getStringValue(response, ["fullName"]);
  const { firstName, lastName } = getNameParts(fullName);

  return {
    token,
    user: {
      token,
      id: getStringValue(response, ["id", "userId"], "unknown-user"),
      email: getStringValue(response, ["email", "emailAddress"], fallbackEmail),
      first_name: getStringValue(
        response,
        ["first_name", "firstName"],
        firstName,
      ),
      last_name: getStringValue(response, ["last_name", "lastName"], lastName),
      phone_number:
        getStringValue(response, ["phone_number", "phoneNumber"]) || null,
      last_active: getStringValue(
        response,
        ["last_active", "lastActive", "lastLoginTime"],
        new Date().toISOString(),
      ),
      role: getStringValue(response, ["role"], "User"),
      status: getStringValue(response, ["status"], "Active"),
      middle_name:
        getStringValue(response, ["middle_name", "middleName"]) || null,
    },
  };
};
