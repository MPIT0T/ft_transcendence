FROM node:20

WORKDIR /app

COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN cd backend && npm install
RUN cd frontend && npm install

# Copy actual source code
COPY backend ./backend
COPY frontend ./frontend

WORKDIR /app/backend

# Expose both backend and frontend ports
EXPOSE 3000
EXPOSE 5173

CMD ["sh", "-c", "npm run dev"]
