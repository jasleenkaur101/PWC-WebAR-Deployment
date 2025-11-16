import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar.jsx";
import API from "../api.js";

export default function Avatars() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    API.getMe().then((res) => {
      if (!mounted) return;
      setMe(res);
      setUrl(res?.rpmAvatarUrl || "");
    }).catch(()=>{});
    return () => { mounted = false; };
  }, []);

  function openRpm() {
    window.open("https://demo.readyplayer.me/avatar", "_blank", "width=960,height=700");
  }

function isValidGlb(u) {
  try {
    const url = new URL(u);
    // must end with .glb (query allowed)
    return /\.glb(\?.*)?$/i.test(url.pathname + url.search);
  } catch {
    return false;
  }
}

  async function save() {
    setMsg("");
    if (!isValidGlb(url)) { setMsg("Please paste a valid .glb URL."); return; }
    setSaving(true);
    try {
      await API.updateProfile({ rpmAvatarUrl: url.trim() });
      setMsg("✅ Avatar URL saved.");
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
          {/* Left: options / steps */}
          <div className="options-container">
            <div className="option-card selected">
              <div className="option-card-header">
                <div className="option-card-icon"></div>
                <h3 className="option-card-title">Step 1 — Avatar (RPM)</h3>
              </div>
              <p className="option-card-description">Open RPM, export .glb, paste URL and save.</p>
            </div>
            <div className="option-card" onClick={()=>navigate("/convai")}>
              <div className="option-card-header">
                <div className="option-card-icon"></div>
                <h3 className="option-card-title">Step 2 — Convai</h3>
              </div>
              <p className="option-card-description">Enter your Convai Character ID.</p>
            </div>
            <div className="option-card" onClick={()=>navigate("/portal")}>
              <div className="option-card-header">
                <div className="option-card-icon"></div>
                <h3 className="option-card-title">Step 3 — Business Card</h3>
              </div>
              <p className="option-card-description">Generate your 8th Wall link & QR.</p>
            </div>
          </div>

          {/* Right: content */}
          <div className="content-area">
            <div className="content-area-header">
              <div className="icon-circle"></div>
              <h2 className="content-area-title">Create with Ready Player Me</h2>
            </div>

            <div className="content-area-body">
              <div className="content-description">
                <p className="muted">
                  Click below to open Ready Player Me in a new tab and create your avatar. Export a <code>.glb</code> model and paste the hosted URL.
                </p>
              </div>

              <button className="btn btn-primary btn-icon" onClick={openRpm}>
                <span>Open RPM Creator</span>
              </button>

              <div className="input-container" style={{maxWidth:560}}>
                <label className="form-label">Paste avatar URL (.glb)</label>
                <input
                  className="portal-input"
                  type="url"
                  placeholder="https://example.com/model.glb"
                  value={url}
                  onChange={(e)=> setUrl(e.target.value)}
                />
                {msg && <div className={`alert ${/✅/.test(msg)?'alert-success':'alert-error'}`}>{msg}</div>}

                 <div className="action-row">
                  <button
                  type="button"
                  className="btn btn-primary btn-wide"
                  disabled={saving}
                  onClick={save}
                 >
                  {saving ? "Saving…" : "Save Avatar URL"}
                 </button>
                 <button
                 type="button"
                 className="btn btn-primary btn-wide"
                 onClick={() => navigate("/convai")}
                 >
                  Continue to Convai
                 </button>
                 </div>

              </div>

              {me?.rpmAvatarUrl && (
                <div className="public-link-box" style={{marginTop:18}}>
                  <strong>Saved:</strong> {me.rpmAvatarUrl}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
