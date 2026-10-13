import { StarIcon } from "lucide-react";
import { cn } from "cn";

const STAR_COUNT = 5;

/** Five stars filled to the nearest whole rating, with an accessible label. */
export function RatingStars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const filledStars = Math.round(rating);

  return (
    <span
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
      className={cn("flex items-center gap-0.5", className)}
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <StarIcon
          key={index}
          aria-hidden
          className={cn(
            "size-4",
            index < filledStars
              ? "fill-amber-500 text-amber-500"
              : "fill-muted text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}
