# 📦 M300-PROJEKT
## 🗂️ Projektstruktur
In diesem Projekt, werden mit hilfe von Terraform und Ansible drei EC2 Instanzen erstellt auf welche anschliessend Kubernetes installiert wird, damit der Robot Shop dort läuft.
```plaintext
M300-PROJEKT/
│
├── terraform/           # Terraform-Konfiguration für die Infrastruktur
│   ├── main.tf
│   ├── outputs.tf
│   ├── variables.tf
│   ├── ssh-key/
│
├── ansible/             # Ansible Playbooks für die Serverkonfiguration
│   ├── inventory.ini
│   ├── playbook.yml
│   ├── roles/
│   │   ├── common/tasks/main.yml
│   │   ├── master/tasks/main.yml
│   │   └── worker/tasks/main.yml
│   ├── files/
│   │   ├── app.py
│   │   └── k8sweb.service
│
├── .github/workflows/   # CI/CD Workflows
│   └── deploy.yml
│
├── _old/                # Alte Ideen und unfertige Projekte
│   ├── charts/
│   ├── dashboards/
│   ├── helm/
│   ├── k8s/
│
├── .gitignore
├── documentation.md     # Projektdokumentation
├── schema.png           # Diagramm der Infrastruktur
└── README.md
```

## 🚀 Projektziele

- ✅ **Automatisierte Bereitstellung** einer Cloud-Infrastruktur mit Terraform  
- ✅ **Konfiguration** von Maschinen mit Ansible (Rollen für Master/Worker)  
- ✅ Bereitstellung von Kubernetes-Ressourcen inkl. Helm-Charts *(optional, falls genutzt)*  
- ✅ **CI/CD Workflow** über GitHub Actions (`.github/workflows/deploy.yml`)  
- ✅ **Visuelle Dokumentation** (siehe `schema.png`)  
  
Die Dokumentation findet man unter dem folgenden 