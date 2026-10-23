"use client";

import { ReactNode } from "react";

interface ButtonProps {
  /**
   * Content of the button.
   */
  children: ReactNode;
  /**
   * Optional Tailwind classes to apply. These are appended after the default
   * styling defined below.
   */
  className?: string;
  /**
   * Name of the application – used only for a demo alert.
   */
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      // Default styling for a primary button.
      className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${className}`.trim()}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
