// components/StarRating.js
import { Star } from 'lucide-react';

const StarRating = () => {
  return (
    <div className="flex items-center gap-2 bg-blue-100 text-yellow-500 rounded-lg px-4 py-2 w-fit mt-4">
      <span className="text-sm text-blue-900">2000+ SOPs created</span>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} fill="gold" stroke="gold" />
        ))}
      </div>
    </div>
  );
};

export default StarRating;

