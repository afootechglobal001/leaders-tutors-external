import { apiClient } from "@/lib/api-client";
import {
  DashboardSummary,
  TutorialSubject,
  PaymentStatus,
  TutorialVideo,
  UserEnrollment,
  UserSubscription,
  ClassVideo,
} from "@/types/portal";
import { useAuthStore } from "@/store/authStore";

type RecordLike = Record<string, unknown>;

interface ApiErrorLike {
  status?: number;
  response?: { status?: number };
}

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) return undefined;
  const apiError = error as ApiErrorLike;
  return apiError.status ?? apiError.response?.status;
};

const inactiveSubscription = (): UserSubscription => ({
  isSubscriptionActive: false,
  subscriptionExpiresAt: new Date().toISOString(),
  subscriptionType: "basic",
  walletBalance: 0,
  currency: "₦",
  departmentId: "",
  departmentName: "",
  examId: "",
  examAbbreviation: "",
});

const asRecord = (value: unknown): RecordLike => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as RecordLike;
  }
  return {};
};

const unwrapPayload = (value: unknown): unknown => {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    const record = asRecord(current);
    if (record.data !== undefined) {
      current = record.data;
      continue;
    }
    break;
  }
  return current;
};

const asArray = (value: unknown): RecordLike[] => {
  const payload = unwrapPayload(value);
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is RecordLike =>
        !!item && typeof item === "object" && !Array.isArray(item),
    );
  }

  const record = asRecord(payload);
  const nestedKeys = ["items", "subjects", "tutorials", "years", "records"];
  for (const key of nestedKeys) {
    if (Array.isArray(record[key])) {
      return (record[key] as unknown[]).filter(
        (item): item is RecordLike =>
          !!item && typeof item === "object" && !Array.isArray(item),
      );
    }
  }

  return [];
};

const asString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const firstString = (source: RecordLike, keys: string[], fallback = "") => {
  for (const key of keys) {
    const value = asString(source[key]);
    if (value) return value;
  }
  return fallback;
};

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const firstNumber = (source: RecordLike, keys: string[], fallback = 0) => {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return asNumber(source[key], fallback);
    }
  }
  return fallback;
};

const isActiveStatus = (source: RecordLike): boolean => {
  if (typeof source.isSubscriptionActive === "boolean") {
    return source.isSubscriptionActive;
  }
  if (typeof source.isActive === "boolean") {
    return source.isActive;
  }

  const status = firstString(source, [
    "status",
    "subscriptionStatus",
  ]).toLowerCase();
  if (
    ["expired", "inactive", "cancelled", "canceled", "failed"].includes(status)
  ) {
    return false;
  }
  if (["active", "success", "valid"].includes(status)) {
    return true;
  }

  const statusId = firstString(source, ["statusId"]);
  if (statusId === "1" || statusId === "4") return true;
  if (statusId === "2" || statusId === "5") return false;

  return Boolean(
    firstString(source, ["departmentId", "examId", "subscriptionId", "userId"]),
  );
};

const mapSubscription = (raw: unknown): UserSubscription => {
  const payload = unwrapPayload(raw);
  const source = Array.isArray(payload)
    ? asRecord(payload[0])
    : asRecord(payload);
  const expiresAt = firstString(source, [
    "subscriptionExpiresAt",
    "expiresAt",
    "expiryDate",
    "dueDate",
    "nextBillingDate",
  ]);

  const activeFlag = isActiveStatus(source);
  const expiryTime = expiresAt ? new Date(expiresAt).getTime() : NaN;
  const stillValid = Number.isNaN(expiryTime) || expiryTime > Date.now();

  return {
    isSubscriptionActive: activeFlag && stillValid,
    subscriptionExpiresAt: expiresAt || new Date().toISOString(),
    subscriptionType: firstString(
      source,
      ["subscriptionType", "planName"],
      "basic",
    ),
    walletBalance: firstNumber(
      source,
      ["walletBalance", "balance", "amount"],
      0,
    ),
    currency: firstString(source, ["currency"], "₦"),
    departmentId: firstString(source, ["departmentId"]),
    departmentName: firstString(source, ["departmentName", "department"]),
    examId: firstString(source, ["examId"]),
    examAbbreviation: firstString(source, [
      "examAbbreviation",
      "examAbbr",
      "examTitle",
      "exam",
    ]),
    lastPaymentDate:
      firstString(source, ["lastPaymentDate", "createdAt"]) || undefined,
    nextBillingDate: firstString(source, ["nextBillingDate"]) || undefined,
  };
};

