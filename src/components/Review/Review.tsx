// Review.tsx (서버 컴포넌트 - 초기 데이터 페칭 제거)
import ReviewClient from './ReviewClient';

const Review = ({ 
  id, 
  isMy, 
  size 
}: { 
  id?: number
  isMy: boolean
  size: number 
}) => {
  return (
    <ReviewClient
      id={id}
      isMy={isMy}
      size={size}
    />
  );
};

export default Review;