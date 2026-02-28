"use client";
import { useEffect, useState } from "react";
import { AUTH_PAGES } from "@/constants/auth";
import { UserAuthWrapper } from "@/features/auth/UserAuthWrapper";
import { Auth } from "./Auth";
import { AuthFormStepsType } from "@/types/auth/auth";
import { ResetPassword } from "./ResetPassword";
import { VerifyAccount } from "./VerifyAccount";
import { CreatePassword } from "./CreatePassword";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/general-components/compnents";

export default function Login() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [nextPage, setNextPage] = useState<AuthFormStepsType>();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const gotoAuthFormPage = (stepKey: AuthFormStepsType) => {
    setNextPage(stepKey);
  };

  useEffect(() => {
    if (user) {
      setIsLoggedOut(false);
      router.push("/dashboard");
    } else {
      setIsLoggedOut(true);
      setNextPage(AUTH_PAGES.LOGIN);
    }
  }, [user, router]);

  if (!isLoggedOut) {
    return <LoadingScreen />;
  }

  return (
    <UserAuthWrapper>
      {nextPage === AUTH_PAGES.LOGIN && (
        <Auth gotoAuthFormPage={gotoAuthFormPage} />
      )}
      {nextPage === AUTH_PAGES.RESET_PASSWORD && (
        <ResetPassword gotoAuthFormPage={gotoAuthFormPage} />
      )}
      {nextPage === AUTH_PAGES.VERIFY_ACCOUNT && (
        <VerifyAccount gotoAuthFormPage={gotoAuthFormPage} />
      )}
      {nextPage === AUTH_PAGES.CREATE_PASSWORD && (
        <CreatePassword gotoAuthFormPage={gotoAuthFormPage} />
      )}
    </UserAuthWrapper>
  );
}
