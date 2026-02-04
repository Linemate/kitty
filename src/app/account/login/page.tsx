import { redirect } from 'next/navigation';

export default async function Login(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const queryString = new URLSearchParams();

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        queryString.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => queryString.append(key, v));
      }
    });
  }

  const search = queryString.toString();
  const destination = search ? `/account/login/buddy?${search}` : '/account/login/buddy';

  redirect(destination);
}
