import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/form/Buttons";
import { ArrowRight } from "lucide-react";
import { AuthFormStepsType } from "@/types/auth/auth";
import { TextInput } from "@/components/form/TextInput";

interface AuthFormStepsProps {
  gotoAuthFormPage: (stepKey: AuthFormStepsType) => void;
}

type FormState = {
  fullName: string;
  email: string;
  mobile: string;
  exam: string;
  className: string;
  year?: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
};

const EXAMS = [
  { value: "jamb", label: "JAMB" },
  { value: "waec", label: "WAEC" },
  { value: "neco", label: "NECO" },
  { value: "gce", label: "GCE" },
];

// Years for selection (2010 through 2025)
const YEARS = Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2010 + i).map(
  (y) => ({ value: String(y), label: String(y) }),
);

// Generate classes for each exam/year so selecting an exam populates the class select
const CLASSES: Record<string, { value: string; label: string }[]> =
  EXAMS.reduce(
    (acc, exam) => {
      acc[exam.value] = YEARS.map((y) => ({
        value: `${exam.value}-${y.value}`,
        label:
          exam.value === "jamb"
            ? `${exam.label} - ${y.value}`
            : `${exam.label} - ${y.value}`,
      }));
      return acc;
    },
    {} as Record<string, { value: string; label: string }[]>,
  );

