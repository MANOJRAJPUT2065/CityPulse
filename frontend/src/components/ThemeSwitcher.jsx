import { useEffect, useState } from "react";

const THEMES = [
  { id: "", label: "System" },
  { id: "minimal", label: "Minimal" },
  { id: "aurora", label: "Aurora" },
  { id: "sunset", label: "Sunset" },
  { id: "forest", label: "Forest" },
  { id: "neon", label: "Neon Noir" },
  { id: "contrast", label: "High Contrast" },
];

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (id) => {
    const root = document.documentElement;
    if (!id) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", id);
    }
  };

  const onChange = (e) => {
    const id = e.target.value;
    setTheme(id);
    localStorage.setItem("theme", id);
    applyTheme(id);
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-full card-surface">
      <span className="text-xs text-gray-500">Theme</span>
      <select
        value={theme}
        onChange={onChange}
        className="text-sm bg-transparent border border-gray-300 rounded px-2 py-1"
      >
        {THEMES.map((t) => (
          <option key={t.id || "system"} value={t.id}>{t.label}</option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSwitcher;


