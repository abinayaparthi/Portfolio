/* ============================================================
   projects.js
   Holds all project data and renders project cards dynamically.
   ============================================================ */

const PROJECTS = [
  {
    id: "food-delivery",
    title: "Food Delivery Application",
    category: "Java / Spring Boot / Backend",
    filterGroup: "java-spring",
    tech: ["Java", "Spring Boot", "REST APIs", "Spring Security", "JWT", "MySQL", "JPA/Hibernate"],
    description: "Developed REST APIs for user, restaurant, menu, and order management using Spring Boot, CRUD operations, and MySQL.",
    features: [
      "User Management", "Restaurant Management", "Menu Management", "Order Management",
      "CRUD Operations", "REST APIs", "JWT Authentication", "Authorization",
      "Spring Security", "JPA/Hibernate", "MySQL", "Postman API Testing", "Debugging"
    ],
    architecture: ["Client", "REST APIs", "Spring Boot", "JPA/Hibernate", "MySQL"],
    stats: [],
    problem: "Restaurants need a reliable way to manage listings, menus, and incoming orders while keeping user accounts and access secure.",
    solution: "Built a layered Spring Boot backend exposing REST endpoints for users, restaurants, menus, and orders, with JWT-based authentication and Spring Security enforcing role-based access, backed by a MySQL database through JPA/Hibernate.",
    implementation: "Each domain (user, restaurant, menu, order) is modeled as a JPA entity with a dedicated repository, service, and REST controller layer. Endpoints were tested with Postman, and JWT tokens are issued on login and validated on protected routes via Spring Security filters.",
    github: "https://github.com/abinayaparthi/FoodDeliveryApplication"
  },
  {
    id: "root2product",
    title: "Root2Product \u2013 Organic Value-Added Products Website",
    category: "Frontend Development",
    filterGroup: "frontend",
    tech: ["HTML5", "CSS3", "Tailwind CSS", "JavaScript ES6+"],
    description: "Developed a responsive organic products website using HTML5, CSS3, Tailwind CSS, and JavaScript with a clean and user-friendly interface.",
    features: [
      "Responsive Design", "Product Sections", "Navigation", "Interactive UI Components",
      "Hover Effects", "Responsive Layouts", "User-Friendly Interface", "JavaScript Interactions"
    ],
    architecture: [],
    stats: [],
    problem: "Showcase a range of organic, value-added products with an interface that reads clearly on any screen size, without a heavy framework.",
    solution: "Built a fully responsive marketing site using semantic HTML5, utility-first styling with Tailwind CSS, and vanilla JavaScript for interactive UI components such as navigation and hover-based interactions.",
    implementation: "Layout uses Tailwind's responsive utility classes for breakpoint-driven grids, with hand-written JavaScript handling navigation state and interactive product sections \u2014 no external UI framework involved.",
    github: "https://github.com/abinayaparthi/Root2Product"
  },
  {
    id: "pharmacy-system",
    title: "Pharmacy Inventory and Sales Management System",
    category: "SQL / Database Development",
    filterGroup: "sql",
    tech: ["MySQL 8.0", "SQL", "Relational Database Design"],
    description: "Designed a 12-table normalized database with 2000+ records for pharmacy inventory, sales, purchases, and payments.",
    features: [
      "Normalized Database Design", "Primary Key Constraints", "Foreign Key Constraints",
      "Joins", "Views", "Stored Procedures", "Triggers", "Window Functions", "Indexes",
      "Inventory Tracking", "Sales Reporting", "Purchase Management", "Payment Tracking"
    ],
    architecture: ["Medicines", "Inventory", "Purchases", "Sales", "Payments"],
    stats: [
      { value: "12", label: "Tables" },
      { value: "2000+", label: "Records" },
      { value: "50+", label: "SQL Queries" }
    ],
    problem: "A pharmacy needs to track medicine stock, purchases, sales, and payments accurately while avoiding data redundancy.",
    solution: "Designed a normalized 12-table relational schema in MySQL 8.0 covering medicines, inventory, purchases, sales, and payments, enforced with primary and foreign key constraints.",
    implementation: "Used joins and subqueries for reporting, views to simplify recurring queries, stored procedures and triggers to automate inventory updates, window functions for sales analysis, and indexes to speed up lookups across 2000+ records.",
    dbConcepts: ["JOINs", "Subqueries", "Window Functions", "Views", "Stored Procedures", "Triggers", "Indexes"],
    github: "https://github.com/abinayaparthi/Pharmacy-Inventory-Sales-Management-System"
  },
  {
    id: "food-donation",
    title: "Smart Food Donation and Distribution System",
    category: "SQL / Database Development",
    filterGroup: "sql",
    tech: ["MySQL 8.0", "SQL", "Relational Database Design"],
    description: "Designed a 12-table relational database with 1000+ records for food donation and distribution management.",
    features: [
      "Food Donor Management", "NGO Partner Management", "Food Category Management",
      "Food Donation Tracking", "Donation Requests", "Request Items", "Volunteer Management",
      "Delivery Assignments", "Delivery Tracking", "Notifications", "Feedback and Reviews"
    ],
    architecture: ["Restaurant / Donor", "Food Donation", "NGO Request", "Volunteer", "Delivery"],
    stats: [
      { value: "12", label: "Tables" },
      { value: "1000+", label: "Records" },
      { value: "40+", label: "SQL Queries" }
    ],
    problem: "Connecting food donors with NGOs and volunteers requires tracking donations, requests, and deliveries in a coordinated way.",
    solution: "Designed a 12-table relational database covering donors, NGOs, food categories, donations, requests, volunteers, and deliveries in MySQL 8.0.",
    implementation: "Built the schema around donor-to-NGO-to-volunteer relationships, using joins and subqueries for matching donations to requests, views and stored procedures for common operations, triggers for status updates, window functions for delivery analysis, and indexes for query performance.",
    dbConcepts: ["JOINs", "Subqueries", "Window Functions", "Views", "Stored Procedures", "Triggers", "Indexes"],
    github: "https://github.com/abinayaparthi/Smart-Food-Donation-And-Distribution-System"
  }
];

function renderProjects(filter = "all") {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  PROJECTS.forEach((project) => {
    const isVisible = filter === "all" || project.filterGroup === filter;
    const card = document.createElement("article");
    card.className = "project-card reveal" + (isVisible ? "" : " is-hidden");
    card.dataset.group = project.filterGroup;

    const statsHtml = project.stats.length
      ? `<div class="project-stats">${project.stats
          .map((s) => `<div class="project-stat"><span>${s.value}</span><small>${s.label}</small></div>`)
          .join("")}</div>`
      : "";

    const techHtml = project.tech.map((t) => `<span class="tech-pill">${t}</span>`).join("");

    card.innerHTML = `
      <div class="project-card-head">
        <p class="project-category">${project.category}</p>
        <h3 class="project-title">${project.title}</h3>
      </div>
      <p class="project-desc">${project.description}</p>
      <div class="tech-row">${techHtml}</div>
      ${statsHtml}
      <div class="project-actions">
        <a href="${project.github}" class="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        <button class="btn btn-primary btn-sm" data-project-id="${project.id}" data-action="view-details">View Details</button>
      </div>
    `;

    grid.appendChild(card);
  });

  if (window.observeReveals) window.observeReveals();
}

function getProjectById(id) {
  return PROJECTS.find((p) => p.id === id);
}
