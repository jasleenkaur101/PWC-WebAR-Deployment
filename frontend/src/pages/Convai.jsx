import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar.jsx";
import API from "../api.js";

export default function Convai() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [convaiId, setConvaiId] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    API.getMe().then((res) => {
      if (!mounted) return;
      setMe(res);
      setConvaiId(res?.convaiId || "");
    }).catch(()=>{});
    return () => { mounted = false; };
  }, []);

  function openConvai() {
    window.open("https://www.convai.com/pipeline/dashboard", "_blank", "width=1200,height=800");
  }

  async function save() {
    setMsg("");
    if (!convaiId.trim()) { setMsg("Please enter your Convai Character ID."); return; }
    setSaving(true);
    try {
      await API.updateProfile({ convaiId: convaiId.trim() });
      setMsg("✅ Convai Character ID saved.");
    } catch (e) {
      setMsg("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <NavBar />
      <main className="container">
        <div className="page portal-layout">
          <div className="options-container">
            <div className="option-card" onClick={()=>navigate("/avatars")}>
              <div className="option-card-header"><div className="option-card-icon"></div><h3 className="option-card-title">Step 1 — Avatar (RPM)</h3></div>
              <p className="option-card-description">Open RPM, paste .glb URL & save.</p>
            </div>
            <div className="option-card selected">
              <div className="option-card-header"><div className="option-card-icon"></div><h3 className="option-card-title">Step 2 — Convai</h3></div>
              <p className="option-card-description">Enter your Convai Character ID.</p>
            </div>
            <div className="option-card" onClick={()=>navigate("/portal")}>
              <div className="option-card-header"><div className="option-card-icon"></div><h3 className="option-card-title">Step 3 — Business Card</h3></div>
              <p className="option-card-description">Generate your 8th Wall link & QR.</p>
            </div>
          </div>

          <div className="content-area">
            <div className="content-area-header">
              <div className="icon-circle"></div>
              <h2 className="content-area-title">Add your Convai Character</h2>
            </div>

            <div className="content-area-body">
              <div className="content-description">
                <p className="muted">Open Convai docs to find or create your character, then paste your Character ID below.</p>
              </div>

              <button className="btn btn-primary btn-icon" onClick={openConvai}>
                <span>Open Convai</span>
              </button>

              <div className="input-container" style={{maxWidth:560}}>
                <label className="form-label">Convai Character ID</label>
                <input
                  className="portal-input"
                  type="text"
                  placeholder="e.g. 1f2a3b4c-...."
                  value={convaiId}
                  onChange={(e)=> setConvaiId(e.target.value)}
                />

                {msg && <div className={`alert ${/✅/.test(msg)?'alert-success':'alert-error'}`}>{msg}</div>}

                <div style={{display:"flex", gap:12, marginTop:8}}>
                  <button className="btn btn-primary" disabled={saving} onClick={save}>
                    {saving ? "Saving…" : "Save ID"}
                  </button>
                  <button className="btn btn-primary" onClick={()=> navigate("/portal")}>
                    Continue to AI Business Card
                  </button>
                </div>
              </div>

              {me?.convaiId && (
                <div className="public-link-box" style={{marginTop:18}}>
                  <strong>Saved:</strong> {me.convaiId}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