const enrollmentFromSubscription = (
  subscription: UserSubscription,
): UserEnrollment | null => {
  if (!subscription.departmentId && !subscription.examId) {
    return null;
  }

  return {
    departmentId: subscription.departmentId,
    departmentName: subscription.departmentName,
    examId: subscription.examId,
    examAbbreviation: subscription.examAbbreviation,
    status: subscription.isSubscriptionActive ? "active" : "expired",
  };
};

const mapSubject = (
  item: RecordLike,
  enrollment?: UserEnrollment | UserSubscription | null,
): TutorialSubject => {
  const id = firstString(item, ["subjectId", "id"]);
  return {
    id,
    name: firstString(item, ["subjectName", "name"], "Subject"),
    departmentId: firstString(
      item,
      ["departmentId"],
      enrollment?.departmentId || "",
    ),
    department: firstString(
      item,
      ["departmentName", "department"],
      enrollment?.departmentName || "",
    ),
    examId: firstString(item, ["examId"], enrollment?.examId || ""),
    exam: firstString(
      item,
      ["examAbbreviation", "examAbbr", "examTitle", "exam"],
      enrollment?.examAbbreviation || "",
    ),
    examAbbr: firstString(
      item,
      ["examAbbreviation", "examAbbr"],
      enrollment?.examAbbreviation || "",
    ),
  };
};

const mapClassVideo = (item: RecordLike, yearLabel?: string): ClassVideo => {
  const year =
    yearLabel ||
    firstString(item, ["yearValue", "year", "yearName"], "Unknown year");

  return {
    id: firstString(item, ["tutorialId", "id"]),
    title: firstString(item, ["tutorialTitle", "title"], "Tutorial"),
    year,
    yearId: firstString(item, ["yearId"]) || undefined,
    duration: firstString(item, ["tutorialDuration", "duration"]) || undefined,
    subjectId: firstString(item, ["subjectId"]),
    description:
      firstString(item, ["tutorialDescription", "description"]) || undefined,
    thumbnailUrl:
      firstString(item, ["tutorialPicture", "thumbnailUrl", "thumbnail"]) ||
      undefined,
  };
};

const mapTutorialVideo = (item: RecordLike): TutorialVideo => {
  const classVideo = mapClassVideo(item);
  return {
    id: classVideo.id,
    title: classVideo.title,
    subject: firstString(item, ["subjectName", "subject"]),
    department: firstString(item, ["departmentName", "department"]),
    exam: firstString(item, ["examAbbreviation", "examAbbr", "exam"]),
    year: classVideo.year,
    videoUrl: firstString(item, [
      "tutorialVideo",
      "tutorialVideoUrl",
      "videoUrl",
      "video",
    ]),
    thumbnailUrl: classVideo.thumbnailUrl,
    duration: classVideo.duration,
    description: classVideo.description,
  };
};

const buildYearLookup = (years: RecordLike[]): Map<string, string> => {
  const lookup = new Map<string, string>();
  years.forEach((year) => {
    const yearId = firstString(year, ["yearId", "id"]);
    const yearValue = firstString(year, ["yearValue", "year", "yearName"]);
    if (yearId && yearValue) {
      lookup.set(yearId, yearValue);
    }
  });
  return lookup;
};

export const fetchUserSubscription = async (): Promise<UserSubscription> => {
  const token = useAuthStore.getState().token;
  if (!token) {
    return inactiveSubscription();
  }

  try {
    const data = await apiClient.get<unknown>(
      "/user/accounts/fetch-user-subscription",
    );
    const subscription = mapSubscription(data);
    const enrollment = enrollmentFromSubscription(subscription);
    if (enrollment) {
      useAuthStore.getState().setUserEnrollment(enrollment);
    }
    return subscription;
  } catch (error: unknown) {
    const status = getErrorStatus(error);
    if (status === 401 || status === 403 || status === 404) {
      return inactiveSubscription();
    }
    throw error;
  }
};

