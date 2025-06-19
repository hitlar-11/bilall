import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{error ? error : "An unknown error occurred."}</p>
    </div>
  );
}