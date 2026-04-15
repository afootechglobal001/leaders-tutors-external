"use client";

import { UserAuthWrapper } from "@/features/auth/UserAuthWrapper";
import { useRouter } from "next/navigation";
import { Button, FormSelect, TextInput } from "@/components/form";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignupSchema, SignupSchemaType } from "@/types/auth/schema";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { handleAppError } from "@/lib/axios";
import { showToast } from "@/components/toast";
import {
  mapSignupPayload,
  signupUser,
  fetchDepartments,
  fetchExams,
} from "@/services/auth";

export default function SignUp() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // ✅ NEW STATE
  const [departments, setDepartments] = useState<
    { value: string; label: string }[]
  >([]);
  const [exams, setExams] = useState<{ value: string; label: string }[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
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

  const selectedDepartment = watch("department");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptOptions, examOptions] = await Promise.all([
          fetchDepartments(),
          fetchExams(),
        ]);

        setDepartments(deptOptions);
        setExams(examOptions);
      } catch (error) {
        console.error(error);
        showToast({
          variant: "error",
          title: "Error",
          message: "Failed to load dropdown data",
        });
      }
    };

    fetchData();
  }, []);


  const handleSignup = async (data: SignupSchemaType) => {
    try {
      setIsPending(true);

      await signupUser(mapSignupPayload(data));

      showToast({
        variant: "success",
        title: "Signup successful",
        message:
          "Your account has been created successfully. You can now log in.",
      });

      router.push("/");
    } catch (error) {
      handleAppError({ showToast: true, error });
    } finally {
      setIsPending(false);
    }
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
            <strong>sign up to Leaders Tutors External Exams.</strong>
          </p>
        </div>

        <TextInput
          id="text"
          label="Full Name"
          message={errors.fullName?.message}
          disabled={isPending}
          {...register("fullName")}
        />

        <TextInput
          id="email"
          label="Email Address"
          message={errors.emailAddress?.message}
          disabled={isPending}
          {...register("emailAddress")}
        />

        <TextInput
          id="tel"
          label="Mobile Number"
          message={errors.phoneNumber?.message}
          disabled={isPending}
          {...register("phoneNumber")}
        />

        <div className="w-full">
          {/* ✅ Department */}
          <FormSelect
            id="department"
            label="Department"
            placeholder="Select Here"
            {...register("department", { required: true })}
            control={control}
            message={errors.department?.message}
            options={departments}
            disabled={isPending}
          />
        </div>

        {/* ✅ Exam */}
        <FormSelect
          id="exam"
          label="Select External Exam"
          placeholder="Select Here"
          {...register("exam", { required: true })}
          control={control}
          message={errors.exam?.message}
          options={exams}
          disabled={isPending}
        />

        <div className="w-full relative">
          <TextInput
            id="password"
            type="password"
            label="Create Password"
            message={errors.password?.message}
            disabled={isPending}
            {...register("password")}
          />
        </div>

        <div className="w-full relative">
          <TextInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            message={errors.confirmPassword?.message}
            disabled={isPending}
            {...register("confirmPassword")}
          />
        </div>

        <Button
          text="Sign-Up"
          frontIcon={<ArrowRight />}
          fullWidth
          isLoading={isPending}
          onClick={handleSubmit(handleSignup)}
        />

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
