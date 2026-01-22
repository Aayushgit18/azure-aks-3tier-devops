# My Book Collection

This is a simple CRUD application with a 3-tier architecture:
- Frontend: Angular using Material UI
- Backend: Spring Boot
- Database: MySQL

## Preview

![preview](./preview.png)

## How to run the application?

In order to run the application you need to have Docker and docker-compose installed on your machine. Execute the following command to start the whole application:

```sh
docker-compose up
```

Then open the web page http://localhost:4200 in a browser.

## Adminer

The docker compose setup includes Adminer for adminstrating the data base. Once the data base is started open http://localhost:8081 in a browser and log into the data base:

| Setting          | Value        |
|------------------|--------------|
| Data base system | MySQL        |
| Server           | db           |
| User             | root         |
| Password         | springCRUD   |
| Data base        | bookDatabase |

# trigger ci

# End-to-End AKS Deployment Guide

## Technologies Covered

Git, Docker, Kubernetes, Helm, Terraform, Azure, AKS, ACR, GitHub Actions,
MySQL, Azure Key Vault, CSI Driver, Nginx, Gradle, Angular, Spring Boot,
kubectl, Azure CLI

---

## 1. Purpose of This Document

This document explains **how to build, deploy, secure, and verify** a complete **3-tier application** on **Azure Kubernetes Service (AKS)** using **enterprise DevOps best practices**.

## 2. Prerequisites (INSTALLATION)

### Operating System

Linux / macOS / Windows (WSL2 recommended)

---

### Git – Source Control

```bash
sudo apt update
sudo apt install git -y
git --version
```

**WHY:** Required to clone source code and trigger CI/CD pipelines.

---

### Docker – Containerization

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker version
```

**WHY:** Used to package Angular and Spring Boot applications into containers.

---

### Azure CLI – Azure Resource Management

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az version
```

**WHY:** Required to create AKS, ACR, Key Vault, and manage Azure RBAC.

---

### kubectl – Kubernetes CLI

```bash
curl -LO https://dl.k8s.io/release/$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
kubectl version --client
```

**WHY:** Used to interact with Kubernetes resources.

---

### Helm – Kubernetes Package Manager

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
```

**WHY:** Manages Kubernetes manifests in a clean, templated way.

---

### Terraform – Infrastructure as Code

```bash
sudo apt install terraform -y
terraform version
```

**WHY:** Creates AKS and cloud resources in a repeatable and auditable way.

---

### Java 17 – Spring Boot Runtime

```bash
sudo apt install openjdk-17-jdk -y
java -version
```

---

### Node.js & npm – Angular Build

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y
node -v
npm -v
```

---

## 3. Azure Authentication

```bash
az login
```

Verify:

```bash
az account show
```

Set subscription:

```bash
az account set --subscription <SUBSCRIPTION_ID>
```

`<SUBSCRIPTION_ID>` → Azure subscription where resources will be created.

---

## 4. Create Resource Group (FOUNDATION)

```bash
az group create \
  --name <RESOURCE_GROUP_NAME> \
  --location <AZURE_REGION>
```

Verify:

```bash
az group list -o table
```


* `<RESOURCE_GROUP_NAME>` → Logical container for all resources
* `<AZURE_REGION>` → Example: eastus, westus, centralindia

---

## 5. Create Azure Container Registry (ACR)

```bash
az acr create \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <ACR_NAME> \
  --sku Basic
```

Login:

```bash
az acr login --name <ACR_NAME>
```

Verify:

```bash
az acr list -o table
```

**WHY:** AKS pulls private Docker images from ACR.

---

## 6. Create Azure Key Vault

```bash
az keyvault create \
  --name <KEYVAULT_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --location <AZURE_REGION>
```

Verify:

```bash
az keyvault list -o table
```

**WHY:** Secure storage for database credentials.

---

## 7. Store MySQL Secrets in Key Vault

```bash
az keyvault secret set \
  --vault-name <KEYVAULT_NAME> \
  --name mysql-root-password \
  --value <MYSQL_ROOT_PASSWORD>
```

```bash
az keyvault secret set \
  --vault-name <KEYVAULT_NAME> \
  --name mysql-database \
  --value <MYSQL_DATABASE_NAME>
```

Verify:

```bash
az keyvault secret list \
  --vault-name <KEYVAULT_NAME> \
  -o table
```

---

## 8. Create AKS Cluster (Terraform)

```bash
cd terraform
terraform init
terraform apply
```

Verify:

```bash
az aks list -o table
kubectl get nodes
```

---

## 9. Attach ACR to AKS

```bash
az aks update \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <AKS_CLUSTER_NAME> \
  --attach-acr <ACR_NAME>
```

**WHY:** Allows AKS to pull images without Docker credentials.

---

## 10. Install Secrets Store CSI Driver

```bash
helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
helm repo update
```

```bash
helm install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver \
  --namespace kube-system \
  --set syncSecret.enabled=true
```

Install Azure provider:

```bash
kubectl apply -f https://raw.githubusercontent.com/Azure/secrets-store-csi-driver-provider-azure/master/deployment/provider-azure-installer.yaml
```

Verify:

```bash
kubectl get pods -n kube-system | grep secrets
```

---

## 11. Grant AKS Access to Key Vault

Get kubelet identity:

```bash
az aks show \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <AKS_CLUSTER_NAME> \
  --query identityProfile.kubeletidentity.objectId \
  -o tsv
```

Assign role:

```bash
az role assignment create \
  --assignee <KUBELET_OBJECT_ID> \
  --role "Key Vault Secrets User" \
  --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.KeyVault/vaults/<KEYVAULT_NAME>
```

**WHY:** Without this, MySQL pod cannot read secrets.

---

## 12. Deploy Application Using Github Action

Verify:

```bash
kubectl get pods
kubectl get svc
kubectl get pvc
kubectl get secret mysql-secrets
```

---

## 13. Database Validation (MANDATORY)

```bash
kubectl exec -it mysql-0 -- mysql -u root -p
```

```sql
SHOW DATABASES;
USE <MYSQL_DATABASE_NAME>;
SHOW TABLES;
SELECT * FROM book;
```
