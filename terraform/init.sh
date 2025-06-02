#!/bin/bash
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl

# Docker installieren
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker

# Kubernetes installieren
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo bash -c 'cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF'
sudo apt update
sudo apt install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# Hostname setzen
hostnamectl set-hostname k8s-node-$(hostname | tr -dc '0-9')
