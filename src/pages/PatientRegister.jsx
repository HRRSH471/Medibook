import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";

export default function PatientRegister() {
  return (
    <section className="mx-auto max-w-xl px-5 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <UserRound className="text-emerald-400" />
        <h1 className="mt-5 text-3xl font-bold">Patient registration</h1>
        <p className="mt-2 text-slate-400">Frontend placeholder. Registration API will be connected to Azure Functions.</p>
        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400" placeholder="Full name" />
          <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400" type="email" placeholder="Email" />
          <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400" type="password" placeholder="Password" />
          <button className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400">Create patient account</button>
        </form>
        <Link to="/" className="mt-5 block text-center text-sm text-slate-400 hover:text-white">Back to home</Link>
      </div>
    </section>
  );
}