<% if (backend == "s3") { %>
# Terraform accessing S3 backend Only
terraform_access_key =  "Your AWS Access Key"
terraform_secret_key =  "Your AWS Secret Key"
<% } %>

# provider parameters here. Override any secrets at run time and avoid storing them in source control<% for (i in providerAttributes) { %>
<%= providerAttributes[i] %> = "Your Provider <%= providerAttributes[i] %>"<% } %>

