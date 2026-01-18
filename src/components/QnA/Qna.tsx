import QnaClient from './QnaClient';

const Qna = ({ 
  id, 
  isMy, 
  size 
}: { 
  id?: string
  isMy: boolean
  size: number 
}) => {
  return (
    <QnaClient
      id={id}
      isMy={isMy}
      size={size}
    />
  );
};

export default Qna;