export interface DashboardSummary {
  subscriptionExpiresIn: number;
  walletBalance: number;
  currency: string;
  subscriptionStatus?: 'active' | 'expired' | 'pending';
  subscriptionType?: string;
}

export interface TutorialVideo {
  id: string;
  title: string;
  subject: string;
  department: string;
  exam: string;
  year: number | string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  description?: string;
}

export interface SubjectAccordionData {
  id: string;
  name: string;
  department: string;
  departmentId: string;
  exam: string;
  examId: string;
  examAbbr?: string;
  items: {
    id: string;
    title: string;
    year: string | number;
    videoCount?: number;
    description?: string;
  }[];
}

export interface PaymentStatus {
  isSubscriptionActive: boolean;
  subscriptionExpiresAt: string;
  subscriptionType: string;
  walletBalance: number;
  currency: string;
  lastPaymentDate?: string;
  nextBillingDate?: string;
}

export interface TutorialSubject {
  id: string;
  name: string;
  examAbbr: string;
  department: string;
  videoCount: number;
  topics: TutorialTopic[];
}

export interface TutorialTopic {
  id: string;
  title: string;
  year: string;
  videoCount: number;
  videos: TutorialVideo[];
}

export interface UserEnrollment {
  departmentId: string;
  departmentName: string;
  examId: string;
  examAbbreviation: string;
  status?: string;
}
