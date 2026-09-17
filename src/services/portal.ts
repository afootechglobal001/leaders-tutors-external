import { apiClient } from "@/lib/api-client";
import {
  DashboardSummary,
  SubjectAccordionData,
  PaymentStatus,
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
}

interface RawSiteExam {
  publishId?: string | number;
  regTitle?: string;
  examAbbr?: string;
}

interface ApiErrorLike {
  status?: number;
  response?: { status?: number };
}

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) return undefined;
  const apiError = error as ApiErrorLike;
  return apiError.status ?? apiError.response?.status;
};

export const checkPaymentStatus = async (): Promise<PaymentStatus> => {
  try {
    // Check if user is authenticated first
    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn("No authentication token found, user needs to log in");
      return {
        isSubscriptionActive: false,
        subscriptionExpiresAt: new Date().toISOString(),
        subscriptionType: "basic",
        walletBalance: 0,
        currency: "₦",
      };
    }

    const transactions = await apiClient.get<RawTransaction[]>(
      "/user/payment/fetch-transactions",
    );

    if (!Array.isArray(transactions)) {
      throw new Error("Invalid transactions data format");
    }

    // Find the most recent successful subscription transaction
    const activeSubscription = transactions.find(
      (transaction) =>
        transaction.statusId === 4 && // Success status
        (transaction.transactionType === "subscription" ||
          transaction.transactionType === "exam"),
    );

    // Calculate subscription status based on transaction data
    const isActive = !!activeSubscription;
    const expirationDate = activeSubscription?.expiresAt
      ? new Date(activeSubscription.expiresAt)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

    return {
      isSubscriptionActive: isActive,
      subscriptionExpiresAt: expirationDate.toISOString(),
      subscriptionType: activeSubscription?.subscriptionType || "basic",
      walletBalance: activeSubscription?.walletBalance || 0,
      currency: activeSubscription?.currency || "₦",
      lastPaymentDate: activeSubscription?.createdAt,
      nextBillingDate: activeSubscription?.nextBillingDate,
    };
  } catch (error: unknown) {
    console.error("Payment status check failed:", error);
    const errorStatus = getErrorStatus(error);

    // Handle authentication errors or server errors gracefully
    if (errorStatus === 401 || errorStatus === 403) {
      // User not authenticated - return inactive subscription
      console.warn("Authentication failed, user needs to log in");
      return {
        isSubscriptionActive: false,
        subscriptionExpiresAt: new Date().toISOString(),
        subscriptionType: "basic",
        walletBalance: 0,
        currency: "₦",
      };
    }

    if (errorStatus === 500) {
      // Server error - check if user is logged in to determine fallback behavior
      const token = useAuthStore.getState().token;
      if (!token) {
        console.warn("Server error and no auth token, user needs to log in");
        return {
          isSubscriptionActive: false,
          subscriptionExpiresAt: new Date().toISOString(),
          subscriptionType: "basic",
          walletBalance: 0,
          currency: "₦",
        };
      }

      // If user is logged in but server error, return inactive subscription
      console.error(
        "Server error for authenticated user, cannot determine payment status",
      );
      return {
        isSubscriptionActive: false,
        subscriptionExpiresAt: new Date().toISOString(),
        subscriptionType: "basic",
        walletBalance: 0,
        currency: "₦",
      };
    }

    throw error;
  }
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    // Check if user is authenticated first
    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn("No authentication token found for dashboard summary");
      return {
        subscriptionExpiresIn: 0,
        walletBalance: 0,
        currency: "₦",
        subscriptionStatus: "expired",
        subscriptionType: "basic",
      };
    }

    // Since there's no dedicated dashboard summary endpoint, we'll derive it from payment data
    const paymentStatus = await checkPaymentStatus();

    // Calculate days until expiration
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

    // Check if user is authenticated to determine appropriate fallback
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

    // Return error state for authenticated users - no demo data
    throw error;
  }
};

