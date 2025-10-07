include srcs/.env

all: dev

dev: build_dev
	docker compose -f srcs/compose.yml up

prod: build_prod
	docker compose -f srcs/compose.yml up -d

build_dev: secrets
	TARGET=dev docker compose -f srcs/compose.yml build --no-cache

build_prod: secrets
	TARGET=prod docker compose -f srcs/compose.yml build --no-cache

down:
	docker compose -f srcs/compose.yml down

start:
	docker compose -f srcs/compose.yml start

stop:
	docker compose -f srcs/compose.yml stop

logs:
	docker compose -f srcs/compose.yml logs --follow

prune:
	docker system prune --all --volumes --force

mysql:
	docker compose -f srcs/compose.yml exec mariadb mysql

clean:
	docker compose -f srcs/compose.yml down --volumes --rmi all

fclean: clean
	rm -rf secrets/

re: fclean all

secrets:
	@mkdir -p $@
# 	openssl rand -hex -out $@/db_root_password 6
# 	openssl rand -hex -out $@/db_password 6
# 	openssl rand -hex -out $@/wp_admin_password 6
# 	openssl rand -hex -out $@/wp_password 6
	openssl req -x509 -newkey rsa:2048 -keyout $@/ssl_certificate_key -out $@/ssl_certificate -days 365 -nodes -subj "/CN=localhost" 2> /dev/null

help:
	@echo "Makefile for Docker Compose"
	@echo "Available targets:"
	@echo "  prod    - Start services in production mode"
	@echo "  dev     - Start services in development mode"
	@echo "  build   - Build services"
	@echo "  down    - Remove services"
	@echo "  start   - Start services"
	@echo "  stop    - Stop services"
	@echo "  logs    - View logs"
	@echo "  prune   - Remove all unused containers and images"
	@echo "  mysql   - Execute mariadb monitor"
	@echo "  re      - Restart services with fclean & up"
	@echo "  fclean  - Call clean and remove data, secrets & certificates"
	@echo "  clean   - Remove volumes and stop services"
	@echo "  help    - Show this help message"

.PHONY: all dev prod build_prod build_dev down start stop logs prune mysql re fclean clean secrets