"use client";
import { UserAuthWrapper } from "@/features/auth/UserAuthWrapper";
import { useRouter } from "next/navigation";
import { Button, FormSelect, TextInput } from "@/components/form";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DEPARTMENTS } from "@/constants/auth";
import { SignupSchema, SignupSchemaType } from "@/types/auth/schema";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
export default function SignUp() {
  const router = useRouter();

  const {
    register,
    // handleSubmit,
    control,
    // reset,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    defaultValues: {
      fullName: "",
      emailAddress: "",
      phoneNumber: "",
      department: "",
      exam: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(SignupSchema) as Resolver<SignupSchemaType>,
    mode: "onChange",
  });
  const handleVerifEmail = () => {
    router.push("/sign-up/verify-account");
  };
  return (
    <UserAuthWrapper>
      <section className="flex flex-col gap-5 justify-center items-start animate-fade-down">
        <div className="flex flex-col gap-2">
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
            Student <span className="text-(--secondary-color)">Sign Up!</span>
          </h1>
          <p>
            Kindly provide the required information to{" "}
            <strong>sign up to Limo Managers Client Portal.</strong>
          </p>
        </div>

        <TextInput
          id="text"
          label="Full Name"
          // disabled={isPending}
        />

        <TextInput
          id="email"
          label="Email Address"
          // disabled={isPending}
        />

        <TextInput
          id="tel"
          label="Mobile Number"
          // disabled={isPending}
        />
        <FormSelect
          id="department"
          label="Select Your Department"
          placeholder="Select Here"
          {...register("department", { required: true })}
          control={control}
          message={errors.department?.message}
          options={DEPARTMENTS}
        />
        <FormSelect
          id="exam"
          label="Select External Exam"
          placeholder="Select Here"
          {...register("exam", { required: true })}
          control={control}
          message={errors.exam?.message}
          options={DEPARTMENTS}
        />

        <div className="w-full relative">
          <TextInput id="password" type="password" label="Create Password" />
        </div>

        {/* Confirm Password */}
        <div className="w-full relative">
          <TextInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
          />
        </div>

        {/* BUTTON */}
        <Button
          text="Sign-Up"
          frontIcon={<ArrowRight />}
          fullWidth
          // isLoading={isPending}
          onClick={handleVerifEmail}
        />

        {/* dont have an account? sign up here */}
        <div className="flex flex-col gap-4 items-center justify-center w-full pt-4 border-t border-gray-300">
          <p className="text-sm text-(--text-color)">
            Already have an account?{" "}
            <Link
              className="text-(--primary-color) font-medium-custom cursor-pointer hover:underline"
              href="/"
            >
              Login Here
            </Link>
          </p>
          <p className="text-sm text-(--text-color) text-center">
            By signing up to this portal, you agree to our
            <br />
            <span className="text-(--secondary-color) font-medium-custom cursor-pointer hover:underline">
              Privacy Policy
            </span>{" "}
            and{" "}
            <span className="text-(--secondary-color) font-medium-custom cursor-pointer hover:underline">
              Terms of Service
            </span>
            .
          </p>
        </div>
      </section>
    </UserAuthWrapper>
  );
}
