variable "aws_region" {
  default = "us-east-1"
}

variable "availability_zone" {
  default = "us-east-1a"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  default = "k8s-key"
}

variable "k8s_ssh_public_key" {
  description = "SSH Public Key Inhalt aus GitHub Secret"
  type        = string
}
