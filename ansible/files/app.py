from flask import Flask, render_template_string, request
import subprocess
import json
import requests

app = Flask(__name__)

DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1393134059974168576/lYhch4nM42XQbvGW0B_FitpIRFhYB5Zbd1mtLhYeeB2_LIOEzwtKNDEi5SShyTKQBNU4"

@app.route("/")
def index():
    containers = []
    try:
        result = subprocess.run(
            ["kubectl", "get", "pods", "--all-namespaces", "-o", "json"],
            capture_output=True,
            text=True,
            check=True
        )
        try:
            pod_data = json.loads(result.stdout)
        except json.JSONDecodeError:
            pod_data = {"items": []}

        for item in pod_data["items"]:
            pod_name = item["metadata"]["name"]
            namespace = item["metadata"]["namespace"]
            for c in item["status"].get("containerStatuses", []):
                state = list(c["state"].keys())[0] if "state" in c else "unknown"
                containers.append({
                    "namespace": namespace,
                    "pod_name": pod_name,
                    "container_name": c["name"],
                    "ready": c["ready"],
                    "restart_count": c["restartCount"],
                    "state": state,
                })

                if state != "running":
                    try:
                        message = {
                            "content": f"🚨 Container *{c['name']}* im Pod {pod_name} (Namespace {namespace}) ist im Zustand: *{state.upper()}*!"
                        }
                        requests.post(DISCORD_WEBHOOK_URL, json=message, timeout=5)
                    except Exception as e:
                        print(f"Fehler beim Senden an Discord: {e}")
    except Exception as e:
        print(e)

    html = render_template_string("""
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Kubernetes Container Dashboard</title>
      <meta http-equiv="refresh" content="30" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="p-4 bg-light">
      <div class="container">
        <h1 class="mb-4">Kubernetes Container Dashboard</h1>
        <table class="table table-striped table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Namespace</th>
              <th>Pod</th>
              <th>Container</th>
              <th>Status</th>
              <th>Ready</th>
              <th>Restart Count</th>
              <th>Logs</th>
            </tr>
          </thead>
          <tbody>
            {% for c in containers %}
              <tr>
                <td>{{ c.namespace }}</td>
                <td>{{ c.pod_name }}</td>
                <td>{{ c.container_name }}</td>
                <td>
                  {% if c.state == "running" %}
                    <span class="badge bg-success">{{ c.state }}</span>
                  {% else %}
                    <span class="badge bg-danger">{{ c.state }}</span>
                  {% endif %}
                </td>
                <td>
                  {% if c.ready %}
                    <span class="badge bg-success">true</span>
                  {% else %}
                    <span class="badge bg-danger">false</span>
                  {% endif %}
                </td>
                <td>{{ c.restart_count }}</td>
                <td>
                  <a class="btn btn-sm btn-primary" href="/logs?pod={{ c.pod_name }}&container={{ c.container_name }}&namespace={{ c.namespace }}">View Logs</a>
                </td>
              </tr>
            {% endfor %}
          </tbody>
        </table>
        <p class="text-muted mt-4">Automatische Aktualisierung alle 30 Sekunden</p>
      </div>
    </body>
    </html>
    """, containers=containers)
    return html


@app.route("/logs")
def logs():
    pod = request.args.get("pod")
    container = request.args.get("container")
    namespace = request.args.get("namespace")

    if not pod or not container or not namespace:
        return "Missing parameters: pod, container, namespace required.", 400

    try:
        result = subprocess.run(
            ["kubectl", "logs", pod, "-c", container, "-n", namespace, "--tail=100"],
            capture_output=True,
            text=True,
            check=True
        )
        raw_logs = result.stdout
    except Exception as e:
        raw_logs = f"Error retrieving logs: {e}"

    formatted_logs = (
        raw_logs
        .replace("ERROR", "<span style='color:red;font-weight:bold;'>ERROR</span>")
        .replace("Error", "<span style='color:red;font-weight:bold;'>Error</span>")
        .replace("WARNING", "<span style='color:orange;font-weight:bold;'>WARNING</span>")
        .replace("Warning", "<span style='color:orange;font-weight:bold;'>Warning</span>")
    )

    html = f"""
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Logs for {pod}/{container}</title>
      <meta http-equiv="refresh" content="10" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        pre {{
          background: #f4f4f4;
          padding: 1em;
          border: 1px solid #ccc;
          max-height: 500px;
          overflow-y: scroll;
          white-space: pre-wrap;
        }}
      </style>
    </head>
    <body class="p-4 bg-light">
      <div class="container">
        <h2>Logs für <code>{pod}/{container}</code> (Namespace: {namespace})</h2>
        <pre>{formatted_logs}</pre>
        <a class="btn btn-secondary mt-3" href="/">Zurück</a>
        <p class="text-muted mt-2">Automatische Aktualisierung alle 10 Sekunden</p>
      </div>
    </body>
    </html>
    """
    return html


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
