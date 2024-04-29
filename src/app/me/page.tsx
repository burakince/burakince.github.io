import { Metadata } from "next";
import Image from "next/image";
import { SITE_METADATA } from "@/lib/site-metadata";
import { Organization, Person, ProfilePage, WithContext } from "schema-dts";
import JsonLd from "../_components/json-ld";

const title = `${SITE_METADATA.author} - Lead Developer with 12+ Years Experience`;
const description =
  "Lead Developer with 12+ years of professional experience starting from 2011 and 24+ years of programming experience starting from 1999.";

const MePage = () => {
  const orgJsonLd: Organization = {
    "@type": "Organization",
    name: SITE_METADATA.worksFor,
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
    ],
    knowsAbout: [
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
              <h1 className="text-3xl font-bold dark:text-gray-300">
                Burak Ince
              </h1>
              <h2 className="text-xl text-gray-700 dark:text-gray-500">
                Lead Consultant Developer at Thoughtworks
              </h2>
            </div>
          </div>
          <div className="mt-4 dark:text-gray-300">
            <p>
              Burak works at Thoughtworks as a Lead Consultant Developer with
              over 12 years of experience in the creation of large-scale
              web-based applications and integration in distributed system
              environments. He is a seasoned Full-Stack developer with
              additional experience in more recent programming languages such as
              TypeScript and Golang. He is heavily involved in Data Engineering,
              Software Craftsmanship, consulting with companies on OO Design,
              patterns, testing techniques, functional programming, and
              development methodologies. He has a great passion for building
              evolutionary software and system architectures, new technologies,
              and infrastructure. He is currently working on creating a 3D
              object with the data coming from the RGB-D camera on the robot and
              determining the equivalent of this object on the digital twin.
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
                Let&apos;s Encrypt, Seldon, Tensorflow Serving, Prometheus
                Stack, Keycloak, and GitHub Actions. Improved Kubeflow
                installation and integrated the customer&apos;s SSO system.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold dark:text-gray-100">
                Major European Multinational Chemicals Company
              </h4>
              <p className="dark:text-gray-300">
                Data engineer for 1 year and 3 months, working on a CD4ML
                machine learning pipeline and AI platform using Golang, Python,
                Typescript, Kubernetes, Helm, Azure Cloud, Azurite, ACR,
                PostgreSQL, Terraform, DVC, Mlflow, Dagster, Great Expectations,
                REST, gRPC, GraphQL, Memgraph, Dash, ONNX, Tensorflow,
                Scikit-Learn, React, Prometheus Stack, Backstage, Azure DevOps,
                and Azure Pipelines. Contributed to the development of the main
                framework and subsections of the portal.
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
                Developer for 4 months, building an automatic secrets
                loading/managing system with Golang, Groovy, React, Redux,
                Cassandra, PostgreSQL, Kubernetes, Vault, Consul, Ansible, and
                Jenkins.
              </p>
            </div>

            <div className="mb-4">
              <p className="dark:text-gray-300">
                Developer for 8 months, building an SRE tool to calculate and
                visualize service reliability using Golang, React, Redux,
                Cypress, Cassandra, ELK Stack, Kubernetes, API Blueprints,
                Docker Stack, and Jenkins.
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
                Docker Stack, Terraform, GoCD Server, CoreOS, ELK Stack,
                Pinpoint, Traefik, Sonar, and Prometheus.
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
                management system with Python, Django, Grunt, AngularJS,
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
                IBM AIX, and Websphere Application Servers.
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
                and Websphere Application Servers. Also, developed a data
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
              Java, Go, Python, Scala, Lua, Ruby, C#, TypeScript, JavaScript,
              Bash, XML, XSL, PL/SQL
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Java Specific Competencies:</h3>
            <p>
              Spring/Spring framework, Spring Data, Security, MVC, Spring Boot,
              Spring Cloud, Spark Java, Maven, Gradle, Groovy
            </p>
          </div>

          <div>
            <h3 className="font-semibold">.NET Specific Competencies:</h3>
            <p>Cake, .Net Core</p>
          </div>

          <div>
            <h3 className="font-semibold">JavaScript Specific Competencies:</h3>
            <p>
              ReactJS, Redux, Yarn, AngularJs, Angular(version 2), Jest,
              PhantomJS, StencilJS
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Databases:</h3>
            <p>
              MS SQL Server, Oracle, JDBC, DB2, PostgreSQL, Cassandra, Redis,
              Apache Solr, MongoDB, Consul, Amazon Redshift, Google BigQuery,
              MemSQL, VoltDB, Amazon Aurora, Memgraph, DynamoDB
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Tools:</h3>
            <p>
              Make, AngularJS, Grunt, React, Redux, Gulp, NodeJS, Spring MVC,
              Gradle, Git, Nexus, HashiCorp-Vault, ELK Stack, Selenium, Cypress,
              Ansible, Terraform, SonarQube, Pinpoint, Prometheus, Jaeger,
              DataDog, Zipkin, ORY-Hydra, Continuous Deployment with GoCD,
              Jenkins, Docker Stack, Kubernetes, Scalyr, Databricks, Lightstep,
              Datadog, KNative, Istio, Dash
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Specifications:</h3>
            <p>
              Open API, Swagger, GraphQL, API Blueprints, Open Tracing, Open
              Census, Open Telemetry, Protobuffer
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Platform:</h3>
            <p>Google Cloud, AWS, Azure Cloud, Kubernetes, Docker Swarm</p>
          </div>

          <div>
            <h3 className="font-semibold">Data Engineering:</h3>
            <p>
              Apache Spark, PySpark, AWS EMR, Databricks, Hadoop HDFS, Apache
              Hive, Apache Airflow, Apache Kafka, Apache ZooKeeper, Google
              BigQuery, Amazon Redshift, Delta Lake, Parquet, Apache Avro,
              Dagster, DVC, Deequ, Great Expectations
            </p>
          </div>

          <div>
            <h3 className="font-semibold">ML Engineering:</h3>
            <p>
              Tensorflow, PyTorch, Scikit Learn, ONNX, Mlflow, Kubeflow, KServe,
              Seldon, Tensorflow Serving
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Infrastructure as Code:</h3>
            <p>Ansible, Terraform, AWS CloudFormation</p>
          </div>

          <div>
            <h3 className="font-semibold">Distributed Cache:</h3>
            <p>Apache Ignite, Hazelcast</p>
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
    canonical: `${SITE_METADATA.siteUrl}/me`,
  },
  openGraph: {
    title,
    description: description,
  },
};

export default MePage;
