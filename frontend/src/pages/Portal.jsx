import { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import API from "../api.js";
import { EIGHTH_WALL_BASE_URL } from '../config.js';

export default function Portal() {
  const [me, setMe] = useState(null);
  const [url, setUrl] = useState("");
  const [justGenerated, setJustGenerated] = useState(false);

  useEffect(() => {
    let mounted = true;
    API.getMe().then((res) => {
      if (!mounted) return;
      setMe(res);
    }).catch(()=>{});
    return () => { mounted = false; };
  }, []);

  const deepLink = useMemo(() => {
    if (!me?.experienceId) return "";
    // Shared main experience with unique code:
    return `${EIGHTH_WALL_BASE_URL}/?userId=USER${me.experienceId}`;
  }, [me]);

  function generate() {
    // in future, you might POST to backend to confirm readiness
    setUrl(deepLink);
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 1500);
  }

  function copyLink() {
    if (!url) return;
    navigator.clipboard.writeText(url).catch(()=>{});
  }

  const qrSrc = url
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=240x240`
    : "";

  return (
    <>
      <NavBar />
      <main className="container">
        <div className="page portal-layout">
          <div className="options-container">
            <div className="option-card" onClick={()=>window.history.back()}>
              <div className="option-card-header"><div className="option-card-icon"></div><h3 className="option-card-title">Back</h3></div>
              <p className="option-card-description">Return to previous step</p>
            </div>
            <div className="option-card selected">
              <div className="option-card-header"><div className="option-card-icon"></div><h3 className="option-card-title">Step 3 — Business Card</h3></div>
              <p className="option-card-description">Generate your 8th Wall URL & QR code</p>
            </div>
          </div>

          <div className="content-area">
            <div className="content-area-header">
              <div className="icon-circle"></div>
              <h2 className="content-area-title">AI Business Card Portal</h2>
            </div>

            <div className="content-area-body">
              <div className="content-description">
                <p className="muted">
                  When you generate your 8th Wall URL, the experience will prompt for your
                  Unique ID inside the app. Enter <strong>USER{me?.experienceId}</strong> to load your RPM avatar and Convai character.
                </p>
              </div>

              <div className="glass" style={{padding:16, maxWidth:640}}>
                <h3>Saved data</h3>
                <ul style={{marginTop:8, lineHeight:1.6}}>
                  <li><strong>RPM URL:</strong> {me?.rpmAvatarUrl || <em>not saved</em>}</li>
                  <li><strong>Convai ID:</strong> {me?.convaiId || <em>not saved</em>}</li>
                  <li><strong>Unique Code:</strong> {me?.experienceId || "—"}</li>
                </ul>
              </div>

              <button className="btn btn-primary" onClick={generate}>
                Generate 8th Wall URL
              </button>

              {url && (
                <>
                  <div className="public-link-box" style={{maxWidth:780}}>
                    <strong>8th Wall URL:</strong> {url}
                  </div>
                  <div style={{display:"flex", gap:12}}>
                    <button className="btn btn-secondary" onClick={copyLink}>Copy Link</button>
                    <a className="btn btn-outline" href={url} target="_blank" rel="noreferrer">Open</a>
                  </div>

                  <div id="qr-container">
                    <img src={qrSrc} alt="QR Code" width="240" height="240" style={{borderRadius:12}}/>
                    <div className="muted" style={{marginTop:8, fontSize:12}}>Scan to open your experience</div>
                  </div>
                </>
              )}

              {justGenerated && <div className="toast show">Link generated</div>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
