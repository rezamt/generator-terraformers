# Complete your provider information here
# Full list of providers: https://www.terraform.io/docs/providers/index.html
provider "<%= provider %>" {
  # provider parameters here. Override any secrets at run time and avoid storing them in source control<% for (i in providerAttributes) { %>
  <%= providerAttributes[i] %> = "${var.<%= providerAttributes[i] %>}"<% } %>
}

<% if (backend == "s3") { %>
terraform {
  backend "s3" {
    bucket = "terraform"
    key    = "applications/<%= appName %>/<%= environment %>/terraform.tfstate"
    region = "ap-southeast-2"
  }
}

data "terraform_remote_state" "" {
  backend = "s3"
  config {
    bucket = "terraform"
    key    = "applications/<%= appName %>/<%= environment %>/terraform.tfstate"
    region = "ap-southeast-2"
    access_key = "${var.terraform_access_key}"
    secret_key = "${var.terraform_secret_key}"
    dynamodb_table = "terraform"
    skip_credentials_validation = true
  }
}

data "terraform_remote_state" "network" {
  backend = "s3"
  config {
    bucket = "terraform"
    key    = "azure/network/terraform.tfstate"
    region = "ap-southeast-2"
    access_key = "${var.terraform_access_key}"
    secret_key = "${var.terraform_secret_key}"
    dynamodb_table = "terraform"
    skip_credentials_validation = true
  }
}
<% } %>
<% if (backend == "local") { %>
data "terraform_remote_state" "network" {
  backend = "s3"
    config {
      bucket = "terraform"
      key    = "azure/network/terraform.tfstate"
      region = "ap-southeast-2"
      access_key = "${var.terraform_access_key}"
      secret_key = "${var.terraform_secret_key}"
      dynamodb_table = "terraform"
      skip_credentials_validation = true
    }
  }
<% } %>
