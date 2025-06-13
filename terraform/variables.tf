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

variable "public_key_path" {
  description = "Pfad zur SSH Public Key Datei"
  default     = "~/.ssh/k8s/id_rsa.pub"
}
