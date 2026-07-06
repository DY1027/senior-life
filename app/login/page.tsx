"use client";
import { useState, useEffect } from "react";
import { getClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("error")) {
      // One-time check on mount — SSR has no access to window.location, so
      // this can't be a lazy useState initializer without a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("로그인 인증을 완료하지 못했습니다. 다시 시도해주세요.");
    }
  }, []);

  const getSupabaseOrSetError = () => {
    const client = getClient();
    if (!client) {
      setError("로그인 설정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      return null;
    }
    return client;
  };

  async function handleEmail() {
    const client = getSupabaseOrSetError();
    if (!client) return;
    setLoading(true);
    setError("");
    try {
      const { error: signInError } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (signInError) throw signInError;
      setSent(true);
    } catch {
      setError("이메일 로그인 링크를 보내지 못했습니다. 이메일 주소를 확인한 뒤 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const client = getSupabaseOrSetError();
    if (!client) return;
    setError("");
    const { error: signInError } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (signInError) setError("Google 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }

  async function handleKakao() {
    const client = getSupabaseOrSetError();
    if (!client) return;
    setError("");
    const { error: signInError } = await client.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (signInError) setError("카카오 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F7FF", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 400, boxShadow: "0 8px 32px rgba(27,111,200,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#1B6FC8,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="white"/></svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E", marginBottom: 6 }}>시니어 든든</h1>
          <p style={{ fontSize: 14, color: "#6B7280" }}>로그인 또는 무료 가입</p>
        </div>

        {/* 소셜 로그인 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <button onClick={handleKakao} style={{ height: 52, borderRadius: 12, border: "none", background: "#FEE500", color: "#191919", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919"><path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.68 5.07 4.2 6.48L5.1 21l4.68-2.34C10.44 18.84 11.22 18.9 12 18.9c5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/></svg>
            카카오로 계속하기
          </button>
          <button onClick={handleGoogle} style={{ height: 52, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", color: "#1A1A2E", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google로 계속하기
          </button>
        </div>

        {/* 구분선 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>또는 이메일로</span>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        </div>

        {/* 이메일 로그인 */}
        {error && (
          <p style={{ fontSize: 13, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
            {error}
          </p>
        )}
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px", background: "#F0FDF4", borderRadius: 12 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#059669" }}>✉️ 이메일을 확인하세요</p>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>{email}로 로그인 링크를 보냈습니다</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="이메일 주소"
              placeholder="이메일 주소 입력"
              style={{ height: 52, padding: "0 16px", borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" }}
            />
            <button onClick={handleEmail} disabled={!email || loading} style={{ height: 52, borderRadius: 12, border: "none", background: "#1B6FC8", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: (!email || loading) ? 0.6 : 1 }}>
              {loading ? "전송 중..." : "이메일 링크 받기"}
            </button>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 20 }}>
          가입하면{" "}
          <a href="/legal/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#6B7280", textDecoration: "underline" }}>
            이용약관
          </a>
          {" "}및{" "}
          <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#6B7280", textDecoration: "underline" }}>
            개인정보처리방침
          </a>
          에 동의하는 것으로 간주됩니다
        </p>
      </div>
    </div>
  );
}
