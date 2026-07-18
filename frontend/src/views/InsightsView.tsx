//@ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { fetchTexts } from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

function getRangeStart(preset: string): Date | null {
  const now = new Date();

  switch (preset) {
    case "7d":
      return new Date(now.setDate(now.getDate() - 7));
    case "4w":
      return new Date(now.setDate(now.getDate() - 28));
    case "6m":
      return new Date(now.setMonth(now.getMonth() - 6));
    case "mtd":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "qtd": {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      return new Date(now.getFullYear(), quarterStartMonth, 1);
    }
    case "ytd":
      return new Date(now.getFullYear(), 0, 1);
    case "all":
    default:
      return null;
  }
}

export default function InsightsView() {
  const [all, setAll] = useState([]);
  const [interval, setInterval] = useState("day"); // hour, day, week, month
  const [rangePreset, setRangePreset] = useState("all");
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchTexts(1000).then(setAll).catch(console.error);
  }, []);

  const filteredData = useMemo(() => {
    const start = getRangeStart(rangePreset);
    if (!start) return all;

    return all.filter((item) => new Date(item.timestamp) >= start);
  }, [all, rangePreset]);

  useEffect(() => {
    if (!filteredData.length) return;

    const counts: Record<string, number> = {};

    filteredData.forEach((item) => {
      const date = new Date(item.timestamp);
      let key: string;

      switch (interval) {
        case "hour":
          key = date.toISOString().slice(0, 13) + ":00";
          break;
        case "day":
          key = date.toISOString().slice(0, 10);
          break;
        case "week": {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().slice(0, 10);
          break;
        }
        case "month":
          key = date.toISOString().slice(0, 7);
          break;
        default:
          key = date.toISOString().slice(0, 10);
      }

      counts[key] = (counts[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(counts).sort();

    setChartData({
      labels: sortedKeys,
      datasets: [
        {
          label: "Texts Count",
          data: sortedKeys.map((k) => counts[k]),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    });
  }, [filteredData, interval]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Texts Insights</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label>Aggregate by:</label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        <div>
          <label>Time range:</label>
          <select
            value={rangePreset}
            onChange={(e) => setRangePreset(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="4w">Last 4 weeks</option>
            <option value="6m">Last 6 months</option>
            <option value="mtd">Month to date</option>
            <option value="qtd">Quarter to date</option>
            <option value="ytd">Year to date</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {chartData.labels?.length ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: {
                display: true,
                text: `New Texts per ${interval}`,
              },
            },
            scales: {
              x: {
                type: "time",
                time: { unit: interval },
                title: { display: true, text: "Time" },
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: "Count" },
              },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}
