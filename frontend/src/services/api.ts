const API_URL = window.APP_CONFIG?.API_URL || "http://localhost:4000"; //import.meta.env.VITE_API_URL ||
// console.log(API_URL);

export async function fetchTexts(per_page = 10, page = 0) {
  console.log(`fetchTexts per_page:${per_page}, page:${page} `);
  const response = await fetch(
    `${API_URL}/texts?per_page=${per_page}&page=${page}`,
  );
  if (!response.ok) throw new Error("fetch texts failed");
  console.log(response);
  return response.json();
}

export async function insertText(text: string) {
  console.log(`insertText text:${text}`);
  const response = await fetch(`${API_URL}/texts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) throw new Error("post fetch texts failed");
  console.log(response);
  return response.json();
}

// curl -X 'POST' \
//   'https://api.tracker.leanderziehm.com/insertText' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "text": "string"
// }'

// export async function depreciated_insertText_via_get(text:string) {
//   const response = await fetch(`${API_URL}/insertText/${text}`);
//   if (!response.ok) throw new Error("fetch texts failed");
//   return response.json();
// }
