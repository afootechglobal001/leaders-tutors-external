import { apiClient } from "@/lib/api-client";

export interface WalletTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  type: 'load_wallet' | 'exam_payment' | 'ebook_payment' | 'subscription';
  createdAt: string;
  description: string;
}

export interface PaymentInitiation {
  transactionId: string;
  paymentUrl: string;
  amount: number;
  currency: string;
}

// Load wallet - initiate payment
export const initiateWalletLoad = async (amount: number): Promise<PaymentInitiation> => {
  try {
    const data = await apiClient.post<any>("/user/payment/load-wallet-log", {
      amount: amount.toString()
    });
    
    return {
      transactionId: data.transactionId || data.id,
      paymentUrl: data.paymentUrl || data.authorization_url,
      amount: data.amount || amount,
      currency: data.currency || "₦",
    };
  } catch (error) {
    console.error("Wallet load initiation failed:", error);
    throw new Error("Failed to initiate wallet loading");
  }
};

// Confirm wallet load success
export const confirmWalletLoadSuccess = async (transactionId: string): Promise<boolean> => {
  try {
    await apiClient.post(`/user/payment/load-wallet-success?id=${transactionId}`);
    return true;
  } catch (error) {
    console.error("Wallet load confirmation failed:", error);
    return false;
  }
};

// Cancel wallet load
export const cancelWalletLoad = async (transactionId: string): Promise<boolean> => {
  try {
    await apiClient.post(`/user/payment/load-wallet-cancel?id=${transactionId}`);
    return true;
  } catch (error) {
    console.error("Wallet load cancellation failed:", error);
    return false;
  }
};

// Fetch user transactions
export const fetchUserTransactions = async (): Promise<WalletTransaction[]> => {
  try {
    const data = await apiClient.get<any[]>("/user/payment/fetch-transactions");
    
    if (!Array.isArray(data)) {
      return [];
    }
    
    return data.map((transaction: any) => ({
      id: transaction.transactionId || transaction.id,
      amount: parseFloat(transaction.amount || "0"),
      currency: transaction.currency || "₦",
      status: mapTransactionStatus(transaction.statusId),
      type: mapTransactionType(transaction.transactionType || transaction.type),
      createdAt: transaction.createdAt || transaction.created_at,
      description: transaction.description || `${transaction.type || 'Transaction'} - ${transaction.amount}`,
    }));
  } catch (error) {
    console.error("Transactions fetch failed:", error);
    return [];
  }
};

// Helper function to map status IDs to readable status
function mapTransactionStatus(statusId: number | string): 'pending' | 'success' | 'failed' | 'cancelled' {
  switch (statusId?.toString()) {
    case '3': return 'pending';
    case '4': return 'success';
    case '5': return 'cancelled';
    default: return 'failed';
  }
}

// Helper function to map transaction types
function mapTransactionType(type: string): 'load_wallet' | 'exam_payment' | 'ebook_payment' | 'subscription' {
  if (type?.toLowerCase().includes('wallet')) return 'load_wallet';
  if (type?.toLowerCase().includes('exam')) return 'exam_payment';
  if (type?.toLowerCase().includes('ebook')) return 'ebook_payment';
  if (type?.toLowerCase().includes('subscription')) return 'subscription';
  return 'load_wallet';
}

// Exam payment functions
export const initiateExamPayment = async (examRegistrationId: string): Promise<PaymentInitiation> => {
  try {
    const data = await apiClient.post<any>("/user/exam/initiate-exam-payment", {
      examRegistrationId
    });
    
    return {
      transactionId: data.transactionId || data.id,
      paymentUrl: data.paymentUrl || data.authorization_url,
      amount: data.amount,
      currency: data.currency || "₦",
    };
  } catch (error) {
    console.error("Exam payment initiation failed:", error);
    throw new Error("Failed to initiate exam payment");
  }
};

export const confirmExamPaymentSuccess = async (transactionId: string, examRegistrationId: string): Promise<boolean> => {
  try {
    await apiClient.post(`/user/exam/exam-payment-success?transactionId=${transactionId}&examRegistrationId=${examRegistrationId}`);
    return true;
  } catch (error) {
    console.error("Exam payment confirmation failed:", error);
    return false;
  }
};

export const cancelExamPayment = async (transactionId: string, examRegistrationId: string): Promise<boolean> => {
  try {
    await apiClient.post(`/user/exam/exam-payment-cancel?transactionId=${transactionId}&examRegistrationId=${examRegistrationId}`);
    return true;
  } catch (error) {
    console.error("Exam payment cancellation failed:", error);
    return false;
  }
};