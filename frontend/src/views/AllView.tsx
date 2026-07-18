//@ts-nocheck
import { useEffect, useState } from "react";
import { fetchTexts } from "../services/api";

export default function View() {
  const [all, setAll] = useState([]);

  useEffect(() => {
    fetchTexts(1000)
      .then((d) => setAll(d))
      .catch();
  }, []);

  // return <>{JSON.stringify(all)}</>;
  return (
    <>
      {
        <table>
          <tr>
            <th>id</th> <th>text</th> <th>date_utc</th>{" "}
          </tr>
          {all.map((m) => {
            return (
              <tr>
                <td>{m.id}</td>
                <td>{m.text}</td>
                <td>{m.timestamp}</td>
              </tr>
            );
          })}
        </table>
      }
    </>
  );
}
