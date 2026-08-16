import { Link } from "react-router-dom";
import { CalendarDays, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-slate-950">
            <CalendarDays size={21} />
          </span>
          <span className="text-xl">Medi<span className="text-emerald-400">Book</span></span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="/#how-it-works" className="text-sm text-slate-300 hover:text-white">How it works</a>
          <a href="/#services" className="text-sm text-slate-300 hover:text-white">Services</a>
          <a href="/#hospitals" className="text-sm text-slate-300 hover:text-white">Hospitals</a>
          <Link to="/patient/register" className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
            Find a Doctor
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 md:hidden" aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="/#how-it-works" onClick={() => setOpen(false)} className="text-slate-300">How it works</a>
            <a href="/#services" onClick={() => setOpen(false)} className="text-slate-300">Services</a>
            <a href="/#hospitals" onClick={() => setOpen(false)} className="text-slate-300">Hospitals</a>
            <Link to="/patient/register" onClick={() => setOpen(false)} className="rounded-xl bg-emerald-500 px-5 py-3 text-center font-semibold text-slate-950">
              Find a Doctor
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}