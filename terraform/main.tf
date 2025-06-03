provider "aws" {
  region = var.region
}

resource "aws_instance" "k8s_node" {
  count         = 3
  ami           = "ami-0c02fb55956c7d316" # Ubuntu 22.04 LTS (us-east-1)
  instance_type = var.instance_type
  key_name      = var.key_name
  user_data     = file("${path.module}/init.sh")

  subnet_id                   = aws_subnet.public[0].id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.k8s_ssh.id]

  tags = {
    Name = "k8s-node-${count.index}"
  }

  provisioner "remote-exec" {
    inline = ["echo Node ${count.index} ready"]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file(var.private_key_path)
      host        = self.public_ip
    }
  }
}
