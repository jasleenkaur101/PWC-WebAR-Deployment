import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.js";
import NavBar from "../components/Navbar.jsx";

export default function Home() {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    API.getMe().then((res) => { if (mounted) setMe(res); }).catch(()=>{});
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <NavBar />
      <main className="container">
        <div className="page">
          <div className="glass section" style={{ textAlign:"center" }}>
            <h2 style={{ fontSize: 26, marginBottom: 6 }}>Welcome{me?.name ? `, ${me.name}` : ""}</h2>
            <p className="muted" style={{ marginTop: 0 }}>Your unique code (Experience ID):</p>

            <div style={{
              margin: "8px auto 16px",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: 2,
              padding: "12px 18px",
              borderRadius: 12,
              background: "rgba(255,255,255,.08)",
              border: "1px solid var(--stroke)",
              display: "inline-block"
            }}>
              {me?.experienceId || "••••••"}
            </div>

            <p className="muted" style={{ maxWidth: 560, margin: "0 auto 18px" }}>
              We’ll use this code inside your 8th Wall experience to fetch your Convai & Ready Player Me avatar.
            </p>

            <button className="btn btn-primary btn-lg" onClick={()=> navigate("/avatars")}>
              Get started
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
