self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === "POST" && url.pathname === "/share") {
    event.respondWith(handleShare(event));
  }
});

async function handleShare(event) {
  const formData = await event.request.formData();

  const payload_text = `stash(share): title=${formData.get(
    "title",
  )} text=${formData.get("text")} url=${formData.get("url")}`;

  const payload = {
    text: payload_text,
  };

  //stash-api.leanderziehm.com/docs
  // 1️⃣ Send to your API
  https: await fetch("https://stash-api.leanderziehm.com/texts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Return a simple page (or blank) so the PWA stays open
  return new Response(
    `<html><body><script>
      window.close(); // optionally try to close tab if it's a new window
    </script></body></html>`,
    { headers: { "Content-Type": "text/html" } },
  );

  // Return a blank response; nothing else happens
  //   return new Response(null, { status: 204 });
}

// if (!self.define) {
//   let e,
//     s = {};
//   const i = (i, n) => (
//     (i = new URL(i + ".js", n).href),
//     s[i] ||
//       new Promise((s) => {
//         if ("document" in self) {
//           const e = document.createElement("script");
//           (e.src = i), (e.onload = s), document.head.appendChild(e);
//         } else (e = i), importScripts(i), s();
//       }).then(() => {
//         let e = s[i];
//         if (!e) throw new Error(`Module ${i} didn’t register its module`);
//         return e;
//       })
//   );
//   self.define = (n, r) => {
//     const t =
//       e ||
//       ("document" in self ? document.currentScript.src : "") ||
//       location.href;
//     if (s[t]) return;
//     let o = {};
//     const c = (e) => i(e, t),
//       l = { module: { uri: t }, exports: o, require: c };
//     s[t] = Promise.all(n.map((e) => l[e] || c(e))).then((e) => (r(...e), o));
//   };
// }
// define(["./workbox-1ef09536"], function (e) {
//   "use strict";
//   self.addEventListener("message", (e) => {
//     e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
//   }),
//     e.precacheAndRoute(
//       [
//         { url: "registerSW.js", revision: "1872c500de691dce40960bb85481de07" },
//         { url: "index.html", revision: "1f5670e1c5724c1e9953870497845f76" },
//         { url: "assets/index-hykIgRas.css", revision: null },
//         { url: "assets/index-CmYYq86j.js", revision: null },
//         { url: "vite.svg", revision: "9e34ebd0217acf91967f82195cc0dd43" },
//         {
//           url: "manifest.webmanifest",
//           revision: "037e46eca4513241e26458d77fc4bc9c",
//         },
//       ],
//       {}
//     ),
//     e.cleanupOutdatedCaches(),
//     e.registerRoute(
//       new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))
//     );
// });
