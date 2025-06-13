output "instance_public_ip" {
  value = aws_instance.k8s_node.public_ip
}

output "ssh_command" {
  value = "ssh -i ~/.ssh/k8s/id_rsa ubuntu@${aws_instance.k8s_node.public_ip}"
}
