import type { Metadata } from "next";
import Transactions from "@/features/portal/transactions/Transactions";

export const metadata: Metadata = {
  title: "Transaction History - Leaders Tutors External Exams",
  description:
    "Review your full payment activity on Leaders Tutors. Track wallet funding, subscription charges, and exam payments with their statuses and timestamps.",
};

export default function Page() {
  return <Transactions />;
}
