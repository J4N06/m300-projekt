output "node_ips" {
  value = [for instance in aws_instance.k8s_node : instance.public_ip]
}
