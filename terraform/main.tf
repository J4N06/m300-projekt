provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "main" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_security_group" "k8s" {
  name        = "k8s-sg"
  description = "Allow SSH and Kubernetes ports"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Kubernetes ports"
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "k8s" {
  count         = 3
  ami           = "ami-0fc5d935ebf8bc3bc" # Ubuntu 22.04 (us-east-1)
  instance_type = "t2.medium"
  subnet_id     = aws_subnet.main.id
  key_name      = var.key_pair
  security_groups = [aws_security_group.k8s.id]

  tags = {
    Name = "k8s-${count.index == 0 ? "master" : "worker${count.index}"}"
  }

  user_data = file("init.sh")
}
