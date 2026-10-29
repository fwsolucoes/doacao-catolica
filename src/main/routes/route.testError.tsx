export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const status = Number(url.searchParams.get("status")) || 500;
  throw new Response("Test Error", { status });
}

export default function TestErrorRoute() {
  return null;
}
