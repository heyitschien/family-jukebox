import { cn } from "@/lib/utils";

type GradientTextProps = {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "h2" | "h3";
};

/** Pink → lilac → ocean gradient text for taglines and accent words. */
export function GradientText({ children, className, as: Tag = "span" }: GradientTextProps) {
  return <Tag className={cn("text-cr-gradient", className)}>{children}</Tag>;
}
