"use client";
import { Button } from "@/components/form";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserAuthWrapper } from "../auth/UserAuthWrapper";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { useRouter } from "next/navigation";
import useToggle from "@/hooks/useToggle";

export const OtpVerification = () => {
  const [timer, setTimer] = useState(30);
  const [showResendLink, setShowResendLink] = useState(false);
  const countDownSec = () => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          setShowResendLink(true);
          clearInterval(countdown);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(countdown);
  };
  useEffect(() => {
    const speakTimer = setTimeout(() => {
      countDownSec();
    }, 2000); // 2-second delay
    return () => clearTimeout(speakTimer);
  }, []);
  const resendOTP = async () => {
    try {
      setShowResendLink(false);
      setTimer(30);
    } catch (error: unknown) {
      console.log(error);
    }
  };
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (isNaN(Number(e.target.value))) return false;
    setOtp(otp.map((data, i) => (i === index ? e.target.value : data)));
    if (e.target.value && e.target.nextSibling) {
      (e.target.nextSibling as HTMLInputElement).focus();
    }
  };

  const handlePasteValue = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const value = e.clipboardData.getData("text");
    if (isNaN(Number(value))) return false; // Ensure value is treated as a number
    const updatedValue = value.toString().split("").slice(0, otp.length);
    setOtp(updatedValue);
    e.currentTarget.parentNode?.querySelector(
      "input:focus",
    ) as HTMLInputElement;
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      e.key === "Backspace" &&
      !e.currentTarget.value &&
      e.currentTarget.previousSibling
    ) {
      (e.currentTarget.previousSibling as HTMLInputElement).focus();
      setOtp(otp.map((data, i) => (i === index - 1 ? "" : data)));
    }
  };

  const router = useRouter();
  const passwordResetSuccessToggle = useToggle();
  const [isPending, setIsPending] = useState(false);
  const login = () => {
    router.push("/");
  };
  const handleVerifyEmail = async () => {
    setIsPending(true);
    passwordResetSuccessToggle.open();
    setIsPending(false);
  };
  return (
    <UserAuthWrapper>
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
          <h1 className="text-2xl text-(title-color) font-bold-custom">
            Verify your{" "}
            <span className="text-(--secondary-color)">account</span>
          </h1>
          <p>
            Enter the verification code sent to your email address{" "}
            <span className="font-medium-custom text-(--primary-color)">
              sunaf4real@gmail.com
            </span>
          </p>
        </div>

        <div className="flex justify-between gap-5 w-full">
          {otp.map((data, i) => {
            return (
              <input
                key={i}
                value={data}
                onChange={(e) => handleChange(e, i)}
                onPaste={handlePasteValue}
                onKeyDown={(e) => handleKeyDown(e, i)}
                maxLength={1}
                type="text"
                className="h-15 w-15 border border-black/20 rounded-md  bg-white  text-xl text-(--primary-color) focus:outline-none peer focus:bg-white focus:shadow-lg flex justify-center items-center text-center font-medium-custom"
              />
            );
          })}
        </div>
        {!showResendLink ? (
          <p className="text-md">
            Don&apos;t see it? Send a new code in 00:{timer} sec
          </p>
        ) : (
          <p
            onClick={resendOTP}
            className="text-md cursor-pointer hover:underline"
          >
            Resend OTP
          </p>
        )}

        {/* BUTTON */}
        <Button
          text="Proceed"
          frontIcon={<ArrowRight />}
          fullWidth
          onClick={handleVerifyEmail}
        />
        <p className="text-sm text-(--text-color)">
          Already have an account?{" "}
          <Link
            className="text-(--primary-color) font-medium-custom cursor-pointer hover:underline"
            href="/"
          >
            Login Here
          </Link>
        </p>
      </section>
      <FeedbackDialog
        variant="success"
        title="Account Created Successful"
        text="Your Limo Managers Account has been created successfully, you can now log into your account with your email and new password."
        btnText="Login to my account"
        loadingText="Processing..."
        onClick={login}
        isLoading={isPending}
        isOpen={passwordResetSuccessToggle.isOpen}
      />
    </UserAuthWrapper>
  );
};
