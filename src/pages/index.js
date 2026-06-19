import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {useWindowSize} from "@docusaurus/theme-common";
import styles from "./index.module.css";

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const windowSize = useWindowSize();
  const isMobile = windowSize === "mobile";

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <img
          src="/img/logo.png"
          alt="CasOS logo"
          className={styles.heroLogo}
          width={96}
          height={96}
        />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle" style={{maxWidth: 640, margin: "0 auto"}}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            style={{marginTop: "2rem", marginRight: isMobile ? "0.5rem" : "1.5rem", marginLeft: isMobile ? "0.5rem" : "1.5rem"}}
            to="/docs/overview">
            Get Started
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            style={{marginTop: "2rem", marginRight: isMobile ? "0.5rem" : "1.5rem", marginLeft: isMobile ? "0.5rem" : "1.5rem"}}
            href="https://casos.casnode.com">
            Live Demo
          </Link>
        </div>
        <div className={styles.heroBadges}>
          <span className={styles.heroBadge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Embedded Kubernetes
          </span>
          <span className={styles.heroBadge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Casdoor Auth
          </span>
          <span className={styles.heroBadge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Open Source
          </span>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: "Embedded Kubernetes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    description: "Ships the full Kubernetes control plane as a single binary — API server, controller manager, and scheduler included. No external cluster, no kubeadm, no extra moving parts.",
  },
  {
    title: "Built-in Web Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    description: "Browse Nodes, Pods, Services, ConfigMaps, and ClusterRoleBindings through a clean UI. Pull images straight from DockerHub without touching the terminal.",
  },
  {
    title: "Casdoor Authentication",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    description: "OAuth2 / OIDC out of the box via Casdoor. Single sign-on, multi-tenant support, and 100+ identity providers — wire it up once and forget about auth middleware.",
  },
];

function Feature({title, icon, description}) {
  return (
    <div className="col col--4">
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function QuickStart() {
  return (
    <section className={styles.quickstart}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Up in one command</h2>
        <p className={styles.sectionLead}>
          Download the binary, point it at a Casdoor instance, and you have a running Kubernetes cluster with a web UI.
          No cluster provisioning, no CNI plugins to debug.
        </p>
        <div className={styles.codeBlock}>
          <pre><code>{`# download and run
curl -L https://github.com/casosorg/casos/releases/latest/download/casos-linux-amd64 -o casos
chmod +x casos && ./casos

# that's it — dashboard at http://localhost:14000`}</code></pre>
        </div>
        <div className={styles.quickstartLinks}>
          <Link className="button button--primary button--md" to="/docs/get-started">
            Full setup guide
          </Link>
          <Link className="button button--outline button--primary button--md" href="https://github.com/casosorg/casos">
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
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
        <QuickStart />
      </main>
    </Layout>
  );
}
