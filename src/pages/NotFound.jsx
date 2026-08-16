import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="text-emerald-400">404</p>
      <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
      <Link to="/" className="mt-8 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">Go home</Link>
    </section>
  );
}