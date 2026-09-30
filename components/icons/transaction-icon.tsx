import type { ComponentProps } from "react";

function TransactionIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
      className={className}
    >
      <path
        d="M6.0003 8.25L3.0006 5.25L6.0003 2.25M3.0006 5.25H14.9994M11.9997 9.75L14.9994 12.75L11.9997 15.75M14.9994 12.75H3.0006"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { TransactionIcon };
