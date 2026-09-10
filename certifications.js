/* ============================================================
   certifications.js
   Holds all certification data and renders certification cards.
   ============================================================ */

const CERTIFICATIONS = [
  {
    name: "Java (Basic)",
    type: "Certification",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/40dab5657bbe"
  },
  {
    name: "SQL (Advanced)",
    type: "Certification",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/43df00e2ad4d"
  },
  {
    name: "JavaScript (Basic)",
    type: "Certification",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/01bf38e3a8b0"
  },
  {
    name: "CSS (Basics)",
    type: "Certification",
    issuer: "HackerRank",
    url: "https://www.hackerrank.com/certificates/81989dab93fb"
  }
];

function renderCertifications() {
  const grid = document.getElementById("certGrid");
  if (!grid) return;

  grid.innerHTML = CERTIFICATIONS.map(
    (cert) => `
    <div class="cert-card reveal">
      <p class="cert-issuer">${cert.issuer}</p>
      <h3 class="cert-name">${cert.name}</h3>
      <p class="cert-type">${cert.type}</p>
      <a href="${cert.url}" class="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">View Certificate</a>
    </div>
  `
  ).join("");

  if (window.observeReveals) window.observeReveals();
}
