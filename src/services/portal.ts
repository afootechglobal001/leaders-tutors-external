import { apiClient } from "@/lib/api-client";
import {
  DashboardSummary,
  PaymentStatus,
  SubjectAccordionData,
  TutorialVideo,
  UserEnrollment,
} from "@/types/portal";
import { useAuthStore } from "@/store/authStore";

interface RawTransaction {
  statusId?: number | string;
  transactionType?: string;
  expiresAt?: string;
  subscriptionType?: string;
  walletBalance?: number;
  currency?: string;
  createdAt?: string;
  nextBillingDate?: string;
}

interface RawExamRegistration {
  departmentId?: string | number;
  departmentName?: string;
  examId?: string | number;
  examAbbr?: string;
  examTitle?: string;
  status?: string;
}

interface RawEbook {
  examId?: string | number;
  examTitle?: string;
  ebookTitle?: string;
  ebookId?: string | number;
  regPix?: string | null;
  createdAt?: string;
  updatedAt?: string;
  ebookSize?: string | number;
  ebookPages?: string | number;
}

interface RawSiteExam {
  publishId?: string | number;
  regTitle?: string;
  examAbbr?: string;
}

interface ApiErrorLike {
  status?: number;
  response?: {
    status?: number;
  };
}

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const apiError = error as ApiErrorLike;
  return apiError.status ?? apiError.response?.status;
};

export const checkPaymentStatus = async (): Promise<PaymentStatus> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn("No authentication token found, user needs to log in");
      return {
        isSubscriptionActive: false,
        subscriptionExpiresAt: new Date().toISOString(),
        subscriptionType: "basic",
        walletBalance: 0,
        currency: "â‚¦",
      };
    }

    const transactions = await apiClient.get<RawTransaction[]>(
      "/user/payment/fetch-transactions",
    );

    if (!Array.isArray(transactions)) {
      throw new Error("Invalid transactions data format");
    }

    const activeSubscription = transactions.find(
      (transaction) =>
        transaction.statusId === 4 &&
        (transaction.transactionType === "subscription" ||
          transaction.transactionType === "exam"),
    );

    const isActive = !!activeSubscription;
    const expirationDate = activeSubscription?.expiresAt
      ? new Date(activeSubscription.expiresAt)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return {
      isSubscriptionActive: isActive,
      subscriptionExpiresAt: expirationDate.toISOString(),
      subscriptionType: activeSubscription?.subscriptionType || "basic",
      walletBalance: activeSubscription?.walletBalance || 0,
      currency: activeSubscription?.currency || "â‚¦",
      lastPaymentDate: activeSubscription?.createdAt,
      nextBillingDate: activeSubscription?.nextBillingDate,
    };
  } catch (error: unknown) {
    console.error("Payment status check failed:", error);
    const errorStatus = getErrorStatus(error);

    if (errorStatus === 401 || errorStatus === 403) {
      console.warn("Authentication failed, user needs to log in");
      return {
        isSubscriptionActive: false,
        subscriptionExpiresAt: new Date().toISOString(),
        subscriptionType: "basic",
        walletBalance: 0,
        currency: "â‚¦",
      };
    }

    if (errorStatus === 500) {
      const token = useAuthStore.getState().token;
      if (!token) {
        console.warn("Server error and no auth token, user needs to log in");
        return {
          isSubscriptionActive: false,
          subscriptionExpiresAt: new Date().toISOString(),
          subscriptionType: "basic",
          walletBalance: 0,
          currency: "â‚¦",
        };
      }

      console.error(
        "Server error for authenticated user, cannot determine payment status",
      );
      return {
        isSubscriptionActive: false,
        subscriptionExpiresAt: new Date().toISOString(),
        subscriptionType: "basic",
        walletBalance: 0,
        currency: "â‚¦",
      };
    }

    throw error;
  }
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn("No authentication token found for dashboard summary");
      return {
        subscriptionExpiresIn: 0,
        walletBalance: 0,
        currency: "â‚¦",
        subscriptionStatus: "expired",
        subscriptionType: "basic",
      };
    }

    const paymentStatus = await checkPaymentStatus();
    const expirationDate = new Date(paymentStatus.subscriptionExpiresAt);
    const today = new Date();
    const daysUntilExpiration = Math.max(
      0,
      Math.ceil(
        (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    return {
      subscriptionExpiresIn: daysUntilExpiration,
      walletBalance: paymentStatus.walletBalance,
      currency: paymentStatus.currency,
      subscriptionStatus: paymentStatus.isSubscriptionActive
        ? "active"
        : "expired",
      subscriptionType: paymentStatus.subscriptionType,
    };
  } catch (error: unknown) {
    console.error("Dashboard summary fetch failed:", error);

    const token = useAuthStore.getState().token;
    if (!token) {
      return {
        subscriptionExpiresIn: 0,
        walletBalance: 0,
        currency: "â‚¦",
        subscriptionStatus: "expired",
        subscriptionType: "basic",
      };
    }

    throw error;
  }
};

export const fetchUserEnrollment = async (): Promise<UserEnrollment | null> => {
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn("No authentication token found for user enrollment");
      return null;
    }

    const examData = await apiClient.get<RawExamRegistration[]>(
      "/user/exam/fetch-exam",
    );

    if (Array.isArray(examData) && examData.length > 0) {
      const latestExam = examData[0];

      return {
        departmentId: String(latestExam.departmentId || "1"),
        departmentName: latestExam.departmentName || "Science",
        examId: String(latestExam.examId || ""),
        examAbbreviation: latestExam.examAbbr || "WAEC",
        status: latestExam.status || "active",
      };
    }

    return null;
  } catch (error: unknown) {
    console.error("User enrollment fetch failed:", error);

    const token = useAuthStore.getState().token;
    if (!token) {
      return null;
    }

    throw error;
  }
};

