# Projektdokumentation: Automatisierte Kubernetes-Deployment-Umgebung mit Robot Shop

---

## Inhaltsverzeichnis
- [Projektdokumentation: Automatisierte Kubernetes-Deployment-Umgebung mit Robot Shop](#projektdokumentation-automatisierte-kubernetes-deployment-umgebung-mit-robot-shop)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Architektur](#architektur)
  - [Komponenten \& Beziehungen](#komponenten--beziehungen)
  - [Klare Schnittstellen](#klare-schnittstellen)
    - [Erwartete Daten](#erwartete-daten)
    - [Methoden / Endpunkte](#methoden--endpunkte)
    - [Rückmeldungen](#rückmeldungen)
    - [Standards](#standards)
  - [Robot Shop Microservices](#robot-shop-microservices)
    - [Aufbau](#aufbau)
    - [Schnittstellen \& APIs](#schnittstellen--apis)
    - [Wie die APIs zusammenarbeiten](#wie-die-apis-zusammenarbeiten)
  - [Setup, Installation \& Betrieb](#setup-installation--betrieb)

---

## Architektur

Ich habe eine modulare, automatisierte Lösung entwickelt, die **Terraform**, **Ansible** und **Kubernetes** kombiniert. Die Architektur trennt klar:
- **Infrastruktur** (Terraform)
- **Konfiguration** (Ansible)
- **Applikationen & Microservices** (Kubernetes)

Diese Schichten ermöglichen, dass einzelne Dienste unabhängig voneinander entwickelt, getestet und betrieben werden können.

---

## Komponenten & Beziehungen

| Komponente                              | Beschreibung                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `main.tf`, `outputs.tf`, `variables.tf` | Terraform-Module: Definieren Cloud-Ressourcen, Variablen & Outputs.               |
| `inventory.ini`                         | Host- und Verbindungsinformationen für Ansible.                                   |
| `playbook.yml`, `main.yml`              | Ansible-Playbooks: Automatisieren die Kubernetes-Installation und -Konfiguration. |
| `deploy.yml`, `k8sweb.service`          | Kubernetes-Manifest-Dateien: Deployment der Anwendungen & LoadBalancer-Services.  |

Die Beziehungen sind klar: Zuerst wird Infrastruktur bereitgestellt, dann Kubernetes konfiguriert, dann die Anwendung deployed.

---

## Klare Schnittstellen

### Erwartete Daten

| Tool       | Erwartete Daten                                       |
| ---------- | ----------------------------------------------------- |
| Terraform  | Variablen wie `MASTER_DNS`, SSH-Keys, Cloud-Parameter |
| Ansible    | Hosts via `inventory.ini`, SSH-Key für Verbindung     |
| Kubernetes | YAML-Deployments & Services                           |

---

### Methoden / Endpunkte

- **Terraform**: `terraform plan` & `terraform apply` → Erstellt/ändert Infrastruktur.
- **Ansible**: `ansible-playbook` → Installiert Kubernetes auf Hosts.
- **Kubernetes**: `kubectl apply` → Rollout von Deployments & Services.
- **Service-Endpunkte**: LoadBalancer-IPs für externen Zugriff auf Apps.

---

### Rückmeldungen

- **Terraform Outputs**: z. B. Master-IP.
- **Ansible Logs**: Status pro Host.
- **Kubernetes Status**: `kubectl get pods/services` → Health-Checks.

---

### Standards

- **IaC**: Deklarativ & idempotent.
- **APIs**: REST-Standards (OpenAPI/Swagger-konform).
- **Kubernetes Manifeste**: YAML-Standard.

---

## Robot Shop Microservices

Als Beispielanwendung deploye ich den **Robot Shop**, der aus mehreren Microservices besteht. Das zeigt, wie APIs, Skalierung und unabhängige Deployments funktionieren.

### Aufbau

- **Microservices**: Frontend, Catalogue, Cart, Orders, Payments, Database.
- **Deployment**: Alle Services werden über Kubernetes Deployments & Services bereitgestellt.
- **Externe Erreichbarkeit**: Das Frontend ist über einen LoadBalancer (`k8sweb.service`) zugänglich.

---

### Schnittstellen & APIs

| Service       | Endpunkte                                   | Erwartete Daten                | Rückmeldungen                |
| ------------- | ------------------------------------------- | ------------------------------ | ---------------------------- |
| **Frontend**  | HTTP/HTTPS                                  | REST-Aufrufe an Backend        | HTML/JSON                    |
| **Catalogue** | `/catalogue` (GET), `/catalogue/{id}` (GET) | GET ohne Body                  | JSON-Produktdaten            |
| **Cart**      | `/cart` (GET/POST/DELETE)                   | JSON mit Produkt-IDs           | JSON-Bestätigung oder Fehler |
| **Orders**    | `/orders` (POST)                            | JSON mit Warenkorb und Zahlung | JSON mit Auftragsnummer      |
| **Payments**  | `/paymentAuth` (POST)                       | JSON mit Zahlungsdetails       | JSON mit Zahlungsstatus      |

Diese Endpunkte folgen REST-Standards und könnten mit Swagger beschrieben werden.

---

### Wie die APIs zusammenarbeiten

- Das Frontend ruft die Microservices über HTTP-Calls auf.
- Kubernetes-Services regeln interne DNS-Auflösung.
- Jeder Microservice ist eigenständig skalierbar.
- Logs & Monitoring werden über Kubernetes-Tools möglich.

---

## Setup, Installation & Betrieb