const Signup: React.FC<AuthFormStepsProps> = ({ gotoAuthFormPage }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    mobile: "",
    exam: "",
    className: "",
    year: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: string) => {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep1 = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.mobile.trim()) next.mobile = "Mobile number is required";
    if (!form.exam) next.exam = "Please select a exam";
    if (!form.className) next.className = "Please select a class";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.password || form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Password Not Match!";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleBackToLogin = () => gotoAuthFormPage("login");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      // TODO: submit to API
      await new Promise((res) => setTimeout(res, 700));
      gotoAuthFormPage("login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="signup-form flex flex-col gap-5 justify-start items-start animate-fade-up w-full max-w-md p-6 bg-white rounded-lg shadow no-scrollbar"
        style={{
          maxHeight: "calc(100vh - 80px)", // allow internal scrolling when content taller than viewport
          overflowY: "auto",
        }}
      >
        {/* show logo + header only on step 1 */}
        {step === 1 && (
          <>
            {/* large logo block (keep logo) */}
            <div className="w-full flex mb-4">
              <div className="w-56 h-32 relative">
                <Image
                  src="/body-pix/logo.png"
                  alt="Leaders Tutors"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>

            {/* title */}
            <div className="mb-0 w-full">
              <h1 className="text-2xl font-semibold">Sign-Up</h1>
              <p className="text-sm text-gray-500">
                Welcome 👋, Unlock endless learning and access wide range of
                topics.
              </p>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <TextInput
              id="fullName"
              label="FULLNAME"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
              message={errors.fullName}
              messageType={errors.fullName ? "error" : "info"}
              className="bg-slate-50 text-base font-normal"
            />

            <TextInput
              id="email"
              label="EMAIL ADDRESS"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              message={errors.email}
              messageType={errors.email ? "error" : "info"}
              className="bg-slate-50 text-base font-normal"
            />

            <TextInput
              id="mobile"
              label="MOBILE NUMBER"
              value={form.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              required
              message={errors.mobile}
              messageType={errors.mobile ? "error" : "info"}
              className="bg-slate-50 text-base font-normal"
            />

            {/* exam + class added to step 1 */}
            <div className="flex flex-col w-full">
              <label
                htmlFor="exam"
                className="mb-2 text-xs font-medium text-gray-700"
              >
                SELECT EXTERNAL EXAM <span className="text-red-500">*</span>
              </label>
              <select
                id="exam"
                aria-required="true"
                value={form.exam}
                onChange={(e) => {
                  update("exam", e.target.value);
                  update("className", "");
                }}
                className="p-3 rounded-md border border-gray-200 bg-white"
              >
                <option value="">Select Exam</option>
                {EXAMS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              {errors.exam && (
                <p className="mt-1 text-xs text-red-600">{errors.exam}</p>
              )}
            </div>

            {/* year select */}
            {/* <div className="flex flex-col w-full">
              <label htmlFor="year" className="mb-2 text-xs font-medium text-gray-700">
                SELECT YEAR <span className="text-red-500">*</span>
              </label>
              <select
                id="year"
                aria-required="true"
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                className="p-3 rounded-md border border-gray-200 bg-white"
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
              {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
            </div> */}

            <div className="flex flex-col w-full">
              <label
                htmlFor="className"
                className="mb-2 text-xs font-medium text-gray-700"
              >
                SELECT YEAR <span className="text-red-500">*</span>
              </label>
              <select
                id="className"
                aria-required="true"
                value={form.className}
                onChange={(e) => update("className", e.target.value)}
                className="p-3 rounded-md border border-gray-200 bg-white"
              >
                <option value="">Select year</option>
                {(CLASSES[form.exam] ?? []).map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.className && (
                <p className="mt-1 text-xs text-red-600">{errors.className}</p>
              )}
            </div>

            <div className="w-full flex justify-end items-center mt-2">
              {/* <button type="button" onClick={handleBackToLogin} className="text-sm text-blue-500 hover:underline">
                Back to Login
              </button> */}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-md text-white bg-gradient-to-r from-[#3b2f8b] via-[#6b3aa0] to-[#f59e0b] shadow-lg hover:opacity-95"
              >
                NEXT →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* summary green box */}
            <div className="w-full p-4 rounded border border-green-100 bg-green-50 text-sm text-green-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-700">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 12a4 4 0 110-8 4 4 0 010 8z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">{form.fullName || "Fullname"}</div>
                <div className="text-xs text-green-800">
                  {form.email || "email@example.com"}
                </div>
              </div>
            </div>

            {/* password fields */}
            <div className="w-full">
              <label className="mb-2 text-xs font-medium text-gray-700">
                CREATE PASSWORD: <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="NEW PASSWORD"
                  className={`w-full p-3 rounded border ${errors.password ? "border-red-400" : "border-gray-200"} bg-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-3 text-gray-500"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 text-xs font-medium text-gray-700">
                CONFIRMED PASSWORD: <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="CONFIRM PASSWORD"
                  className={`w-full p-3 rounded border ${errors.confirmPassword ? "border-red-400" : "border-gray-200"} bg-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-3 text-gray-500"
                  aria-label="toggle confirm password visibility"
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 text-xs font-medium text-gray-700">
                REFERRAL–CODE (Optional)
              </label>
              <input
                id="referral"
                value={form.referralCode}
                onChange={(e) => update("referralCode", e.target.value)}
                placeholder="ENTER YOUR REFERRAL-CODE"
                className="w-full p-3 rounded border border-gray-200 bg-white"
              />
            </div>

            <div className="w-full p-3 rounded border border-orange-200 bg-orange-50 text-sm text-orange-700">
              <strong>Note:</strong> You will make payment of{" "}
              <span className="font-semibold">₦1000.00</span> to complete your
              registration
            </div>

            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded border border-gray-300 bg-gray-100"
              >
                ← Go Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-md text-white bg-gradient-to-r from-[#3b2f8b] via-[#6b3aa0] to-[#f59e0b] shadow-lg hover:opacity-95 disabled:opacity-60"
              >
                <span>{loading ? "Processing..." : "PROCEED"}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* persistent footer: login CTA + privacy/terms - visible on all steps */}
        <div className="w-full mt-4">
          {/* <Button
            text="Login"
            frontIcon={<ArrowRight />}
            fullWidth
            onClick={() => gotoAuthFormPage("login")}
            className="mb-4"
          /> */}

          <div className="flex flex-col gap-4 items-center justify-center w-full pt-4 border-t border-gray-300">
            <p className="text-sm text-(--text-color)">
              Already have an account?{" "}
              <span
                className="text-(--primary-color) font-medium-custom cursor-pointer hover:underline"
                onClick={() => gotoAuthFormPage("login")}
              >
                Login Here
              </span>
            </p>
            {/* <p className="text-sm text-(--text-color) text-center">
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
            </p> */}
          </div>
        </div>
      </form>
    </>
  );
};

export default Signup;
