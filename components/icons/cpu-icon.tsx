import { useId, type ComponentProps } from "react";

function CpuIcon({ className, ...props }: ComponentProps<"svg">) {
  const clipId = useId().replace(/:/g, "");

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
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M9 15.0011V16.5012M9 1.5V3.00012M12.7503 15.0011V16.5012M12.7503 1.5V3.00012M1.4994 9.0006H2.99952M1.4994 12.7509H2.99952M1.4994 5.2503H2.99952M15.0005 9.0006H16.5006M15.0005 12.7509H16.5006M15.0005 5.2503H16.5006M5.2497 15.0011V16.5012M5.2497 1.5V3.00012M4.49964 3.00012H13.5004C14.3289 3.00012 15.0005 3.67175 15.0005 4.50024V13.501C15.0005 14.3295 14.3289 15.0011 13.5004 15.0011H4.49964C3.67115 15.0011 2.99952 14.3295 2.99952 13.501V4.50024C2.99952 3.67175 3.67115 3.00012 4.49964 3.00012ZM6.74982 6.00036H11.2502C11.6644 6.00036 12.0002 6.33617 12.0002 6.75042V11.2508C12.0002 11.665 11.6644 12.0008 11.2502 12.0008H6.74982C6.33557 12.0008 5.99976 11.665 5.99976 11.2508V6.75042C5.99976 6.33617 6.33557 6.00036 6.74982 6.00036Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export { CpuIcon };