export const fetchTutorialSubjects = async (
  userEnrollment?: UserEnrollment | null,
): Promise<SubjectAccordionData[]> => {
  try {
    let enrollment = userEnrollment;
    if (!enrollment) {
      enrollment = useAuthStore.getState().userEnrollment;
    }

    if (!enrollment) {
      console.warn("No user enrollment data found, cannot fetch subjects");
      return [];
    }

    try {
      const ebooksData = await apiClient.get<RawEbook[]>(
        "/user/ebooks/fetch-ebook",
      );

      if (Array.isArray(ebooksData) && ebooksData.length > 0) {
        const subjectMap = new Map<string, SubjectAccordionData>();

        ebooksData.forEach((ebook) => {
          const subjectKey = String(ebook.examId || "general");

          if (!subjectMap.has(subjectKey)) {
            subjectMap.set(subjectKey, {
              id: subjectKey,
              name: ebook.examTitle || ebook.ebookTitle || "General Studies",
              department: enrollment.departmentName,
              departmentId: enrollment.departmentId,
              exam: enrollment.examAbbreviation,
              examId: enrollment.examId,
              examAbbr: enrollment.examAbbreviation,
              items: [],
            });
          }

          subjectMap.get(subjectKey)?.items.push({
            id: String(ebook.ebookId || `${subjectKey}-ebook`),
            title: `${ebook.ebookTitle || "Study Material"} (${enrollment.examAbbreviation})`,
            year: new Date().getFullYear().toString(),
            videoCount: 0,
            description: ebook.ebookTitle || "Study material",
          });
        });

        return Array.from(subjectMap.values());
      }
    } catch (ebookError: unknown) {
      console.warn("Could not fetch ebooks:", ebookError);
    }

    try {
      const examData = await apiClient.get<RawExamRegistration[]>(
        "/user/exam/fetch-exam",
      );

      if (Array.isArray(examData) && examData.length > 0) {
        return examData.map((exam) => ({
          id: String(exam.examId || ""),
          name: exam.examTitle || exam.examAbbr || "Exam Preparation",
          department: enrollment.departmentName,
          departmentId: enrollment.departmentId,
          exam: enrollment.examAbbreviation,
          examId: enrollment.examId,
          examAbbr: enrollment.examAbbreviation,
          items: [
            {
              id: `${String(exam.examId || "exam")}_prep`,
              title: `${exam.examTitle || exam.examAbbr} Preparation`,
              year: new Date().getFullYear().toString(),
              videoCount: 0,
              description: `Preparation materials for ${exam.examTitle || exam.examAbbr}`,
            },
          ],
        }));
      }
    } catch (examError: unknown) {
      console.warn("Could not fetch exam data:", examError);
    }

    try {
      const siteExams = await apiClient.get<RawSiteExam[]>(
        "/site/exams/fetch-all-exams?pageCategoryId=examCategory&countryId=NG",
      );

      if (Array.isArray(siteExams) && siteExams.length > 0) {
        return siteExams.slice(0, 5).map((exam) => ({
          id: String(exam.publishId || ""),
          name: exam.regTitle || exam.examAbbr || "International Exam",
          department: enrollment.departmentName,
          departmentId: enrollment.departmentId,
          exam: enrollment.examAbbreviation,
          examId: enrollment.examId,
          examAbbr: enrollment.examAbbreviation,
          items: [
            {
              id: `${String(exam.publishId || "site-exam")}_2024`,
              title: `${exam.regTitle || exam.examAbbr} (2024 ${enrollment.examAbbreviation})`,
              year: "2024",
              videoCount: 0,
              description: `${exam.regTitle || "Exam"} tutorial materials`,
            },
            {
              id: `${String(exam.publishId || "site-exam")}_2025`,
              title: `${exam.regTitle || exam.examAbbr} (2025 ${enrollment.examAbbreviation})`,
              year: "2025",
              videoCount: 0,
              description: `${exam.regTitle || "Exam"} tutorial materials`,
            },
          ],
        }));
      }
    } catch (siteError: unknown) {
      console.warn("Could not fetch site exam data:", siteError);
    }

    return [];
  } catch (error) {
    console.error("Tutorial subjects fetch failed:", error);
    return [];
  }
};

export const fetchTutorialVideos = async (
  subjectId: string,
): Promise<TutorialVideo[]> => {
  try {
    const ebooksData = await apiClient.get<RawEbook[]>(
      "/user/ebooks/fetch-ebook",
    );

    if (!Array.isArray(ebooksData)) {
      throw new Error("Invalid ebooks data format received from API");
    }

    const filteredEbooks = ebooksData.filter(
      (ebook) => !subjectId || String(ebook.examId || "") === subjectId,
    );

    return filteredEbooks.map((ebook) => ({
      id: String(ebook.ebookId || ""),
      title: ebook.ebookTitle || "Tutorial Material",
      subject: ebook.examTitle || "General Studies",
      department: "General",
      exam: String(ebook.examId || ""),
      year: new Date().getFullYear().toString(),
      videoUrl: "",
      thumbnailUrl: ebook.regPix || undefined,
      duration: "N/A",
      description: ebook.ebookTitle || "Study material",
    }));
  } catch (error) {
    console.error("Tutorial videos fetch failed:", error);
    throw error;
  }
};
