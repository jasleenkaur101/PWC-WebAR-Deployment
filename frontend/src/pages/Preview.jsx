import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.js";
import Navbar from "../components/Navbar.jsx";
import { QRCodeCanvas } from "qrcode.react";
import "../legacy-styles/business-portal.css";
import { EIGHTH_WALL_BASE_URL } from '../config.js';

export default function Preview() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await API.getMe();
        setUser(me);
      } catch {
        navigate("/login");
      }
    })();
  }, [navigate]);

  if (!user) return null;

  const experienceId = user.experienceId;
  const publicLink = `${EIGHTH_WALL_BASE_URL}/?userId=USER${experienceId}`;


  return (
    <div className="dashboard-root">
      <Navbar />
      <main className="container">
        <div className="page">
          <div className="portal-layout">
            {/* single panel layout */}
            <div className="content-area" style={{ width: "100%" }}>
              <div className="panel rpm-panel" style={{ maxWidth: 900, margin: "0 auto" }}>
                <h2>Your Experience Link</h2>
                <p>
                  Share or scan the QR to open your unique 8th Wall experience.
                  If you open the base page without <code>?userId</code>, it should ask:{" "}
                  <em>“Enter 8th wall experience ID”</em>.
                </p>

                <div className="public-link-box" style={{ marginTop: 10 }}>
                  <code>{publicLink}</code>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <button className="btn btn-primary" onClick={() => window.open(publicLink, "_blank")}>
                    Open 8th Wall
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(publicLink)}
                  >
                    Copy Link
                  </button>
                </div>

                <div style={{ marginTop: 20 }}>
                  <h4>QR code</h4>
                  <QRCodeCanvas value={publicLink} size={200} includeMargin />
                </div>

                <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
                  <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}>
                    ← Back to Dashboard
                  </button>
                  <button className="btn btn-ghost" onClick={() => navigate("/avatars")}>
                    Manage Avatars →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
