"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap select-none outline-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        ghost: "",
        destructive: "",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        size: "sm",
        class:
          "h-[28px] rounded-[8px] px-3 py-1.5 bg-indigo-600 text-white opacity-100 hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-indigo-600",
      },
      {
        variant: "primary",
        size: "md",
        class:
          "h-[37px] rounded-[8px] px-5 py-2.5 bg-indigo-600 text-white opacity-100 hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-indigo-600",
      },
      {
        variant: "primary",
        size: "lg",
        class:
          "h-[47px] rounded-[8px] px-7 py-3.5 bg-indigo-600 text-white opacity-100 hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-indigo-600",
      },
      {
        variant: "secondary",
        size: "sm",
        class:
          "box-border h-[31px] rounded-[8px] border-[1.5px] border-solid border-indigo-600 bg-white px-3 py-1.5 text-indigo-600 opacity-100 hover:bg-indigo-50 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-white",
      },
      {
        variant: "secondary",
        size: "md",
        class:
          "box-border h-[40px] rounded-[8px] border-[1.5px] border-solid border-indigo-600 bg-white px-5 py-2.5 text-indigo-600 opacity-100 hover:bg-indigo-50 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-white",
      },
      {
        variant: "secondary",
        size: "lg",
        class:
          "box-border h-[50px] rounded-[8px] border-[1.5px] border-solid border-indigo-600 bg-white px-7 py-3.5 text-indigo-600 opacity-100 hover:bg-indigo-50 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-white",
      },
      {
        variant: "ghost",
        size: "sm",
        class:
          "h-[28px] rounded-[8px] bg-transparent px-3 py-1.5 text-indigo-600 opacity-100 hover:bg-indigo-50 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-transparent",
      },
      {
        variant: "ghost",
        size: "md",
        class:
          "h-[37px] rounded-[8px] bg-transparent px-5 py-2.5 text-indigo-600 opacity-100 hover:bg-indigo-50 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-transparent",
      },
      {
        variant: "ghost",
        size: "lg",
        class:
          "h-[47px] rounded-[8px] bg-transparent px-7 py-3.5 text-indigo-600 opacity-100 hover:bg-indigo-50 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-transparent",
      },
      {
        variant: "destructive",
        size: "sm",
        class:
          "h-[28px] rounded-[8px] bg-error px-3 py-1.5 text-white opacity-100 hover:bg-error-hover disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-error",
      },
      {
        variant: "destructive",
        size: "md",
        class:
          "h-[37px] rounded-[8px] bg-error px-5 py-2.5 text-white opacity-100 hover:bg-error-hover disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-error",
      },
      {
        variant: "destructive",
        size: "lg",
        class:
          "h-[47px] rounded-[8px] bg-error px-7 py-3.5 text-white opacity-100 hover:bg-error-hover disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-error",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "sm",
  icon: Icon,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    icon?: LucideIcon;
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        Icon && "gap-2",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <span className="inline-flex size-4 shrink-0 items-center justify-center">
          <Icon aria-hidden className="size-4" />
        </span>
      ) : null}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
