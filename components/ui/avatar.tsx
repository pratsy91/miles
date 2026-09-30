import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-400 font-semibold leading-none tracking-normal text-white",
  {
    variants: {
      size: {
        sm: "size-8 text-[12.16px]",
        md: "size-10 text-[15.2px]",
        lg: "size-14 text-[21.28px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

function Avatar({
  className,
  size = "md",
  src,
  alt,
  children,
  ...props
}: AvatarPrimitive.Root.Props &
  VariantProps<typeof avatarVariants> & {
    src?: string;
    alt?: string;
  }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, className }))}
      {...props}
    >
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="size-full object-cover"
        />
      ) : null}
      <AvatarPrimitive.Fallback>{children}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export { Avatar, avatarVariants };
