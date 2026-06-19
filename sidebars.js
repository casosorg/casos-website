/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    "overview",
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
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
      collapsed: false,
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
      collapsed: false,
      items: [
        "networking/services",
        "networking/ingress",
        "networking/network-policies",
      ],
    },
    {
      type: "category",
      label: "Storage",
      collapsed: false,
      items: [
        "storage/pvcs",
        "storage/configmaps",
        "storage/secrets",
      ],
    },
    {
      type: "category",
      label: "Access Control",
      collapsed: false,
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
      collapsed: false,
      items: [
        "security/trivy",
        "security/admission-policies",
        "security/authorization-policies",
      ],
    },
  ],
};

module.exports = sidebars;
