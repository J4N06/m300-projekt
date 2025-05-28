provider "aws" {
  region = "us-east-1" # Oder die Region aus deinem Learner Lab
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "my-k8s-cluster"
  cluster_version = "1.27"
  subnet_ids      = module.vpc.public_subnets
  vpc_id          = module.vpc.vpc_id

node_groups = {
  default = {
    desired_capacity = 2
    max_capacity     = 2
    min_capacity     = 2
    instance_types   = ["t3.medium"]
  }
}
}