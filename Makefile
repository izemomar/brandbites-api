build.dev:
	docker compose --file docker-compose-dev.yml --env-file app/.env-dev up --build -d
it.dev:
	docker exec -it brandbites-dev-api sh
down.dev:
	docker compose --file docker-compose-dev.yml --env-file app/.env-dev down
clear.dev:
	docker compose --file docker-compose-dev.yml --env-file app/.env-dev down --rmi all --volumes --remove-orphans
exec.dev:
	docker exec -it brandbites-dev-api $(c)
	

