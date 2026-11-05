import { useState, useEffect } from "react";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Aesthetic");
  const [image, setImage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("boinox_wallpapers");
    if (saved) setWallpapers(JSON.parse(saved));
  }, []);

  const save = (list: any[]) => {
    setWallpapers(list);
    localStorage.setItem("boinox_wallpapers", JSON.stringify(list));
  };

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#111", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ background: "#222", padding: 30, borderRadius: 16, width: 320 }}>
          <h1>Boinox Admin 🔐</h1>
          <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 12, marginTop: 15, borderRadius: 8, border: "none", boxSizing: "border-box" }} />
          <button onClick={() => password === "boinox123" ? setLoggedIn(true) : alert("Wrong password!")} style={{ width: "100%", padding: 12, marginTop: 12, background: "#ff0000", color: "#fff", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer" }}>
            Login
          </button>
          <p style={{ fontSize: 12, color: "#aaa", marginTop: 10 }}>Default password: boinox123</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, background: "#111", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1>Boinox Admin Panel ✨</h1>
      <p>{wallpapers.length} custom wallpapers</p>
      <a href="/" style={{ color: "#ff5555" }}>← Back to Website</a>

      <div style={{ background: "#222", padding: 20, borderRadius: 12, marginTop: 20, maxWidth: 500 }}>
        <h3>Add New Wallpaper</h3>
        <input placeholder="Title - e.g. Red Moon Ocean" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 10, borderRadius: 8, boxSizing: "border-box" }} />
        <input placeholder="Image Link - paste URL" value={image} onChange={(e) => setImage(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 10, borderRadius: 8, boxSizing: "border-box" }} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 10, borderRadius: 8 }}>
          <option>Aesthetic</option><option>Nature</option><option>Anime</option><option>Dark</option><option>Minimal</option>
        </select>
        <button onClick={() => {
          if (!title || !image) return alert("Add title + image link");
          save([...wallpapers, { id: Date.now(), title, category, image }]);
          setTitle(""); setImage(""); alert("Added!");
        }} style={{ padding: "12px 20px", marginTop: 12, background: "#ff0000", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>
          + Add Wallpaper
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 15, marginTop: 20 }}>
        {wallpapers.map((w) => (
          <div key={w.id} style={{ background: "#222", borderRadius: 12, overflow: "hidden" }}>
            <img src={w.image} style={{ width: "100%", height: 150, objectFit: "cover" }} />
            <div style={{ padding: 12 }}>
              <b>{w.title}</b><br /><small>{w.category}</small><br />
              <button onClick={() => save(wallpapers.filter(x => x.id !== w.id))} style={{ marginTop: 8, padding: "6px 12px", background: "#333", color: "#ff5555", border: "none", borderRadius: 6, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
