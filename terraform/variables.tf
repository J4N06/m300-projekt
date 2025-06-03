variable "region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "SSH Key-Pair Name from AWS"
  type        = string
}

variable "private_key" {
  description = "SSH Private Key (über GitHub Secret)"
  type        = string
}
