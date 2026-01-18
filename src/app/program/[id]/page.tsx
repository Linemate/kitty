// /app/program/[id]/page.tsx (서버 컴포넌트)
import { getProgramDetails } from 'api';
import PageContent from './_PageContent';
import { programProps } from 'types/types';

const ProgramPage = async ({ params }: { params: { id: string } }) => {
  let program: programProps | null = null;
  let error: string | null = null;

  try {
    const res = await getProgramDetails(params.id);
    program = res.data;
  } catch (err) {
    console.error('프로그램 상세 데이터 로드 실패:', err);
    error = '프로그램 정보를 불러올 수 없습니다.';
  }

  return <PageContent initialProgram={program} programId={params.id} error={error} />;
};

export default ProgramPage;