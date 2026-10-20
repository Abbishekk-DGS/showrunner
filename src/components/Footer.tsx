import config from "../config/portfolio";
import { asset } from "../lib/util";
import { Social } from "./icons";

export default function Footer() {
  const { profile, footerLinks } = config;
  return (
    <footer className="mx-auto mt-16 max-w-[980px] px-[4%] pb-10 text-[13px] text-[#808080]">
      <ul className="flex gap-6 text-white">
        {profile.socials.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="transition hover:text-[#b3b3b3]">
              <Social label={s.label} className="h-6 w-6" />
            </a>
          </li>
        ))}
      </ul>
      <ul className="mt-4 grid grid-cols-2 gap-y-3 sm:grid-cols-4">
        {footerLinks.map((l) => (
          <li key={l.href + l.label}>
            <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="hover:underline">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`mailto:${profile.email}`} className="border border-[#808080] px-2 py-1.5 transition hover:text-white">
          {profile.email}
        </a>
        {profile.resume && (
          <a href={asset(profile.resume)} download className="border border-[#808080] px-2 py-1.5 transition hover:text-white">
            Download résumé
          </a>
        )}
      </div>
      <p className="mt-5 text-[11px]">
        © {new Date().getFullYear()} {profile.name}.{" "}
        <a href="https://github.com/Abbishekk-DGS/showrunner" target="_blank" rel="noreferrer" className="hover:underline">
          Made with Showrunner
        </a>
        , an open-source portfolio template. Not affiliated with any streaming service.
      </p>
    </footer>
  );
}
