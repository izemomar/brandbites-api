build.dev:
	docker compose --file docker-compose-dev.yml --env-file app/.env-dev up --build -d
it.dev:
	docker exec -it brandbites-dev-api sh
down.dev:
	docker compose --file docker-compose-dev.yml --env-file app/.env-dev down
clear.dev:
	docker system prune -f
	docker compose --file docker-compose-dev.yml --env-file app/.env-dev down --rmi all --volumes --remove-orphans
	rmdir /s /q mysql
exec.dev:
	docker exec -it brandbites-dev-api $(c)
	

