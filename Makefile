# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ahamuyel <ahamuyel@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/05/04 10:40:00 by ahamuyel          #+#    #+#              #
#    Updated: 2026/05/04 10:40:00 by ahamuyel         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME            = cur10usx
DOCKER_USER     = albertoih
IMAGE           = $(DOCKER_USER)/$(NAME):latest

# Comandos
K               = kubectl
M               = minikube

# Cores
G               = \033[0;32m
R               = \033[0;31m
Y               = \033[0;33m
_               = \033[0m

.PHONY: all build apply restart status clean fclean re tunnel

all: build apply

# --- COMPILAÇÃO (DOCKER) ---

build:
	@echo "$(G)--- Building Docker Image ---$(_)"
	docker build -t $(IMAGE) ./cur10us

push:
	@echo "$(G)--- Pushing to Docker Hub ---$(_)"
	docker push $(IMAGE)

# --- DEPLOY (KUBERNETES) ---

apply:
	@echo "$(G)--- Applying K8s Manifests ---$(_)"
	@if [ -f secret/cur10usx-secrets ]; then \
		$(K) apply -f secret/cur10usx-secrets; \
	else \
		echo "$(Y)Warning: secret/cur10usx-secrets not found$(_)"; \
	fi
	$(K) apply -f deployment-app.yaml
	$(K) apply -f service-app.yaml

restart:
	@echo "$(Y)--- Restarting Deployment ---$(_)"
	$(K) rollout restart deployment/$(NAME)

# --- MONITORAMENTO ---

status:
	@echo "$(G)--- Cluster Status ---$(_)"
	@$(K) get pods,svc,endpoints

logs:
	@$(K) logs -l app=$(NAME) -f --tail=100

tunnel:
	@echo "$(Y)--- Starting Minikube Tunnel (sudo required) ---$(_)"
	sudo $(M) tunnel

# --- LIMPEZA (ESTILO 42) ---

# O clean remove o que está rodando no cluster
clean:
	@echo "$(R)--- Removing K8s Resources ---$(_)"
	-$(K) delete -f deployment-app.yaml 2>/dev/null
	-$(K) delete -f service-app.yaml 2>/dev/null
	@echo "$(Y)Resources removed.$(_)"

# O fclean limpa o cluster e remove imagens/cache para liberar espaço
fclean: clean
	@echo "$(R)--- Deep Cleaning Docker & Minikube Cache ---$(_)"
	-docker rmi $(IMAGE) 2>/dev/null
	@$(M) status >/dev/null 2>&1 && $(M) ssh -- "docker system prune -a --volumes -f" || echo "$(Y)Minikube offline, skipping prune.$(_)"
	@echo "$(G)System clean and disk space freed!$(_)"

re: fclean all