import { RatingStars } from "@/features/products/components/details/RatingStars";
import type { ProductReview } from "@/features/products/types";

const reviewDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function ProductReviews({ reviews }: { reviews: ProductReview[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">
        Reviews <span className="text-muted-foreground">({reviews.length})</span>
      </h2>
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <li
              key={`${review.reviewerName}-${index}`}
              className="flex flex-col gap-2 rounded-2xl p-4 ring-1 ring-foreground/10"
            >
              <div className="flex items-center justify-between gap-2">
                <RatingStars rating={review.rating} />
                <time dateTime={review.date} className="text-xs text-muted-foreground">
                  {reviewDateFormatter.format(new Date(review.date))}
                </time>
              </div>
              <p className="text-sm">{review.comment}</p>
              <p className="text-xs text-muted-foreground">{review.reviewerName}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
