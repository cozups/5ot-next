import { Review } from '@/types/products';
import { Star } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { deleteReview } from '@/actions/reviews';
import DeleteButton from '../delete-button';
import UpdateReviewDialog from './update-review-dialog';

export default async function ReviewItem({ review }: { review: Review }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAllowed =
    user?.user_metadata.role === 'admin' || user?.id === review.user_id;

  return (
    <li className="bg-gray-100 rounded-xl p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <p className="font-semibold">{review.profiles?.name}</p>
          <div className="flex items-center gap-1">
            <Star fill="orange" className="w-4 h-4" />
            {review.star}
          </div>
        </div>
        {isAllowed && (
          <div className="flex gap-1">
            {user?.id === review.user_id && (
              <UpdateReviewDialog review={review} />
            )}
            <DeleteButton action={deleteReview.bind(null, review.id)} />
          </div>
        )}
      </div>
      <div className="mt-2">{review.content}</div>
    </li>
  );
}
