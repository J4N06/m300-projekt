# Projektdokumentation: Automatisierte Kubernetes-Deployment-Umgebung mit Robot Shop

---

## Inhaltsverzeichnis
- [Projektdokumentation: Automatisierte Kubernetes-Deployment-Umgebung mit Robot Shop](#projektdokumentation-automatisierte-kubernetes-deployment-umgebung-mit-robot-shop)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [1 Architektur](#1-architektur)
  - [2 Komponenten \& Beziehungen](#2-komponenten--beziehungen)
  - [3 Klare Schnittstellen](#3-klare-schnittstellen)
    - [3.1 Erwartete Daten](#31-erwartete-daten)
    - [3.2 Methoden / Endpunkte](#32-methoden--endpunkte)
    - [3.3 Rückmeldungen](#33-rückmeldungen)
    - [3.4 Standards](#34-standards)
  - [4 Robot Shop Microservices](#4-robot-shop-microservices)
    - [4.1 Aufbau](#41-aufbau)
    - [4.2 Schnittstellen \& APIs](#42-schnittstellen--apis)
    - [4.3 Wie die APIs zusammenarbeiten](#43-wie-die-apis-zusammenarbeiten)
  - [5 Setup, Installation \& Betrieb](#5-setup-installation--betrieb)
    - [5.1 Übersicht](#51-übersicht)
    - [5.2 Voraussetzungen](#52-voraussetzungen)
    - [5.3 AWS Credentials](#53-aws-credentials)
    - [5.4 GitHub Secrets](#54-github-secrets)
    - [5.5 Terraform GitHub Actions Workflow](#55-terraform-github-actions-workflow)
      - [Datei: `.github/workflows/terraform-deploy.yml`](#datei-githubworkflowsterraform-deployyml)
    - [5.6 Ansible Playbook Struktur](#56-ansible-playbook-struktur)
      - [Rollen:](#rollen)
      - [Zusätzliche Tasks:](#zusätzliche-tasks)
      - [**Three-Tier-Demo**](#three-tier-demo)
      - [**Kubernetes Dashboard (Flask)**](#kubernetes-dashboard-flask)
    - [5.7 Ablauf der Provisionierung](#57-ablauf-der-provisionierung)

---

## 1 Architektur

Ich habe eine modulare, automatisierte Lösung entwickelt, die **Terraform**, **Ansible** und **Kubernetes** kombiniert. Die Architektur trennt klar:
- **Infrastruktur** (Terraform)
- **Konfiguration** (Ansible)
- **Applikationen & Microservices** (Kubernetes)

Diese Schichten ermöglichen, dass einzelne Dienste unabhängig voneinander entwickelt, getestet und betrieben werden können.

---

## 2 Komponenten & Beziehungen

| Komponente                              | Beschreibung                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `main.tf`, `outputs.tf`, `variables.tf` | Terraform-Module: Definieren Cloud-Ressourcen, Variablen & Outputs.               |
| `inventory.ini`                         | Host- und Verbindungsinformationen für Ansible.                                   |
| `playbook.yml`, `main.yml`              | Ansible-Playbooks: Automatisieren die Kubernetes-Installation und -Konfiguration. |
| `deploy.yml`, `k8sweb.service`          | Kubernetes-Manifest-Dateien: Deployment der Anwendungen & LoadBalancer-Services.  |

Die Beziehungen sind klar: Zuerst wird Infrastruktur bereitgestellt, dann Kubernetes konfiguriert, dann die Anwendung deployed.

---

## 3 Klare Schnittstellen

### 3.1 Erwartete Daten

| Tool       | Erwartete Daten                                       |
| ---------- | ----------------------------------------------------- |
| Terraform  | Variablen wie `MASTER_DNS`, SSH-Keys, Cloud-Parameter |
| Ansible    | Hosts via `inventory.ini`, SSH-Key für Verbindung     |
| Kubernetes | YAML-Deployments & Services                           |

---

### 3.2 Methoden / Endpunkte

- **Terraform**: `terraform plan` & `terraform apply` → Erstellt/ändert Infrastruktur.
- **Ansible**: `ansible-playbook` → Installiert Kubernetes auf Hosts.
- **Kubernetes**: `kubectl apply` → Rollout von Deployments & Services.
- **Service-Endpunkte**: LoadBalancer-IPs für externen Zugriff auf Apps.

---

### 3.3 Rückmeldungen

- **Terraform Outputs**: z. B. Master-IP.
- **Ansible Logs**: Status pro Host.
- **Kubernetes Status**: `kubectl get pods/services` → Health-Checks.

---

### 3.4 Standards

- **IaC**: Deklarativ & idempotent.
- **APIs**: REST-Standards (OpenAPI/Swagger-konform).
- **Kubernetes Manifeste**: YAML-Standard.

---

## 4 Robot Shop Microservices

Als Beispielanwendung deploye ich den **Robot Shop**, der aus mehreren Microservices besteht. Das zeigt, wie APIs, Skalierung und unabhängige Deployments funktionieren.

### 4.1 Aufbau

- **Microservices**: Frontend, Catalogue, Cart, Orders, Payments, Database.
- **Deployment**: Alle Services werden über Kubernetes Deployments & Services bereitgestellt.
- **Externe Erreichbarkeit**: Das Frontend ist über einen LoadBalancer (`k8sweb.service`) zugänglich.

---

### 4.2 Schnittstellen & APIs

| Service       | Endpunkte                                   | Erwartete Daten                | Rückmeldungen                |
| ------------- | ------------------------------------------- | ------------------------------ | ---------------------------- |
| **Frontend**  | HTTP/HTTPS                                  | REST-Aufrufe an Backend        | HTML/JSON                    |
| **Catalogue** | `/catalogue` (GET), `/catalogue/{id}` (GET) | GET ohne Body                  | JSON-Produktdaten            |
| **Cart**      | `/cart` (GET/POST/DELETE)                   | JSON mit Produkt-IDs           | JSON-Bestätigung oder Fehler |
| **Orders**    | `/orders` (POST)                            | JSON mit Warenkorb und Zahlung | JSON mit Auftragsnummer      |
| **Payments**  | `/paymentAuth` (POST)                       | JSON mit Zahlungsdetails       | JSON mit Zahlungsstatus      |

Diese Endpunkte folgen REST-Standards und könnten mit Swagger beschrieben werden.

---

### 4.3 Wie die APIs zusammenarbeiten

- Das Frontend ruft die Microservices über HTTP-Calls auf.
- Kubernetes-Services regeln interne DNS-Auflösung.
- Jeder Microservice ist eigenständig skalierbar.
- Logs & Monitoring werden über Kubernetes-Tools möglich.

---

## 5 Setup, Installation & Betrieb

### 5.1 Übersicht

Dieses Projekt deployt ein Kubernetes Cluster bestehend aus:
- **1 Master Node**
- **2 Worker Nodes**

Es verwendet:
- **Terraform** für die AWS-Infrastruktur (EC2)
- **GitHub Actions** zum CI/CD Deployment
- **Ansible** für die Konfiguration der Nodes (Kubernetes, Helm, Demo-App)
- Ein kleines **Flask Dashboard**, das den Cluster-Status anzeigt.

---

### 5.2 Voraussetzungen

- AWS Account
- AWS IAM User mit Zugriff auf EC2 (mit ausreichenden Rechten)
- SSH Key Pair für die Nodes (`K8S_SSH_PUBLIC_KEY` und `K8S_SSH_PRIVATE_KEY`)
- GitHub Repository mit definierten Secrets

---

### 5.3 AWS Credentials

Du brauchst:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- Optional: `AWS_SESSION_TOKEN` bei einem AWS learner Lab

Speichere diese **sicher** in den GitHub Repository Secrets:

---

### 5.4 GitHub Secrets

| Name                    | Beschreibung                       |
| ----------------------- | ---------------------------------- |
| `AWS_ACCESS_KEY_ID`     | Dein AWS Access Key                |
| `AWS_SECRET_ACCESS_KEY` | Dein AWS Secret Key                |
| `AWS_SESSION_TOKEN`     | (optional) bei einem Learner Lab   |
| `K8S_SSH_PUBLIC_KEY`    | Öffentlicher Schlüssel für die EC2 |
| `K8S_SSH_PRIVATE_KEY`   | Privater Schlüssel für SSH-Zugriff |

---

### 5.5 Terraform GitHub Actions Workflow

####  Datei: `.github/workflows/terraform-deploy.yml`

Der Workflow macht folgendes:
1. **Repository auschecken**
2. Terraform installieren und initialisieren
3. AWS Credentials konfigurieren
4. `terraform init`, `terraform validate` und `terraform apply` ausführen
5. Terraform Outputs (Public IPs) abrufen
6. SSH Public Key auf die Instanzen kopieren
7. Ansible Inventory automatisch generieren
8. Ansible installieren und ausführen:
   - Kubernetes installieren
   - Worker Nodes joinen lassen
   - Three-Tier Demo-App via Helm deployen
   - Kubernetes Dashboard mit Flask bereitstellen
9. `kubeconfig` vom Master holen und als Base64-Artifact speichern

**Wichtig:** Der Workflow wartet per Loop auf SSH-Erreichbarkeit jeder Node.

---

### 5.6 Ansible Playbook Struktur

#### Rollen:
- **`common`**: Gemeinsames Setup auf allen Nodes
- **`master`**: Kubernetes Master initialisieren
- **`worker`**: Worker Nodes joinen lassen

#### Zusätzliche Tasks:
#### **Three-Tier-Demo**
- Klonen eines öffentlichen GitHub Repos (`three-tier-architecture-demo`)
- Healthchecks auf `/` anpassen
- StatefulSets & PVCs entfernen
- Helm Chart installieren

#### **Kubernetes Dashboard (Flask)**
- Python3 & Flask installieren
- `app.py` und Service-File kopieren
- Dashboard als Systemd-Service starten

---

### 5.7 Ablauf der Provisionierung

| Schritt        | Aufgabe                                |
| -------------- | -------------------------------------- |
| Terraform      | Startet EC2 Instanzen (Master, Worker) |
| GitHub Actions | Steuert den gesamten Prozess           |
| SSH            | Kopiert Public Key auf die Nodes       |
| Ansible        | Installiert Kubernetes, Helm, Demo-App |
| Helm           | Deployt die App                        |
| Flask          | Stellt Dashboard bereit                |

---
