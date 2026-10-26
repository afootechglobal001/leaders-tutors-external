"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextInput, type TextInputProps } from "./TextInput";

type PasswordInputProps = Omit<TextInputProps, "type">;

export const PasswordInput = (props: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextInput
      {...props}
      type={isVisible ? "text" : "password"}
      inputClassName="pr-14"
      endAdornment={
        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          title={isVisible ? "Hide password" : "Show password"}
          onClick={() => setIsVisible((visible) => !visible)}
          className="pointer-events-none absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 opacity-0 transition-all group-focus-within:pointer-events-auto group-focus-within:opacity-100 hover:bg-gray-100 hover:text-gray-800 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary-color)"
        >
          {isVisible ? (
            <EyeOff size={20} aria-hidden="true" />
          ) : (
            <Eye size={20} aria-hidden="true" />
          )}
        </button>
      }
    />
  );
};
