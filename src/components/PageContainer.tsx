import type { ComponentProps } from "react";
import { cn } from "cn";

/** The site's horizontal width and side padding, shared by the header and every page. */
export function PageContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[96rem] px-4 sm:px-6", className)}
      {...props}
    />
  );
}
