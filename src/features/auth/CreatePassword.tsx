import { FeedbackDialog } from "@/components/feedback-dialog";
import { Button, PasswordInput } from "@/components/form";
import useToggle from "@/hooks/useToggle";
import { AuthFormStepsType } from "@/types/auth/auth";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
interface AuthFormStepsProps {
  gotoAuthFormPage: (stepKey: AuthFormStepsType) => void;
}

export const CreatePassword: React.FC<AuthFormStepsProps> = (props) => {
  const { gotoAuthFormPage } = props;
  const passwordResetSuccessToggle = useToggle();
  const [isPending, setIsPending] = useState(false);
  const login = () => {
    gotoAuthFormPage("login");
  };
  const createPassword = async () => {
    setIsPending(true);
    passwordResetSuccessToggle.open();
    setIsPending(false);
  };
  return (
    <>
      <section className="flex flex-col gap-5 justify-center items-start animate-fade-up">
        <div className="flex flex-col gap-1">
          <div className="w-20">
            <Image
              src="/body-pix/icon.png"
              alt="Vector"
              className="w-full h-auto"
              width={0}
              height={0}
              unoptimized
            />
          </div>
          <h1 className="text-2xl text-[#1F2937] font-bold-custom">
            Create <span className="text-(--secondary-color)">Password</span>
          </h1>
          <p className="text-(--text-color) text-[16px]">
            Enter a strong password to secure your account.
          </p>
        </div>
        <PasswordInput id="password" label="Create Password" />

        {/* Confirm Password */}
        <PasswordInput id="confirmPassword" label="Confirm password" />
        {/* BUTTON */}
        <Button
          onClick={createPassword}
          text="Proceed"
          frontIcon={<ArrowRight />}
          fullWidth
        />
        <p className="text-sm text-(--text-color)">
          Already have an account?{" "}
          <span
            className="text-(--primary-color) font-medium-custom cursor-pointer hover:underline"
            onClick={login}
          >
            Login Here
          </span>
        </p>
      </section>
      <FeedbackDialog
        variant="success"
        title="Password Reset Successful"
        text="Your password have been reset successfully, you can now log into your account with your email and new password."
        btnText="Login to my account"
        loadingText="Processing..."
        onClick={login}
        isLoading={isPending}
        isOpen={passwordResetSuccessToggle.isOpen}
      />
    </>
  );
};
