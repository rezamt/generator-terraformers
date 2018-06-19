<% if (provider == "azurerm") { %>
resource "azurerm_resource_group" "rg-<%= appName %>" {
  location = "<%= location %>"
  name = "rg-<%= appName %>"
}
<% } %>

# Define your resources Here
