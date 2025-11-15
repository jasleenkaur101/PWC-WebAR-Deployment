import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.js";
import Navbar from "../components/Navbar.jsx";
import { QRCodeCanvas } from "qrcode.react";
import "../legacy-styles/business-portal.css";
import { EIGHTH_WALL_BASE_URL } from '../config.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [convaiId, setConvaiId] = useState("");
  const [rpmAvatarUrl, setRpmAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await API.getMe();
        setUser(me);
        setConvaiId(me.convaiId || "");
        setRpmAvatarUrl(me.rpmAvatarUrl || "");
        setLoading(false);
      } catch {
        navigate("/login");
      }
    })();
  }, [navigate]);

  if (loading) return null;

  const experienceId = user?.experienceId || "—";
  const publicLink = `${EIGHTH_WALL_BASE_URL}/?userId=USER${experienceId}`;

  async function saveProfile() {
    setMsg("");
    if (!convaiId.trim()) {
      setMsg("Please enter your Convai Agent ID.");
      return;
    }
    if (!/^https?:\/\/.+\.glb(\?.*)?$/i.test(rpmAvatarUrl.trim())) {
      setMsg("Please enter a valid .glb URL for your avatar.");
      return;
    }
    setSaving(true);
    try {
      const updated = await API.updateMe({
        convaiId: convaiId.trim(),
        rpmAvatarUrl: rpmAvatarUrl.trim(),
      });
      setUser(updated);
      setMsg("✅ Saved successfully.");
    } catch {
      setMsg("❌ Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-root">
      <Navbar />
      <main className="container">
        <div className="page">
          <div className="identity-strip">
            <div>
              <div className="identity-label">Email</div>
              <div className="identity-value">{user.email}</div>
            </div>
            <div>
              <div className="identity-label">Experience ID</div>
              <div className="identity-value">{experienceId}</div>
            </div>
          </div>

          <div className="portal-layout">
            {/* left column */}
            <div className="options-container">
              {/* RPM URL */}
              <div className="option-card">
                <div className="option-card-header">
                  <div className="option-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L10 5"/>
                      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L14 19"/>
                    </svg>
                  </div>
                  <h3 className="option-card-title">Avatar (.glb) URL</h3>
                </div>
                <p className="option-card-description">Paste a hosted .glb link (from RPM or elsewhere)</p>
                <input
                  className="portal-input"
                  type="url"
                  placeholder="https://example.com/model.glb"
                  value={rpmAvatarUrl}
                  onChange={(e) => setRpmAvatarUrl(e.target.value)}
                />
                <div style={{ marginTop: 8 }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      window.open(
                        "https://demo.readyplayer.me/avatar?id=690c3a5ed9d72e80a57a641e",
                        "_blank"
                      )
                    }
                  >
                    Open Ready Player Me
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ marginLeft: 8 }}
                    onClick={() => navigate("/avatars")}
                  >
                    Go to Avatar Page →
                  </button>
                </div>
              </div>

              {/* Convai */}
              <div className="option-card">
                <div className="option-card-header">
                  <div className="option-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <h3 className="option-card-title">Convai Agent ID</h3>
                </div>
                <p className="option-card-description">Enter the Convai Bot/Agent ID</p>
                <input
                  className="portal-input"
                  type="text"
                  placeholder="bot_abc123"
                  value={convaiId}
                  onChange={(e) => setConvaiId(e.target.value)}
                />
                <div style={{ marginTop: 8 }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => window.open("https://www.convai.com/", "_blank")}
                  >
                    Open Convai
                  </button>
                </div>
              </div>

              <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
                {saving ? "Saving…" : "Save details"}
              </button>
              {msg && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: msg.startsWith("✅") ? "#22c55e" : "#f87171",
                  }}
                >
                  {msg}
                </div>
              )}
            </div>

            {/* right column */}
            <div className="content-area">
              <div className="panel rpm-panel">
                <h3>Your 8th Wall Experience</h3>
                <p>Use your personalized link or scan the QR.</p>
                <div className="public-link-box" style={{ marginTop: 10 }}>
                  <code>{publicLink}</code>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <button className="btn btn-primary" onClick={() => window.open(publicLink, "_blank")}>
                    Open Your Experience
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(publicLink)}
                  >
                    Copy Link
                  </button>
                  <button className="btn btn-ghost" onClick={() => navigate("/preview")}>
                    Preview Page →
                  </button>
                </div>

                <div style={{ marginTop: 20 }}>
                  <h4>QR code</h4>
                  <QRCodeCanvas value={publicLink} size={160} includeMargin />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="to-top btn btn-ghost btn-pill"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </main>
    </div>
  );
}
