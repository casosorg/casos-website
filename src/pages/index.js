import React, {useEffect, useRef, useState} from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function Typewriter({text, delay = 300}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, 22);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      <span className={clsx(styles.cursor, done && styles.cursorDone)}>_</span>
    </span>
  );
}

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroEyebrow}>
              <span className={styles.eyebrowPrompt}>$</span>
              <span>casos <span className={styles.eyebrowVersion}>v0.1.0</span></span>
            </div>
            <h1 className={styles.heroTitle}>CasOS</h1>
            <p className={styles.heroSubtitle}>
              <Typewriter text="A cloud operating system built on Kubernetes." />
            </p>
            <p className={styles.heroDesc}>
              Embeds the full Kubernetes control plane as a single binary.
              No external cluster, no kubeadm, no extra moving parts.
            </p>
            <div className={styles.buttons}>
              <Link className={styles.btnPrimary} to="/docs/overview">
                Get started →
              </Link>
              <Link className={styles.btnGhost} href="https://casos.casnode.com">
                Live demo
              </Link>
              <Link className={styles.btnGhost} href="https://github.com/casosorg/casos">
                GitHub
              </Link>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.asciiBlock}>
              <pre className={styles.asciiPre}>{`┌─ casos ───────────────────────┐
│                               │
│  $ ./casos                    │
│  > embedding k8s control...   │
│  > starting api-server...     │
│  > casdoor auth ready         │
│  > dashboard at :14000  ✓     │
│                               │
│  nodes    1/1   running       │
│  pods     0     pending       │
│  svcs     1     active        │
│                               │
└───────────────────────────────┘`}</pre>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    tag: "core",
    title: "Embedded Kubernetes",
    description:
      "Ships the full K8s control plane — API server, controller manager, scheduler — as one binary. Zero external dependencies.",
  },
  {
    tag: "ui",
    title: "Built-in Dashboard",
    description:
      "Inspect Nodes, Pods, Services, ConfigMaps, and CRBs from a browser. Pull images from DockerHub without touching a terminal.",
  },
  {
    tag: "auth",
    title: "Casdoor Auth",
    description:
      "OAuth2 / OIDC via Casdoor out of the box. SSO, multi-tenant, 100+ identity providers. Configure once, done.",
  },
];

function FeatureCard({tag, title, description}) {
  return (
    <div className="col col--4">
      <div className={styles.featureCard}>
        <span className={styles.featureTag}>{tag}</span>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDesc}>{description}</p>
      </div>
    </div>
  );
}

const STEPS = [
  "$ curl -fsSL .../casos-linux-amd64 -o casos",
  "$ chmod +x casos && ./casos",
  "  → dashboard running at http://localhost:14000",
];

function QuickStart() {
  const [step, setStep] = useState(0);
  const started = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let s = 0;
          const iv = setInterval(() => {
            s++;
            setStep(s);
            if (s >= STEPS.length) clearInterval(iv);
          }, 550);
        }
      },
      {threshold: 0.5}
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.quickstart}>
      <div className="container">
        <div className={styles.qsGrid}>
          <div className={styles.qsMeta}>
            <p className={styles.qsTag}>// quickstart</p>
            <h2 className={styles.qsTitle}>Up in one command</h2>
            <p className={styles.qsDesc}>
              Download the binary, run it, open the browser.
              No cluster provisioning, no CNI plugins to debug.
            </p>
            <div className={styles.qsLinks}>
              <Link className={styles.btnPrimary} to="/docs/get-started">
                Full guide →
              </Link>
              <Link className={styles.btnGhost} href="https://github.com/casosorg/casos">
                GitHub
              </Link>
            </div>
          </div>

          <div className={styles.terminal} ref={ref}>
            <div className={styles.termBar}>
              <span className={styles.termTitle}>bash</span>
            </div>
            <div className={styles.termBody}>
              {STEPS.slice(0, step).map((line, i) => (
                <div key={i} className={clsx(
                  styles.termLine,
                  line.startsWith("  →") && styles.termSuccess
                )}>
                  {line}
                </div>
              ))}
              {step < STEPS.length && (
                <div className={styles.termLine}>
                  <span className={styles.cursorDone}>_</span>
                </div>
              )}
            </div>
          </div>
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
      description="CasOS — a cloud operating system with embedded Kubernetes. No external cluster needed.">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((f) => (
                <FeatureCard key={f.tag} {...f} />
              ))}
            </div>
          </div>
        </section>
        <QuickStart />
      </main>
    </Layout>
  );
}
