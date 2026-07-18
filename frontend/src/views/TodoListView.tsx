import { useEffect, useState } from "react";
import { fetchTexts, insertText } from "../services/api";

export default function TodoList() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [texts, setTexts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAndLoadTexts();
  }, []);

  async function fetchAndLoadTexts() {
    setLoading(true);
    try {
      const result = await fetchTexts();

      // Remove any pending items that have the same text as confirmed items
      setTexts((prev) => {
        const pending = prev.filter((t) => t.pending);
        const confirmedTexts = result.map((t) => t.text);

        // Keep only pending items that are not yet confirmed
        const unresolvedPending = pending.filter(
          (t) => !confirmedTexts.includes(t.text),
        );

        return [...unresolvedPending, ...result];
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticItem = { id: tempId, text: trimmed, pending: true };

    // Show optimistic item immediately
    setTexts((prev) => [optimisticItem, ...prev]);
    setInputValue("");

    try {
      await insertText(trimmed);
      await fetchAndLoadTexts();
    } catch (err) {
      // Remove optimistic item if insert fails
      setTexts((prev) => prev.filter((t) => t.id !== tempId));
      setError(err.message);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "50px", marginBottom: "50px" }}
      >
        <input
          autoFocus
          style={{ width: "600px", height: "2rem" }}
          name="inputText"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <ul>
        {texts.map((t) => (
          <li
            key={t.id}
            style={{
              opacity: t.pending ? 0.5 : 1,
              transition: "opacity 0.3s ease",
              marginBottom: "5px",
            }}
          >
            {t.text}
          </li>
        ))}
      </ul>
    </>
  );
}
