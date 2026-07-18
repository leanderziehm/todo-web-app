//@ts-nocheck
import { useEffect, useState } from "react";
import { fetchTexts } from "../services/api";

export default function FilterView() {
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState(""); // selected type
  const [search, setSearch] = useState(""); // search text

  useEffect(() => {
    fetchTexts(1000)
      .then((data) => setAll(data))
      .catch((err) => console.error(err));
  }, []);

  // // Extract types dynamically
  // const types = Array.from(
  //   new Set(
  //     all
  //       .map((item) => {
  //         const match = item.text.match(/^(\w+)(\(.+\))?:/);
  //         return match ? match[1] : null;
  //       })
  //       .filter(Boolean)
  //   )
  // );

  // Build counts per type
  const typeCounts = all.reduce((acc, item) => {
    const match = item.text.match(/^(\w+)(\(.+\))?:/);
    if (!match) return acc;

    const type = match[1];
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Sort descending by count and format as "type (count)"
  const types = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `${type} (${count})`);

  // Filter whenever typeFilter or search changes
  useEffect(() => {
    let temp = [...all];

    if (typeFilter) {
      temp = temp.filter((item) => {
        const match = item.text.match(/^(\w+)(\(.+\))?:/);
        return match && match[1] === typeFilter;
      });
    }

    if (search) {
      temp = temp.filter((item) =>
        item.text.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFiltered(temp);
  }, [all, typeFilter, search]);

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
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>id</th>
            <th>text</th>
            <th>date_utc</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.text}</td>
              <td>{m.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
