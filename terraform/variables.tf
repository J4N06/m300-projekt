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
  type        = string
  description = "Public SSH key for EC2 access"
}

