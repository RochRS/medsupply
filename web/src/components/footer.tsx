export function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-6 py-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-zinc-500 font-mono">
          © {new Date().getFullYear()} Your Name. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm text-zinc-400 font-mono">
          <a
            href="https://github.com"
            className="hover:text-blue-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            className="hover:text-blue-400 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:you@example.com"
            className="hover:text-blue-400 transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
