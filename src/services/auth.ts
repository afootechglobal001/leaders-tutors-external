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
  paymentMethodId?: string;
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
  paymentProceedData?: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    subscriptionId: string;
    transactionId: string;
    paymentMethodId: string;
    currency: string;
    amount: string;
    email: string;
    paystackPaymentKey: string;
  };
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

  const finalData = Array.isArray(data)
    ? data
    : (data as { data?: Department[] })?.data || [];

  return finalData.map((item: Department) => ({
    value: String(item.departmentId),
    label: item.departmentName,
  }));
};

export const fetchSubjects = async (
  departmentId?: string,
): Promise<DropdownOption[]> => {
  const data = await apiClient.get<unknown[]>(
    departmentId
      ? `/preset-data/fetch-subjects?departmentId=${departmentId}`
      : "/preset-data/fetch-subjects",
  );

  const finalData = Array.isArray(data)
    ? data
    : (data as { data?: unknown[] })?.data || [];

  return finalData.map((item: unknown) => ({
    value: String(
      (item as { subjectId?: unknown; id?: unknown }).subjectId ||
        (item as { id?: unknown }).id,
    ),
    label:
      (item as { subjectName?: string; name?: string }).subjectName ||
      (item as { name?: string }).name ||
      "",
  }));
};

export const fetchExams = async (): Promise<DropdownOption[]> => {
  const data = await apiClient.get<Exam[]>("/preset-data/fetch-external-exams");

  const finalData = Array.isArray(data)
    ? data
    : (data as { data?: Exam[] })?.data || [];

  return finalData.map((item: Exam) => ({
    value: item.examId,
    label: item.examAbbreviation,
  }));
};

interface PaymentMethod {
  paymentMethodId: string;
  paymentMethodName: string;
}

export const fetchPaymentMethods = async (): Promise<DropdownOption[]> => {
  const data = await apiClient.get<PaymentMethod[]>(
    "/preset-data/fetch-payment-methods?paymentMethodIds=CC,BT",
  );

  const finalData = Array.isArray(data)
    ? data
    : (data as { data?: PaymentMethod[] })?.data || [];

  return finalData.map((item: PaymentMethod) => ({
    value: item.paymentMethodId,
    label: item.paymentMethodName,
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
  paymentMethodId?: string;
}): SignupPayload => {
  return {
    fullName: formData.fullName.trim(),
    emailAddress: formData.emailAddress,
    phoneNumber: formData.phoneNumber,
    departmentId: formData.department.trim(),
    examId: formData.exam.trim(),
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    paymentMethodId: formData.paymentMethodId || "CC",
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
  // Try to extract userId from various possible locations
  let extractedUserId = null;

  if (response) {
    const responseData = response as Record<string, unknown>;
    const dataObj = responseData?.data as Record<string, unknown> | undefined;
    const userObj = responseData?.user as Record<string, unknown> | undefined;

    extractedUserId =
      getStringValue(response, ["userId", "id"]) ||
      (dataObj
        ? getStringValue(dataObj as AuthApiResponse, ["userId", "id"])
        : null) ||
      (userObj
        ? getStringValue(userObj as AuthApiResponse, ["userId", "id"])
        : null);
  }

  // Extract payment proceed data if available
  const paymentProceedData = (response as Record<string, unknown>)
    ?.paymentProceedData as PendingSignupVerification["paymentProceedData"];

  console.log("Full signup response:", JSON.stringify(response, null, 2));
  console.log("Payment proceed data:", paymentProceedData);

  return {
    userId: extractedUserId ? String(extractedUserId) : `temp_${Date.now()}`,
    emailAddress: getStringValue(
      response,
      ["emailAddress", "email"],
      signupPayload.emailAddress,
    ),
    signupPayload,
    paymentProceedData: paymentProceedData || undefined,
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

/**
 * Verify signup payment with Paystack reference
 */
export const verifySignupPayment = async (
  reference: string,
  userId: string,
): Promise<boolean> => {
  try {
    await apiClient.post("/user/auth/verify-signup-payment", {
      reference,
      userId,
    });
    return true;
  } catch (error) {
    console.error("Payment verification failed:", error);
    return false;
  }
};

/**
 * Complete signup after successful payment
 */
export const completeSignupSuccess = async (
  transactionId: string,
  paymentKey: string,
): Promise<boolean> => {
  try {
    await apiClient.get(
      `/user/auth/signup-success?transactionId=${transactionId}&paymentKey=${paymentKey}`,
    );
    return true;
  } catch (error) {
    console.error("Signup success call failed:", error);
    return false;
  }
};

/**
 * Get signup payment amount (if dynamic pricing is needed)
 */
export const getSignupPaymentAmount = async (
  examId: string,
): Promise<number> => {
  try {
    const data = await apiClient.get<{ amount: number }>(
      `/preset-data/signup-fee?examId=${examId}`,
    );
    return data.amount || 5000; // Default to 5000 NGN
  } catch (error) {
    console.error("Failed to fetch signup amount:", error);
    return 5000; // Default fallback
  }
};
