// /app/program/[id]/page.tsx (서버 컴포넌트)
import { getProgramDetailsServer } from 'api/server';
import PageContent from './_PageContent';
import { programProps } from 'types/types';

const ProgramPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  let program: programProps | null = null;
  let error: string | null = null;

  try {
    const data = await getProgramDetailsServer(id);
    program = data;
  } catch (err) {
    console.error('프로그램 상세 데이터 로드 실패:', err);
    error = '프로그램 정보를 불러올 수 없습니다.';
  }

  return <PageContent initialProgram={program} programId={id} error={error} />;
};

export default ProgramPage;