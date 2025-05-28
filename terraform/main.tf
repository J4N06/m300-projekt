module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "20.8.4" # oder die aktuelle, bekannte funktionierende Version
  cluster_name    = "my-k8s-cluster"
  cluster_version = "1.27"
  subnet_ids      = module.vpc.public_subnets
  vpc_id          = module.vpc.vpc_id

  eks_managed_node_groups = {
    default = {
      min_size     = 2
      max_size     = 2
      desired_size = 2
      instance_types = ["t3.medium"]
    }
  }
}
