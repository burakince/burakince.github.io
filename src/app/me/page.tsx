import { Metadata } from "next";
import Image from "next/image";
import { SITE_METADATA } from "@/lib/site-metadata";
import { Organization, Person, ProfilePage, WithContext } from "schema-dts";
import JsonLd from "@/app/_components/json-ld";

const PROFESSIONAL_START = { year: 2012, month: 7 };
const PROGRAMMING_START = { year: 2001, month: 1 };

const calculateYears = (start: { year: number; month: number }): number => {
  const now = new Date();
  const startDate = new Date(start.year, start.month - 1, 1);

  let years = now.getFullYear() - startDate.getFullYear();
  const monthDiff = now.getMonth() - startDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < 1)) {
    years--;
  }

  return years;
};

const PROFESSIONAL_YEARS = calculateYears(PROFESSIONAL_START);
const PROGRAMMING_YEARS = calculateYears(PROGRAMMING_START);

const title = `${SITE_METADATA.author} - Lead Developer with ${PROFESSIONAL_YEARS}+ Years Experience`;
const description = `Lead Developer with ${PROFESSIONAL_YEARS}+ years of professional experience (since July 2011) and ${PROGRAMMING_YEARS}+ years of programming experience (since 2001).`;

const MePage = () => {
  const orgJsonLd: Organization = {
    "@type": "Organization",
    name: SITE_METADATA.worksFor.name,
    url: SITE_METADATA.worksFor.url,
    logo: SITE_METADATA.worksFor.logo,
  };

  const myProfileJsonLd: Person = {
    "@type": "Person",
    name: SITE_METADATA.author,
    gender: "male",
    jobTitle: SITE_METADATA.jobTitle,
    worksFor: orgJsonLd,
    description: description,
    url: SITE_METADATA.siteUrl,
    image: `${SITE_METADATA.siteUrl}/assets/me/burakince.webp`,
    sameAs: [
      SITE_METADATA.linkedin,
      SITE_METADATA.github,
      SITE_METADATA.twitter,
      SITE_METADATA.keybase,
      SITE_METADATA.huggingface,
    ],
    knowsAbout: [
      // Core
      "software development",
      "full-stack development",
      "system architecture",
      "distributed systems",
      "micro-services",
      "event-driven architecture",

      // Languages
      "Java",
      "Golang",
      "Python",
      "TypeScript",
      "JavaScript",
      "Scala",
      "C#",
      "Swift",
      "Bash",
      "Groovy",
      "Ruby",
      "Lua",
      "PL/SQL",

      // Cloud / Infra
      "AWS",
      "Google Cloud Platform",
      "Azure",
      "Kubernetes",
      "Helm",
      "Terraform",
      "CloudFormation",
      "Istio",
      "KNative",
      "Docker",
      "Docker Swarm",

      // Data Engineering
      "Apache Spark",
      "PySpark",
      "Delta Lake",
      "Parquet",
      "Apache Airflow",
      "Dagster",
      "DVC",
      "Great Expectations",
      "Deequ",
      "BigQuery",
      "Redshift",

      // ML / AI
      "TensorFlow",
      "PyTorch",
      "Scikit-Learn",
      "ONNX",
      "Kubeflow",
      "KServe",
      "Seldon",
      "MLflow",
      "Amazon Bedrock",
      "Vertex AI",

      // Security / Auth
      "OAuth2",
      "OpenID Connect",
      "Keycloak",
      "HashiCorp Vault",
      "mTLS",

      // Observability
      "Prometheus",
      "Grafana",
      "ELK Stack",
      "OpenTelemetry",
      "Jaeger",
      "Zipkin",

      // Testing / CI-CD
      "Jest",
      "Cypress",
      "Terratest",
      "GitHub Actions",
      "Jenkins",
      "GoCD",

      // Protocols / Specs
      "REST",
      "gRPC",
      "GraphQL",
      "OpenAPI",
      "Swagger",
      "Protobuf",

      // Python
      "PySpark",
      "Apache Airflow",
      "Dagster",
      "DVC",
      "MLflow",
      "Pydantic",
      "Asyncio",
      "Aiohttp",
      "SQLAlchemy",
      "Polars",
      "Scikit-Learn",
      "TensorFlow",
      "PyTorch",
      "FastAPI",
      "Flask",
      "Django",
      "Pandas",
      "NumPy",
      "Great Expectations",
    ],
  };

  const structuredData: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2024-04-28T15:18:27.000Z",
    dateModified: new Date().toISOString(),
    mainEntity: myProfileJsonLd,
  };

  return (
    <div>
      <header>
        <section
          id="profile"
          className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center">
            <Image
              src="/assets/me/burakince.jpg"
              width={200}
              height={250}
              alt="Burak Ince"
              className="w-24 h-24 rounded-full mr-6"
            />
            <div>
              <h2 className="text-3xl font-bold dark:text-gray-300">
                Burak Ince
              </h2>
              <h3 className="text-xl text-gray-700 dark:text-gray-500">
                Lead Consultant Developer at Thoughtworks
              </h3>
            </div>
          </div>
          <div className="mt-4 dark:text-gray-300">
            <p>
              Seasoned Lead Consultant Developer with over{" "}
              <strong>{PROFESSIONAL_YEARS} years</strong> of professional
              experience and <strong>{PROGRAMMING_YEARS} years</strong> of
              programming expertise. Specializes in full-stack development, data
              engineering, and cloud-native architectures. Delivers high-impact
              solutions for Fortune 500 clients and major enterprises in retail,
              automotive, healthcare, energy, and manufacturing industries.
              Brings deep expertise in modern languages (TypeScript, Golang,
              Python), distributed systems, MLOps/CD4ML pipelines,
              infrastructure as code, and software craftsmanship. Maintains a
              proven track record of designing scalable microservices, modern
              data platforms, and evolutionary architectures that drive business
              value and technical excellence.
            </p>
          </div>
        </section>
      </header>

      <section
        id="experience"
        className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-300">
          Experience
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">
              Thoughtworks Experience
            </h3>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major Retail Energy Supply Company
              </h4>
              <p className="dark:text-gray-300">
                During a 10-month tenure as a Data Engineer, designed and
                implemented core RESTful API services utilizing Kubernetes,
                Terraform, Helm, Google Cloud Platform (GCP), CloudSQL
                (PostgreSQL), and TypeScript to develop customer, energy usage,
                and billing microservices with secure OpenID Connect (OIDC) and
                OAuth 2.0-based single sign-on (SSO) authentication.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                University Hospital
              </h4>
              <p className="dark:text-gray-300">
                During a one-month tenure as a Data Engineer, developed a
                proof-of-concept system leveraging Cloudformation, AWS Lambda,
                Python, Amazon Comprehend Medical, AWS Step Functions, Amazon
                S3, API Gateway, and Amazon Bedrock to automate data extraction
                from patient reports and images, enabling automatic
                identification of key medical data and matching potential
                clinical trials for physician review and approval.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major European Retailer of Consumer Electronics and Household
                Appliances
              </h4>
              <p className="dark:text-gray-300">
                During an 8-month tenure as a Data Engineer, modernized IT
                infrastructure and developed a Customer Data Platform on GCP
                BigQuery, leveraging GCP, Cloud Composer, Apache Airflow,
                Python, R, Colab Enterprise, Vertex AI, Kubeflow, Jupyter
                Notebooks, Data Contracts, IAM roles, Google Identity Platform,
                Terraform, Polars, Dataplex, Medallion Architecture, Cloud
                Storage, and Looker to establish robust data governance,
                platform capabilities, and actionable data products.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major Laboratory Devices and Consumables Company
              </h4>
              <p className="dark:text-gray-300">
                Infrastructure consultant for 11 months, working with C#,
                Golang, Typescript, Terraform, Terratest, AWS (including VPC,
                Lambda, Lambda Edge, Fargate, ECR, API Gateway), MQTT, HiveMQ,
                IoT Core, Layer 4 Network Load Balancer, Layer 7 Application
                Load Balancer, mTLS with X509 Certificates, DynamoDB, XRay,
                GitHub Actions, and AWS OIDC Providers. Developed and
                contributed to the MQTT server and infrastructure for secure and
                scalable communication between laboratory devices and the cloud.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major Automobile Manufacturer Company
              </h4>
              <p className="dark:text-gray-300">
                Data engineer for 5 months, building an AI platform for
                connected cars using Kubernetes, Terraform, Terratest, Helm,
                AWS, ECR, Amazon Aurora, Kubeflow, KServe, KNative, Istio,
                Let&apos;s Encrypt, Seldon, PostgreSQL, Redis, Tensorflow
                Serving, Prometheus Stack, Keycloak, and GitHub Actions.
                Improved Kubeflow installation and integrated the
                customer&apos;s SSO system.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major European Multinational Chemicals Company
              </h4>
              <p className="dark:text-gray-300">
                Data engineer for 1 year and 3 months, working on a CD4ML
                machine learning pipeline and AI platform using Golang, Python,
                Asyncio, Aiohttp, Pydantic, FastAPI, SQLAlchemy, Typescript,
                Kubernetes, Helm, Azure Cloud, Azurite, ACR, PostgreSQL,
                Terraform, DVC, Mlflow, Dagster, Great Expectations, REST, gRPC,
                GraphQL, Memgraph, Dash, ONNX, Tensorflow, Scikit-Learn, React,
                Prometheus Stack, Backstage, Azure DevOps, and Azure Pipelines.
                Contributed to the development of the main framework and
                subsections of the portal.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major Energy Logistics and Chemicals Company
              </h4>
              <p className="dark:text-gray-300">
                Lead consultant developer for 1 month, conducting an
                architecture and technology review for in-house developed
                trading software. Examined various architectural classifications
                (monolithic and distributed) with the team and decided on
                approaches to solve problems.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major European e-Commerce Company
              </h4>
              <p className="dark:text-gray-300">
                Data engineer for 9 months, building a fast serving layer using
                Amazon Redshift, Apache Spark, PySpark, Parquet, Delta Lake,
                Scala, Python, Google BigQuery, Apache Airflow, Databricks,
                Deequ, Amazon S3, AWS CloudFormation, Flyway, PostgreSQL, Java,
                Spring Boot, Open API, Open Telemetry, Kubernetes, Scalyr,
                Lightstep, and Grafana. Helped ingest data from different
                systems and optimize the data pipeline.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major Automobile Manufacturer Company
              </h4>
              <p className="dark:text-gray-300">
                Developer for 6 months, working on a header component for an
                entire application ecosystem with micro frontend architecture
                using TypeScript, StencilJS, Terraform, AWS, CodePipeline,
                JFrog, Verizon, and BrowserStack.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major Cash and Carry Logistic Company
              </h4>
              <p className="dark:text-gray-300">
                During a 12-month tenure as a Developer, designed and
                implemented an automated secrets loading and management system
                using Golang, Groovy, React, Redux, Cassandra, PostgreSQL,
                Kubernetes, HashiCorp Vault, Consul, Ansible, and Jenkins (4
                months), and engineered an SRE reliability monitoring tool to
                calculate and visualize service health metrics utilizing Golang,
                React, Redux, Cypress, Cassandra, ELK Stack, Kubernetes, API
                Blueprints, Docker Swarm, and Jenkins (8 months).
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Commercial Mortgage and Financial Services Firm
              </h4>
              <p className="dark:text-gray-300">
                Developer for 4 months, building a banking mobile app,
                microservices, and a build pipeline using Swift, DotNet Core,
                API Blueprints, Docker Stack, Jenkins, CentOS, Redis, ELK Stack,
                and Sonar.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major Insurance Company
              </h4>
              <p className="dark:text-gray-300">
                Developer for 4 months, building a loan application web page
                using React, Redux, Gradle, Spark Java, JWT, API Blueprints,
                PostgreSQL, Docker Stack, Terraform, GoCD Server, CoreOS, ELK
                Stack, Pinpoint, Traefik, Sonar, and Prometheus.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major Car Rental Company
              </h4>
              <p className="dark:text-gray-300">
                Developer for 1 week, building monitoring web pages with React
                and Redux for a rich interface for end users.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Healthcare Community
              </h4>
              <p className="dark:text-gray-300">
                Developer for 3 months, building a community-driven terminology
                management system with Python, Flask, Django, Grunt, AngularJS,
                PhantomJS, Docker Compose, Apache Solr, and MongoDB. Developed a
                web page and REST API to facilitate monitoring, evaluation, and
                performance improvement across healthcare and public health
                systems.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">
              Other Experience
            </h3>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major Finance and Insurance Company
              </h4>
              <p className="dark:text-gray-300">April 2015 - December 2016</p>
              <p className="dark:text-gray-300">
                Developed core banking customer portfolio web applications using
                GWT, HTML5, CSS, Twitter Bootstrap, JavaScript, JSON, and AJAX.
                Also developed core banking customer query and customer
                management SOAP web services using Java EE, Maven, Spring, SOA,
                IBM AIX, DB2, and Websphere Application Servers.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Software & Consultancy Company
              </h4>
              <p className="dark:text-gray-300">July 2011 - April 2014</p>
              <p className="dark:text-gray-300">
                Developed core banking customer query and customer management
                SOAP web services using Java EE, Maven, Spring, SOA, IBM AIX,
                DB2, and Websphere Application Servers. Also, developed a data
                management pipeline using SAS language and SAS Data Management
                Servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="skills"
        className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-300">Skills</h2>
        <div className="space-y-4 dark:text-gray-200">
          <div>
            <h3 className="font-semibold">Programming Languages:</h3>
            <p>
              Java, Golang, Python, TypeScript, JavaScript, Scala, C#, Swift,
              Bash, Groovy, Ruby, Lua, PL/SQL
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Java Specific Competencies:</h3>
            <p>
              Spring Boot, Spring Cloud, Spring Data, Spring Security, Spring
              MVC, Spark Java, Maven, Gradle, Groovy
            </p>
          </div>

          <div>
            <h3 className="font-semibold">.NET Specific Competencies:</h3>
            <p>.NET Core, Cake</p>
          </div>

          <div>
            <h3 className="font-semibold">JavaScript Specific Competencies:</h3>
            <p>
              React, Redux, TypeScript, StencilJS, Angular (2+), AngularJS,
              Jest, Cypress, PhantomJS
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Python Specific Competencies:</h3>
            <p>
              PySpark, Airflow, Dagster, DVC, MLflow, Pydantic, Asyncio,
              Aiohttp, SQLAlchemy, Polars, Jupyter Notebooks, Colab Enterprise,
              Scikit-Learn, TensorFlow, PyTorch, FastAPI, Flask, Django, Pandas,
              NumPy, Great Expectations, Deequ
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Databases:</h3>
            <p>
              PostgreSQL, Cassandra, Redis, MongoDB, Amazon Aurora, DynamoDB,
              Google BigQuery, Amazon Redshift, Memgraph, Apache Solr, DB2, MS
              SQL Server, Oracle, MemSQL, VoltDB
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Cloud & Orchestration:</h3>
            <p>
              AWS, Google Cloud Platform (GCP), Azure, Kubernetes, Helm,
              Terraform, CloudFormation, Istio, KNative, Docker, Docker Swarm
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Data Engineering:</h3>
            <p>
              Apache Spark, PySpark, Delta Lake, Parquet, Apache Airflow,
              Dagster, DVC, Great Expectations, Deequ, Databricks, Hadoop HDFS,
              Apache Hive, Apache Kafka, Apache ZooKeeper
            </p>
          </div>

          <div>
            <h3 className="font-semibold">ML Engineering:</h3>
            <p>
              TensorFlow, PyTorch, Scikit-Learn, ONNX, Kubeflow, KServe, Seldon,
              MLflow, Amazon Bedrock, Vertex AI, Amazon Comprehend Medical
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Infrastructure as Code:</h3>
            <p>Terraform, AWS CloudFormation, Ansible, Terratest</p>
          </div>

          <div>
            <h3 className="font-semibold">Observability & Monitoring:</h3>
            <p>
              Prometheus, Grafana, ELK Stack, OpenTelemetry, Jaeger, Zipkin,
              Pinpoint, Lightstep, Scalyr, DataDog, XRay
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Security & Authentication:</h3>
            <p>
              OAuth 2.0, OpenID Connect (OIDC), Keycloak, HashiCorp Vault, mTLS
              (X.509), ORY-Hydra
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Specifications & Protocols:</h3>
            <p>
              REST, gRPC, GraphQL, OpenAPI, Swagger, API Blueprints, Protobuf,
              Open Telemetry, Open Tracing, Open Census
            </p>
          </div>

          <div>
            <h3 className="font-semibold">CI/CD & Testing:</h3>
            <p>
              GitHub Actions, Jenkins, GoCD, Terraform (Terratest), Cypress,
              Jest, Selenium, SonarQube
            </p>
          </div>
        </div>
      </section>
      <JsonLd data={structuredData} />
    </div>
  );
};

export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: [
    SITE_METADATA.author,
    "lead developer",
    "professional experience",
    "programming",
    "software development",
    "AI",
    "machine learning",
    "data engineering",
    "web development",
    "IoT",
    "AWS",
    "Terraform",
    "Python",
    "Golang",
    "Kubernetes",
    "Helm",
  ],
  alternates: {
    canonical: `${SITE_METADATA.siteUrl}/me/`,
  },
  openGraph: {
    type: "profile",
    images: [`${SITE_METADATA.siteUrl}/assets/me/burakince.jpg`],
    url: `${SITE_METADATA.siteUrl}/me/`,
    title: title,
    description: description,
    emails: SITE_METADATA.email,
    siteName: description,
    locale: SITE_METADATA.locale,
    firstName: "Burak",
    lastName: "Ince",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@burakinc",
    images: [`${SITE_METADATA.siteUrl}/assets/me/burakince.jpg`],
    title,
    description,
  },
};

export default MePage;
