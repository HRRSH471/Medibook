import { Link } from "react-router-dom";
import { CalendarDays, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2 font-bold">
            <CalendarDays className="text-emerald-400" />
            <span>Medi<span className="text-emerald-400">Book</span></span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-400">
            A modern healthcare appointment platform for patients, doctors and hospitals.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Platform</h3>
          <div className="space-y-2 text-sm text-slate-400">
            <Link className="block hover:text-white" to="/patient/register">Patient Registration</Link>
            <Link className="block hover:text-white" to="/doctor/register">Doctor Registration</Link>
            <a className="block hover:text-white" href="/#services">Services</a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Built with Azure</h3>
          <p className="text-sm leading-6 text-slate-400">
            React + Vite frontend, Azure Functions APIs, Cosmos DB and Azure Blob Storage.
          </p>
          <div className="mt-4 flex gap-3 text-slate-400">
            <Github size={18} /><Linkedin size={18} />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © 2026 MediBook. Portfolio project.
      </div>
    </footer>
  );
}