// /app/program/[id]/page.tsx (서버 컴포넌트)
import { getProgramDetailsServer } from 'api/server';
import PageContent from './_PageContent';
import { Metadata } from 'next';
import { programProps } from 'types/types';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const program: programProps = await getProgramDetailsServer(id);
    const title = program?.title ? `${program.title} | LINEMATE` : 'LINEMATE';
    const description = program?.title || 'LINEMATE';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.linemate.kr';
    const url = `${siteUrl.replace(/\/$/, '')}/program/${id}`;
    const image = program?.thumbnail || (program?.images && program.images.length > 0 ? program.images[0].url : '');

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: image ? [{ url: image }] : undefined,
        type: 'website',
      },
    };
  } catch (err) {
    return {
      title: 'LINEMATE',
    };
  }
}

const ProgramPage = async ({ params }: Props) => {
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