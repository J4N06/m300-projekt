variable "region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  default = "tf-key"
}

variable "private_key" {
  description = "SSH private key as plain text"
  type        = string
  sensitive   = true
}
