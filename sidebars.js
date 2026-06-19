/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    "overview",
    {
      type: "category",
      label: "Getting Started",
      items: [
        "get-started",
        "configuration",
        "authentication",
      ],
    },
    "architecture",
    "dashboard",
    {
      type: "category",
      label: "Workloads",
      items: [
        "workloads/deployments",
        "workloads/statefulsets",
        "workloads/cronjobs",
        "workloads/pods",
      ],
    },
    {
      type: "category",
      label: "Networking",
      items: [
        "networking/services",
        "networking/ingress",
        "networking/network-policies",
      ],
    },
    {
      type: "category",
      label: "Storage",
      items: [
        "storage/pvcs",
        "storage/configmaps",
        "storage/secrets",
      ],
    },
    {
      type: "category",
      label: "Access Control",
      items: [
        "access-control/namespaces",
        "access-control/serviceaccounts",
        "access-control/clusterrolebindings",
        "access-control/resource-quotas",
      ],
    },
    "nodes",
    "hpa",
    "logs",
    "app-store",
    {
      type: "category",
      label: "Security",
      items: [
        "security/trivy",
        "security/admission-policies",
        "security/authorization-policies",
      ],
    },
  ],
};

module.exports = sidebars;
