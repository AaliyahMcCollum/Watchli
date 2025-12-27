# 🎬 WatchLi 

A movie discovery and watchlist application that lets users search, explore, and save movies they want to watch — powered by the TMDB API and a Spring Boot backend.

This project was created for my Web Development final, and expanded as a portfolio piece to showcase full-stack development skills.

⸻

🛠️ Tech Stack

Area	            Technology
Frontend	        HTML, CSS, JavaScript
Backend	          Spring Boot (REST API)
Database	        PostgreSQL
External API	    TMDB API
Deployment	      GitHub Pages (Frontend)
Version Control	  Git + GitHub


⸻

🎯 Features

✔️ Search movies with real-time suggestions
✔️ Hover interactions + dynamic movie cards
✔️ View full movie details on a dedicated page
✔️ Add movies to your watchlist (per user)
✔️ Spring Boot REST API for persistent storage
✔️ PostgreSQL database integration
✔️ Theatre-inspired UI (spotlight & red curtain gradient)

⸻

📸 Screenshots

WIP

⸻

⚙️ How to Run Locally

1. Clone the repository

git clone https://github.com/AaliyahMcCollum/WatchLi.git

2. Frontend Setup

Open the project folder and launch the site:

cd WatchLi/docs

Use Live Server OR open index.html directly.

3. Backend Setup

cd Backend
./mvnw spring-boot:run

Make sure your .env or application.properties contains your DB + TMDB key.

⸻

📌 Project Structure

WatchLi/
 ├─ docs/               # GitHub Pages frontend
 │   ├─ index.html
 │   ├─ movieInfo.html
 │   ├─ css/
 │   ├─ js/
 │
 ├─ Backend/            # Spring Boot application
 │   ├─ src/
 │   ├─ pom.xml
 │
 ├─ README.md


⸻

📡 API Endpoints (Backend)

Method	Endpoint	Description
POST	/auth/login	User login
POST	/auth/signup	Create account
GET	/api/watchlist	Get user’s watchlist
POST	/api/watchlist	Add movie to watchlist
DELETE	/api/watchlist/{id}	Remove movie


⸻

💡 What I Learned
	•	Integrating external APIs (TMDB)
	•	Using Spring Boot to build a REST backend
	•	Managing database relationships in PostgreSQL
	•	Connecting frontend → backend → database
	•	UI consistency + user experience design
	•	Deployment pipelines and GitHub Pages limitations

⸻

👩‍💻 Authors

Aaliyah McCollum
🎓 B.S. Computer Science 
🔍 Seeking Web Development, Front End Developer, Full Stack Developer opportunites
🌐 Portfolio: [(add link)](https://aaliyahmccollum.github.io/Personal-Website/)
📩 LinkedIn: [(add link)](https://www.linkedin.com/in/aaliyahmccollum/)

Joaquin Ramos
🎓 B.S. Computer Science 
📩 LinkedIn: [(add link)](https://www.linkedin.com/in/joaquinramosdlt/)

⸻

🎉 Thank You for Checking Out WatchLi!
