# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "rg-3tier-aks"
  location = "eastus"
}


# AKS Cluster
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-3tier"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "aks3tier"

  default_node_pool {
    name       = "nodepool1"
    node_count = 1
    vm_size    = "Standard_D2s_v3"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    environment = "dev"
    owner       = "ayush"
  }
}

