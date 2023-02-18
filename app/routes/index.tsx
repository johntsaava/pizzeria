import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="container flex flex-grow flex-col gap-4 pt-4 pb-40">
      <Link to="/pizza/build">Build</Link>
    </main>
  );
}
