import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@/components/form";
import { AuthFormStepsType } from "@/types/auth/auth";
import { AuthLoginSchema, AuthLoginType } from "@/types/auth/schema";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
// import { useLogin } from "@/hooks/admin/useAuth";
// import { handleAppError } from "@/lib/axios";
// import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

interface AuthFormStepsProps {
  gotoAuthFormPage: (stepKey: AuthFormStepsType) => void;
}

export const Auth: React.FC<AuthFormStepsProps> = (props) => {
  const { gotoAuthFormPage } = props;
  // const { setAuth } = useAuthStore.getState();
  const router = useRouter();
  const {
    register,
    // handleSubmit,
    formState: { errors },
  } = useForm<AuthLoginType>({
    defaultValues: {
      email: "",
      password: "",
      user_type: "ADMIN",
    },
    resolver: zodResolver(AuthLoginSchema),
    mode: "onChange",
  });

  // const { mutate, isPending } = useLogin();
  //  const handleLogin = (data: AuthLoginType) => {
  //     mutate(data, {
  //       onSuccess: (response) => {
  //         setAuth(response.data, response.data.token);
  //         router.push("/admin/dashboard");
  //       },
  //       onError: (error) => {
  //         handleAppError({ showToast: true, error });
  //       },
  //     });
  //   };
  const handleLogin = () => {
    router.push("/dashboard");
  };

  const resetPassword = async () => {
    gotoAuthFormPage("resetPassword");
  };

  const signUp = async () => {
    gotoAuthFormPage("signup");
  };

  return (
    <>
      <section className="flex flex-col gap-5 justify-center items-start animate-fade-up">
        <div className="flex flex-col gap-2">
          <div className="w-50">
            <Image
              src="/body-pix/logo.png"
              alt="Vector"
              className="w-full h-auto"
              width={0}
              height={0}
              unoptimized
            />
          </div>
          <h1 className="text-2xl text-[#1F2937] font-bold-custom">
            Welcome <span className="text-(--secondary-color)">Back!</span>
          </h1>
          <p className="text-(--text-color) text-[16px]">
            Please enter your details to login to your{" "}
            <strong>Leaders Tutors External Examination</strong> portal
          </p>
        </div>

        <TextInput
          id="email"
          label="Email address"
          message={errors.email?.message}
          {...register("email")}
          // disabled={isPending}
        />
        <TextInput
          id="password"
          label="Password"
          type="password"
          message={errors.password?.message}
          {...register("password")}
          //disabled={isPending}
        />
        <p className="text-sm text-(--text-color)">
          Forgot Password?{" "}
          <span
            className="text-(--primary-color) font-medium-custom cursor-pointer hover:underline"
            onClick={resetPassword}
          >
            Reset Password Here
          </span>
        </p>

        {/* BUTTON */}
        <Button
          text="Login"
          frontIcon={<ArrowRight />}
          fullWidth
          // isLoading={isPending}
          onClick={handleLogin}
        />

        {/* dont have an account? sign up here */}
        <div className="flex flex-col gap-4 items-center justify-center w-full pt-4 border-t border-gray-300">
          <p className="text-sm text-(--text-color)">
            Don&apos;t have an account?{" "}
            <span
              className="text-(--primary-color) font-medium-custom cursor-pointer hover:underline"
              onClick={signUp}
            >
              Sign Up Here
            </span>
          </p>
          <p className="text-sm text-(--text-color) text-center">
            By logging in to this portal, you agree to our
            <br />
            <span className="text-(--primary-color) font-medium-custom cursor-pointer hover:underline">
              Privacy Policy
            </span>{" "}
            and{" "}
            <span className="text-(--primary-color) font-medium-custom cursor-pointer hover:underline">
              Terms of Service
            </span>
            .
          </p>
        </div>
      </section>
    </>
  );
};
