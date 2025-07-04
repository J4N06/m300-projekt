from flask import Flask, render_template_string
import subprocess
import json

app = Flask(__name__)

@app.route("/")
def index():
    try:
        # Pods im JSON-Format abfragen
        result = subprocess.run(
            ["kubectl", "get", "pods", "-o", "json"],
            capture_output=True,
            text=True,
            check=True
        )
        pod_data = json.loads(result.stdout)
        
        containers = []
        for item in pod_data["items"]:
            pod_name = item["metadata"]["name"]
            namespace = item["metadata"]["namespace"]
            for c in item["status"]["containerStatuses"]:
                containers.append({
                    "namespace": namespace,
                    "pod_name": pod_name,
                    "container_name": c["name"],
                    "ready": c["ready"],
                    "restart_count": c["restartCount"],
                    "state": (
                        list(c["state"].keys())[0]
                        if "state" in c
                        else "unknown"
                    ),
                })
    except Exception as e:
        containers = []
        print(e)

    html = """
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Kubernetes Container Status</title>
      <meta http-equiv="refresh" content="30">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet">
    </head>
    <body class="p-4 bg-light">
      <div class="container">
        <h1 class="mb-4">Kubernetes Container Status (pro Container)</h1>
        <table class="table table-striped table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Namespace</th>
              <th>Pod</th>
              <th>Container</th>
              <th>Status</th>
              <th>Ready</th>
              <th>Restart Count</th>
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
              </tr>
            {% endfor %}
          </tbody>
        </table>
        <p class="text-muted">Automatische Aktualisierung alle 30 Sekunden</p>
      </div>
    </body>
    </html>
    """

    return render_template_string(html, containers=containers)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