export const checkPaymentStatus = async (): Promise<PaymentStatus> => {
  const subscription = await fetchUserSubscription();
  return {
    isSubscriptionActive: subscription.isSubscriptionActive,
    subscriptionExpiresAt: subscription.subscriptionExpiresAt,
    subscriptionType: subscription.subscriptionType,
    walletBalance: subscription.walletBalance,
    currency: subscription.currency,
    lastPaymentDate: subscription.lastPaymentDate,
    nextBillingDate: subscription.nextBillingDate,
  };
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const token = useAuthStore.getState().token;
  if (!token) {
    return {
      subscriptionExpiresIn: 0,
      walletBalance: 0,
      currency: "₦",
      subscriptionStatus: "expired",
      subscriptionType: "basic",
    };
  }

  const subscription = await fetchUserSubscription();
  const expirationDate = new Date(subscription.subscriptionExpiresAt);
  const daysUntilExpiration = Number.isNaN(expirationDate.getTime())
    ? 0
    : Math.max(
        0,
        Math.ceil(
          (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      );

  return {
    subscriptionExpiresIn: daysUntilExpiration,
    walletBalance: subscription.walletBalance,
    currency: subscription.currency,
    subscriptionStatus: subscription.isSubscriptionActive
      ? "active"
      : "expired",
    subscriptionType: subscription.subscriptionType,
  };
};

export const fetchUserEnrollment = async (): Promise<UserEnrollment | null> => {
  const subscription = await fetchUserSubscription();
  return enrollmentFromSubscription(subscription);
};

export const fetchTutorialSubjects = async (
  userEnrollment?: UserEnrollment | null,
): Promise<TutorialSubject[]> => {
  const enrollment = userEnrollment || useAuthStore.getState().userEnrollment;

  const query = enrollment?.departmentId
    ? `?departmentId=${encodeURIComponent(enrollment.departmentId)}`
    : "";

  try {
    const data = await apiClient.get<unknown>(
      `/preset-data/fetch-external-subjects${query}`,
    );

    return asArray(data)
      .map((item) => mapSubject(item, enrollment))
      .filter((subject) => subject.id);
  } catch (error) {
    console.error("Tutorial subjects fetch failed:", error);
    return [];
  }
};

export const fetchTutorialsByDepartmentAndExam = async (
  departmentId: string,
  examId: string,
  subjectId?: string,
): Promise<ClassVideo[]> => {
  const [tutorialsResponse, yearsResponse] = await Promise.all([
    apiClient.get<unknown>(
      `/admin/tutorials/fetch-tutorials-by-department-and-exam?departmentId=${encodeURIComponent(departmentId)}&examId=${encodeURIComponent(examId)}`,
    ),
    apiClient
      .get<unknown>("/admin/years/fetch-year-by-departments")
      .catch(() => []),
  ]);

  const yearLookup = buildYearLookup(asArray(yearsResponse));

  return asArray(tutorialsResponse)
    .filter((item) => {
      if (!subjectId) return true;
      const itemSubjectId = firstString(item, ["subjectId"]);
      return !itemSubjectId || itemSubjectId === subjectId;
    })
    .map((item) => {
      const yearId = firstString(item, ["yearId"]);
      return mapClassVideo(item, yearLookup.get(yearId));
    })
    .filter((video) => video.id);
};

export const fetchTutorialById = async (
  tutorialId: string,
): Promise<TutorialVideo | null> => {
  const data = await apiClient.get<unknown>(
    `/admin/tutorials/fetch-tutorial-by-id?tutorialId=${encodeURIComponent(tutorialId)}`,
  );

  const payload = unwrapPayload(data);
  const record = Array.isArray(payload)
    ? asArray(payload)[0]
    : asRecord(payload);

  if (!record || !firstString(record, ["tutorialId", "id"])) {
    return null;
  }

  return mapTutorialVideo(record);
};

export const fetchTutorialVideos = async (
  subjectId: string,
): Promise<ClassVideo[]> => {
  const enrollment = useAuthStore.getState().userEnrollment;
  if (!enrollment?.departmentId || !enrollment?.examId) {
    return [];
  }

  return fetchTutorialsByDepartmentAndExam(
    enrollment.departmentId,
    enrollment.examId,
    subjectId,
  );
};
