import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/overview">
            Get Started
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            href="https://casos.casnode.com">
            Live Demo
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: "Embedded Kubernetes",
    description: "CasOS embeds the full Kubernetes stack — API server, controller manager, and scheduler. No external cluster or separate control plane needed. Run a single binary and get a fully functional cloud OS.",
  },
  {
    title: "Built-in Web UI",
    description: "Manage Nodes, Namespaces, Pods, Services, ConfigMaps, ServiceAccounts, and ClusterRoleBindings through a clean dashboard. Includes a DockerHub image browser and cluster overview.",
  },
  {
    title: "Casdoor Authentication",
    description: "Enterprise-grade authentication via Casdoor (OAuth2 / OIDC). Multi-language support with i18n built in.",
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md" style={{paddingTop: "2rem"}}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="CasOS is a cloud operating system built on Kubernetes. Embeds the full Kubernetes control plane — no external cluster needed.">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
