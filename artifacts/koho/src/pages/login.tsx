import { useState } from "react";
import { Eye, EyeOff, Fingerprint } from "lucide-react";
import { useLocation } from "wouter";

interface LoginProps {
  onLogin?: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin?.();
      navigate("/");
    }, 900);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin();
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="flex-1 flex flex-col px-6 pt-16 pb-8">
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
            style={{ background: "#3B1F8C" }}
          >
            <span
              className="text-3xl font-black"
              style={{ color: "#C8F135", letterSpacing: "-1px" }}
            >
              K
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your KOHO account</p>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 pr-12 text-base font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full font-bold text-base text-white transition-all active:scale-95 disabled:opacity-70"
            style={{ background: loading ? "#7B4FFF99" : "#3B1F8C" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button
          onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin?.(); navigate("/"); }, 700); }}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-full border-2 border-gray-200 font-bold text-gray-800 text-base hover:bg-gray-50 transition-all active:scale-95"
        >
          <Fingerprint className="w-6 h-6 text-purple-600" />
          Sign in with Face ID
        </button>

        <div className="flex-1" />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/onboarding")}
              className="font-bold text-purple-600 hover:text-purple-800 transition-colors"
            >
              Get started
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => { onLogin?.(); navigate("/"); }}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Skip to app
          </button>
        </div>
      </div>
    </div>
  );
}
