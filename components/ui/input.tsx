import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

function Input({
  className,
  error,
  ...props
}: InputPrimitive.Props & { error?: string }) {
  const invalid = Boolean(error) || props["aria-invalid"] === true;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <InputPrimitive
        data-slot="input"
        aria-invalid={invalid}
        className={cn(
          "box-border h-[39px] w-full rounded-[8px] border border-solid border-slate-300 bg-white px-3.5 py-2.5 text-body leading-none tracking-normal text-slate-900 opacity-100 outline-none placeholder:text-slate-400 placeholder:leading-none focus:h-[41px] focus:border-2 focus:border-indigo-600 focus:placeholder:text-slate-900 aria-invalid:border-error aria-invalid:focus:h-[39px] aria-invalid:focus:border aria-invalid:focus:border-error aria-invalid:placeholder:text-slate-400 disabled:border-slate-200 disabled:bg-slate-50 disabled:placeholder:text-slate-400",
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="text-[12px] font-normal leading-none tracking-normal text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Input };
