import { Star } from 'lucide-react';

export default function ReviewItem() {
  return (
    <li>
      <div className="flex items-center gap-4">
        <p className="font-semibold">작성자</p>
        <div className="flex items-center gap-2">
          <Star fill="orange" className="w-4 h-4" /> 5
        </div>
      </div>
      <div>리뷰 내용</div>
    </li>
  );
}
