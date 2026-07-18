13 podman_compose:
	podman compose up --build

11 podman_backend:
	cd backend && podman build -t todo-backend . && podman run -p 4000:4000 --env-file .env todo-backend

12 podman_frontend:
	cd frontend && podman build -t todo-frontend . && podman run -p 4001:80 -e API_URL=http://127.0.0.1:4000 todo-frontend


1 run_backend:
	cd backend && \
	if [ ! -d "node_modules" ]; then \
		npm i; \
	fi && \
	npm run start

2 run_frontend:
	cd frontend && \
	if [ ! -d "node_modules" ]; then \
		npm i; \
	fi && \
	npm run start


01 run_backend_simple:
	cd backend && npm run start

02 run_frontend_simple:
	cd frontend && npm run start
