// /app/program/[id]/page.tsx (서버 컴포넌트)
import { getProgramDetailsServer, getProgramSchedulesServer } from 'api/server';
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
    const title = program?.title || 'LINEMATE';

    // 날짜 정보를 가져오기 위해 스케줄 조회
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const dateQuery = `${year}${month < 10 ? '0' + month : month}`;
    const schedules = await getProgramSchedulesServer(id, dateQuery);

    let dateStr = '';
    if (schedules && Array.isArray(schedules) && schedules.length > 0) {
      // 현재 시간 이후의 가장 빠른 스케줄 찾기
      const futureSchedules = schedules
        .filter((s: any) => new Date(s.reservationDate).getTime() > now.getTime())
        .sort((a, b) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime());

      if (futureSchedules.length > 0) {
        const firstSchedule = futureSchedules[0];
        // KST로 변환 (UTC+9)
        const targetDate = new Date(new Date(firstSchedule.reservationDate).getTime() + 9 * 60 * 60 * 1000);
        const m = targetDate.getUTCMonth() + 1;
        const d = targetDate.getUTCDate();
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const day = dayNames[targetDate.getUTCDay()];
        dateStr = `${m}월 ${d}일(${day})`;
      }
    }

    let description = program.station || '';
    if (dateStr) {
      // 장소 정보가 너무 길면 자르기 (공유하기 로직과 동일)
      let loc = program.station || '';
      if (loc.split(' ').length > 2) {
        loc = loc.split(' ').slice(0, 2).join(' ');
      }
      description = `${loc}, ${dateStr}`;
    } else {
      description = program.title || 'LINEMATE';
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.linemate.kr';
    const url = `${siteUrl.replace(/\/$/, '')}/program/${id}`;
    const image = program?.thumbnail || (program?.images && program.images.length > 0 ? program.images[0].url : '');

    return {
      title: `${title} | LINEMATE`,
      description,
      openGraph: {
        title: title,
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
    console.error("Failed to load program detail data:", err);
    error = "Cannot load program information.";
  }

  return <PageContent initialProgram={program} programId={id} error={error} />;
};

export default ProgramPage;