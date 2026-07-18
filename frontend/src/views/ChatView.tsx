import { useEffect, useState } from "react";
import { fetchTexts, insertText } from "../services/api";

export default function TodoChat() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allTexts, setAllTexts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);

  useEffect(() => {
    loadTexts();
  }, []);

  async function loadTexts() {
    setLoading(true);

    try {
      const result = await fetchTexts(999999, 0);

      setAllTexts(result);

      const extractedTopics = [
        ...new Set(
          result
            .map((item) => {
              const index = item.text.indexOf(":");
              return index !== -1 ? item.text.substring(0, index) : null;
            })
            .filter(Boolean),
        ),
      ];

      setTopics(extractedTopics);

      if (!currentTopic && extractedTopics.length > 0) {
        setCurrentTopic(extractedTopics[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function createTopic() {
    const newTopic = `topic${Date.now()}`;

    setTopics((prev) => [...prev, newTopic]);
    setCurrentTopic(newTopic);
  }

  function getMessagesForTopic() {
    if (!currentTopic) return [];

    return allTexts
      .filter((item) => item.text.startsWith(`${currentTopic}:`))
      .map((item) => ({
        ...item,
        text: item.text.substring(currentTopic.length + 1),
      }))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmed = inputValue.trim();

    if (!trimmed || !currentTopic) return;

    const tempId = `temp-${Date.now()}`;

    const optimistic = {
      id: tempId,
      timestamp: new Date().toISOString(),
      text: trimmed,
      pending: true,
    };

    setAllTexts((prev) => [
      {
        ...optimistic,
        text: `${currentTopic}:${trimmed}`,
      },
      ...prev,
    ]);

    setInputValue("");

    try {
      await insertText(`${currentTopic}:${trimmed}`);

      await loadTexts();
    } catch (err) {
      setAllTexts((prev) => prev.filter((item) => item.id !== tempId));

      setError(err.message);
    }
  }

  const messages = getMessagesForTopic();

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      <aside
        style={{
          width: "200px",
          borderRight: "1px solid #ccc",
          paddingRight: "20px",
        }}
      >
        <button
          onClick={createTopic}
          style={{
            width: "100%",
            marginBottom: "20px",
            fontSize: "20px",
          }}
        >
          +
        </button>

        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setCurrentTopic(topic)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "5px",
              fontWeight: currentTopic === topic ? "bold" : "normal",
            }}
          >
            {topic}
          </button>
        ))}
      </aside>

      <main style={{ flex: 1 }}>
        <h3>{currentTopic ? currentTopic : "Create a topic"}</h3>

        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: "30px",
          }}
        >
          <input
            autoFocus
            disabled={!currentTopic}
            style={{
              width: "600px",
              height: "2rem",
            }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <button type="submit" disabled={!currentTopic}>
            Send
          </button>
        </form>

        {loading && <p>Loading...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {messages.map((msg) => (
            <li
              key={msg.id}
              style={{
                opacity: msg.pending ? 0.5 : 1,
                marginBottom: "15px",
              }}
            >
              <div>{msg.text}</div>

              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
