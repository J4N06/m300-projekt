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
  - [6 Monitoring Doku](#6-monitoring-doku)
    - [6.1 Überblick](#61-überblick)
    - [6.2 Aufbau](#62-aufbau)
    - [6.3 systemd-Dienst](#63-systemd-dienst)
    - [6.4 Alerting via Discord Webhook](#64-alerting-via-discord-webhook)
    - [6.5 ✅ Was funktioniert:](#65--was-funktioniert)
    - [6.6 ❌ Was funktioniert nicht:](#66--was-funktioniert-nicht)
    - [6.7 Status:](#67-status)
    - [6.8 Fazit](#68-fazit)
  - [7 Bünzli Shop (Projekt abbgebrochen)](#7-bünzli-shop-projekt-abbgebrochen)
    - [7.1 Ziel](#71-ziel)
    - [7.2 Projektstruktur](#72-projektstruktur)
    - [7.3 So sollte es funktionieren](#73-so-sollte-es-funktionieren)
    - [7.4 Was ich erfolgreich umgesetzt habe](#74-was-ich-erfolgreich-umgesetzt-habe)
    - [7.5 API-Tests](#75-api-tests)
    - [7.6 Mein Testverlauf](#76-mein-testverlauf)
    - [7.7 Probleme \& Ursachen](#77-probleme--ursachen)
    - [7.8 Beispiel-Fehler](#78-beispiel-fehler)
    - [7.9 Was ich daraus gelernt habe](#79-was-ich-daraus-gelernt-habe)
    - [7.10 Best Practices für mein nächstes Mal](#710-best-practices-für-mein-nächstes-mal)

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
| `deploy.yml`                            | Kubernetes-Manifest-Dateien: Deployment der Anwendungen                           |

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
## 6 Monitoring Doku

### 6.1 Überblick
Dieses Monitoring-System zeigt den Status aller Kubernetes-Container in einer übersichtlichen Web-Oberfläche an.  
Die Anwendung wurde mit Flask realisiert und läuft dauerhaft über systemd.  
Die Daten werden alle *30 Sekunden automatisch aktualisiert*.  
Zusätzlich wurde ein Alerting-System via *Discord Webhook* integriert.

---

### 6.2 Aufbau
Die Web-App greift per kubectl get pods -o json auf die aktuellen Pod- und Containerinformationen zu und verarbeitet die JSON-Daten live in einer HTML-Tabelle.

Jeder Container wird dargestellt mit:
- Namespace
- Pod-Name
- Container-Name
- Status
- Restart-Zähler
- Logs (Link)

*Hinweis:*  
Die Logs-Seite hebt alle WARNING und ERROR-Zeilen farblich hervor.

- Dashboard aktualisiert sich alle *30 Sekunden*
- Logs aktualisieren sich alle *10 Sekunden*

---

### 6.3 systemd-Dienst

Ein eigener systemd-Dienst (k8sweb.service) wurde erstellt, um die Flask-App:

- beim Booten automatisch zu starten
- dauerhaft im Hintergrund laufen zu lassen
- zuverlässig zu überwachen (automatischer Neustart bei Fehlern)

---

### 6.4 Alerting via Discord Webhook

Ein Discord Webhook wurde eingebunden, um Container-Fehler automatisch zu melden.  
Die App erkennt, wenn ein Container **nicht im Zustand running** ist, und sendet eine Nachricht mit:

- Containername
- Podname
- Namespace
- Zustand

### 6.5 ✅ Was funktioniert:
- **Manueller Test via curl** an den Webhook hat *erfolgreich* eine Nachricht in Discord gesendet.

### 6.6 ❌ Was funktioniert nicht:
- Die *automatischen Benachrichtigungen aus der App* erscheinen *nicht im Discord-Channel*.

### 6.7 Status:
- Der Webhook ist gültig
- Der Code zur Benachrichtigung wurde eingebaut
- Firewall, DNS, Rate-Limiting etc. wurden als mögliche Ursachen geprüft  
→ *Fehlerquelle ist noch unklar*

---

### 6.8 Fazit

- Die Anwendung läuft stabil im Browser und zeigt Container-Status sowie Logs übersichtlich an.
- Das Alerting wurde vorbereitet, funktioniert im manuellen Test – aber nicht automatisch.
- Eine genaue Fehleranalyse für das Alerting ist noch offen.


## 7 Bünzli Shop (Projekt abbgebrochen)

### 7.1 Ziel

Ich wollte einen Shop auffbauen der wie folgt aussah:

* **Frontend:** Vite, React, NGINX
* **Admin Panel:** Vite, React, NGINX
* **Backend API:** Node.js, Express
* **Mailservice:** Node.js (für Bestellbestätigungen)
* **PostgreSQL:** persistente Datenbank

Alles sollte als **getrennte Docker-Container** laufen und über **GitHub Actions & GHCR** in einem AWS EKS Cluster deployed werden.

---

### 7.2 Projektstruktur

```plaintext
webshop/
 ├─ admin/
 │   ├─ src/
 │   │   ├─ pages/
 │   │   │   ├─ app.jsx
 │   │   │   ├─ bestellungen.jsx
 │   │   │   ├─ produkte.jsx
 │   │   ├─ main.jsx
 │   │   ├─ index.css
 │   ├─ index.html
 │   ├─ nginx.conf
 │   ├─ Dockerfile
 │   ├─ package.json
 ├─ backend/
 │   ├─ src/
 │   │   ├─ index.js
 │   ├─ .env
 │   ├─ Dockerfile
 │   ├─ package.json
 ├─ frontend/
 │   ├─ src/
 │   │   ├─ main.jsx
 │   │   ├─ index.css
 │   ├─ index.html
 │   ├─ nginx.conf
 │   ├─ Dockerfile
 │   ├─ package.json
 ├─ mailservice/
 │   ├─ src/
 │   │   ├─ index.js
 │   ├─ .env
 │   ├─ Dockerfile
 │   ├─ package.json
 ├─ postgres/
 │   ├─ init.sql
 ├─ k8s/
 │   ├─ namespace.yaml
 │   ├─ backend.yaml
 │   ├─ frontend.yaml
 │   ├─ admin.yaml
 │   ├─ mailservice.yaml
 │   ├─ postgres.yaml
 │   ├─ secrets.yaml
 │   ├─ ingress.yaml
 │   ├─ postgres-init-configmap.yaml
 ├─ .github/workflows/
 │   ├─ deploy-shop.yml
 │   ├─ deploy-monitoring.yml
 │   ├─ deploy.yml
```

---

### 7.3 So sollte es funktionieren

Ich wollte, dass:

* Das **Frontend** die Produkte anzeigt und mit dem Backend über `/api` Routen spricht.
* Das **Admin Panel** eine UI für Produkt- und Bestellverwaltung bietet.
* Das **Backend** eine REST-API (`/produkte`, `/bestellungen`) mit JWT-Auth bereitstellt und mit Postgres kommuniziert.
* Der **Mailservice** Bestellbestätigungen verschickt.
* **Postgres** als persistente DB für Bestellungen & Produkte läuft.

---

### 7.4 Was ich erfolgreich umgesetzt habe

* Ich habe **Docker-Multistage-Builds** für Frontend & Admin umgesetzt (Vite → NGINX).
* Ich habe Images in die **GitHub Container Registry (GHCR)** gepusht.
* Ich habe Secrets & `imagePullSecrets` für GHCR korrekt eingerichtet.
* Ich habe Deployments & Services in Kubernetes sauber getrennt aufgesetzt.
* Ich habe einen **GitHub Actions Workflow** geschrieben, um YAMLs automatisch auf meinen Cluster zu kopieren und anzuwenden.
* Ich habe alle Komponenten lokal mit `docker run` getestet: Frontend & Backend liefen lokal, `/api`-Routen antworteten wie erwartet.

---

### 7.5 API-Tests

Ich habe folgende API-Tests durchgeführt:

| Endpunkt                 | Erwartetes Verhalten                         |
| ------------------------ | -------------------------------------------- |
| `GET /api/produkte`      | Gibt ein JSON-Array aller Produkte zurück    |
| `POST /api/bestellungen` | Legt eine neue Bestellung an                 |
| Auth via `JWT_SECRET`    | Nur Admin darf Bestellungen einsehen         |
| Verbindung zu Postgres   | SELECT & INSERT funktionieren zuverlässig    |
| Mailservice `/send`      | Simuliert/Loggt eine E-Mail-Benachrichtigung |

---

### 7.6 Mein Testverlauf

| Testschritt                         | Ergebnis                                      |
| ----------------------------------- | --------------------------------------------- |
| `docker run` Frontend lokal         | ✅ React-Seite wurde angezeigt                 |
| `docker run` Backend lokal          | ✅ `/api/produkte` funktionierte               |
| Verbindung Frontend → Backend lokal | ✅ Mit `host.docker.internal`                  |
| Cluster-Proxy-Auflösung             | ❌ Teilweise `host not found`                  |
| GHCR Image Pull im Cluster          | ❌ `401 Unauthorized` mehrmals                 |
| NGINX im Container                  | ✅ Lief, aber Proxy-Upstream stimmte oft nicht |

---

### 7.7 Probleme & Ursachen

| Problem                      | Ursache                                                           |
| ---------------------------- | ----------------------------------------------------------------- |
| `ImagePullBackOff`           | GHCR Secret (`ghcr-auth`) war falsch oder mein PAT war abgelaufen |
| `CrashLoopBackOff` bei NGINX | Falscher DNS Upstream: Service-Name nicht erreichbar              |
| Pods `Pending`               | Disk-Pressure oder Control-Plane Taints blockierten Scheduling    |
| Vite Build-Fehler            | `index.html` oder `index.css` fehlten oder Pfade waren falsch     |
| Unterschied Cluster / lokal  | Unterschiedliche Proxy-Upstreams (`nginx.conf`) nötig             |

---

### 7.8 Beispiel-Fehler

* `Could not resolve "./index.css"` → Die Datei fehlte → Build schlug fehl
* `host not found in upstream` → Falscher Upstream Host in `nginx.conf` eingetragen
* `401 Unauthorized` beim Image-Pull → Pull-Secret oder PAT nicht korrekt

---

### 7.9 Was ich daraus gelernt habe

* Ich muss die lokale Config (`nginx.local.conf`) klar von der Cluster-Config (`nginx.cluster.conf`) trennen.
* Service-Namen im Cluster müssen **exakt stimmen**, da DNS extrem sensibel ist.
* `kubectl describe pod` zeigt immer, was schiefläuft (z. B. Events, 401, DNS-Probleme).
* Mein GHCR PAT muss rechtzeitig erneuert werden; `read:packages` ist Pflicht.
* Disk-Pressure auf Nodes blockiert Scheduling → ich muss Node-Ressourcen im Blick behalten.

---

### 7.10 Best Practices für mein nächstes Mal

* Images immer lokal mit `docker run` testen, dann pushen & erst dann deployen.
* Helm Charts oder Kustomize nutzen, um Umgebungen sauber zu trennen.
* Für statische Apps bleibt NGINX super – aber Proxy-Upstream muss pro Env gesetzt werden.
* Secrets & `imagePullSecrets` immer kontrollieren.
* Monitoring mit Prometheus & Grafana mitlaufen lassen, um Ressourcenengpässe früh zu sehen.

---