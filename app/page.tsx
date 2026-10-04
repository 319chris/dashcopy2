import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <Link href="/sign-in">Sign in</Link>
    </main>
  );
}