export const fetchUserEnrollment = async (): Promise<UserEnrollment | null> => {
  try {
    // Check if user is authenticated first
    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn("No authentication token found for user enrollment");
      return null;
    }

    // Since there's no dedicated user enrollment endpoint, we'll derive it from available data
    // This would typically come from the user's signup data or exam registrations

    // Try to get user exam registrations to determine enrollment
    const examData = await apiClient.get<RawExamRegistration[]>(
      "/user/exam/fetch-exam",
    );

    if (Array.isArray(examData) && examData.length > 0) {
      // Use the most recent exam registration to determine enrollment
      const latestExam = examData[0];

      return {
        departmentId: String(latestExam.departmentId || "1"),
        departmentName: latestExam.departmentName || "Science",
        examId: String(latestExam.examId || ""),
        examAbbreviation: latestExam.examAbbr || "WAEC",
        status: latestExam.status || "active",
      };
    }

    // If no exam data, return null to indicate no enrollment found
    return null;
  } catch (error: unknown) {
    console.error("User enrollment fetch failed:", error);

    // Check if user is authenticated to determine appropriate fallback
    const token = useAuthStore.getState().token;
    if (!token) {
      return null;
    }

    // For authenticated users, don't return demo data - let the error propagate
    throw error;
  }
};

export const fetchTutorialSubjects = async (
  userEnrollment?: UserEnrollment | null,
): Promise<SubjectAccordionData[]> => {
  try {
    // Get user enrollment data from parameter or auth store
    let enrollment = userEnrollment;
    if (!enrollment) {
      enrollment = useAuthStore.getState().userEnrollment;
    }

    if (!enrollment) {
      console.warn("No user enrollment data found, cannot fetch subjects");
      return [];
    }

    // Since there's no dedicated subjects endpoint, we'll use the available exam data
    // and derive subjects from the user's exam registrations and available ebooks

    try {
      // Try to get ebooks which might contain subject information
      const ebooksData = await apiClient.get<RawEbook[]>(
        "/user/ebooks/fetch-ebook",
      );

      if (Array.isArray(ebooksData) && ebooksData.length > 0) {
        // Group ebooks by exam/subject to create tutorial subjects
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

          // Add ebook as a tutorial item
          subjectMap.get(subjectKey)?.items.push({
            id: String(ebook.ebookId || `${subjectKey}-ebook`),
            title: `${ebook.ebookTitle || "Study Material"} (${enrollment.examAbbreviation})`,
            year: new Date().getFullYear().toString(),
            videoCount: 0, // Ebooks don't have videos
            description: ebook.ebookTitle || "Study material",
          });
        });

        return Array.from(subjectMap.values());
      }
    } catch (ebookError: unknown) {
      console.warn("Could not fetch ebooks:", ebookError);
    }

    // Fallback: Create subjects based on exam data
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

    // Final fallback: Use site exam data to create generic subjects
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
              videoCount: 0, // No mock video count
              description: `${exam.regTitle || "Exam"} tutorial materials`,
            },
            {
              id: `${String(exam.publishId || "site-exam")}_2025`,
              title: `${exam.regTitle || exam.examAbbr} (2025 ${enrollment.examAbbreviation})`,
              year: "2025",
              videoCount: 0, // No mock video count
              description: `${exam.regTitle || "Exam"} tutorial materials`,
            },
          ],
        }));
      }
    } catch (siteError: unknown) {
      console.warn("Could not fetch site exam data:", siteError);
    }

    // No fallback data - return empty array
    return [];
  } catch (error) {
    console.error("Tutorial subjects fetch failed:", error);

    // Return empty array as final fallback
    return [];
  }
};

export const fetchTutorialVideos = async (
  subjectId: string,
): Promise<TutorialVideo[]> => {
  try {
    // Since there are no dedicated video endpoints in the Postman collection,
    // we'll return ebook data as tutorial materials for now
    const ebooksData = await apiClient.get<RawEbook[]>(
      "/user/ebooks/fetch-ebook",
    );

    if (!Array.isArray(ebooksData)) {
      throw new Error("Invalid ebooks data format received from API");
    }

    // Filter ebooks by subject if possible
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
