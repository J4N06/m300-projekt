output "instance_public_ips" {
  value = [for i in aws_instance.k8s_nodes : i.public_ip]
}

output "ssh_commands" {
  value = [for i in aws_instance.k8s_nodes : "ssh -i ~/.ssh/k8s/id_rsa ubuntu@${i.public_ip}"]
}
