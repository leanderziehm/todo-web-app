//@ts-nocheck
import { useEffect, useState } from "react";
import { fetchTexts } from "../services/api";

export default function GroupedListsView() {
  const [all, setAll] = useState([]);
  const [typeFilter, setTypeFilter] = useState(""); // selected type
  const [search, setSearch] = useState(""); // search text
  const [collapsed, setCollapsed] = useState({}); // track collapsed state per type

  useEffect(() => {
    fetchTexts(1000)
      .then((data) => setAll(data))
      .catch((err) => console.error(err));
  }, []);

  // Build grouped items by type
  const grouped = all.reduce((acc, item) => {
    const match = item.text.match(/^(\w+)(\(.+\))?:/);
    const type = match ? match[1] : "General";

    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  const typeNames = Object.keys(grouped).sort();

  // Filter types and items
  const filteredGrouped = typeNames.reduce((acc, type) => {
    let items = grouped[type];

    if (typeFilter && type !== typeFilter) return acc; // skip non-selected type

    if (search) {
      items = items.filter((item) =>
        item.text.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (items.length) acc[type] = items;
    return acc;
  }, {});

  // Toggle collapse state
  const toggleCollapse = (type) => {
    setCollapsed((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Filter Commits</h2>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Search text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          {typeNames.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(filteredGrouped).map(([type, items]) => (
        <div key={type} style={{ marginBottom: "1.5rem" }}>
          {/* Header clickable to toggle collapse */}
          <h3
            onClick={() => toggleCollapse(type)}
            style={{
              cursor: "pointer",
              userSelect: "none",
              background: "#f0f0f0",
              padding: "0.3rem 0.5rem",
              borderRadius: "4px",
            }}
          >
            {collapsed[type] ? "▶ " : "▼ "} {type} ({items.length})
          </h3>

          {/* Table only visible if not collapsed */}
          {!collapsed[type] && (
            <table border="1" cellPadding="5" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>id</th>
                  <th>text</th>
                  <th>date_utc</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.text}</td>
                    <td>{m.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
