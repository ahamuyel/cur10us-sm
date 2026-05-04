# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ahamuyel <ahamuyel@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/05/04 10:15:00 by ahamuyel          #+#    #+#              #
#    Updated: 2026/05/04 10:15:00 by ahamuyel         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Variáveis
NAME            = cur10usx
DOCKER_USER     = albertoih
IMAGE_NAME      = $(DOCKER_USER)/$(NAME)
TAG             = latest

# Cores para o terminal
GREEN           = \033[0;32m
RED             = \033[0;31m
RESET           = \033[0m

.PHONY: all build push k8s-apply k8s-delete status logs tunnel clean

all: build push k8s-apply

# --- DOCKER ---

build:
	@echo "$(GREEN)Building Docker image...$(RESET)"
	docker build -t $(IMAGE_NAME):$(TAG) ./cur10us

push:
	@echo "$(GREEN)Pushing image to Docker Hub...$(RESET)"
	docker push $(IMAGE_NAME):$(TAG)

# --- KUBERNETES ---

# Aplica os YAMLs na ordem correta (Secret -> Deployment -> Service)
apply:
	@echo "$(GREEN)Applying Kubernetes manifests...$(RESET)"
	@if [ -f secret/cur10usx-secrets ]; then \
		kubectl apply -f secret/cur10usx-secrets; \
	else \
		echo "$(RED)Warning: Secret file not found!$(RESET)"; \
	fi
	kubectl apply -f deployment-app.yaml
	kubectl apply -f service-app.yaml

delete:
	@echo "$(RED)Deleting Kubernetes resources...$(RESET)"
	kubectl delete -f deployment-app.yaml
	kubectl delete -f service-app.yaml

# Reinicia os pods para pegar a imagem nova do Docker Hub
restart:
	@echo "$(GREEN)Restarting pods to update image...$(RESET)"
	kubectl rollout restart deployment/$(NAME)

# --- MONITORAMENTO ---

status:
	@echo "$(GREEN)Current Status:$(RESET)"
	@kubectl get pods
	@echo ""
	@kubectl get svc
	@echo ""
	@kubectl get ep $(NAME)-app-service

logs:
	@kubectl logs -l app=$(NAME) -f

# --- MINIKUBE UTILS ---

tunnel:
	@echo "$(GREEN)Starting Minikube Tunnel (need sudo)...$(RESET)"
	minikube tunnel

url:
	minikube service $(NAME)-app-service --url

# Limpeza profunda do Minikube (cuidado!)
clean: delete
	@echo "$(RED)Cleaning up Docker system...$(RESET)"
	minikube ssh -- docker system prune -a --volumes -f