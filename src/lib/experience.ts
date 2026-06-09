export type ExperienceEntry = {
  title: string;
  description: string;
};

export type ExperienceGroup = {
  heading: string;
  entries: ExperienceEntry[];
};

export const EXPERIENCE_GROUPS: ExperienceGroup[] = [
  {
    heading: "Thoughtworks Experience",
    entries: [
      {
        title: "Major Retail Energy Supply Company",
        description:
          "During a 10-month tenure as a Data Engineer, designed and implemented core RESTful API services utilizing Kubernetes, Terraform, Helm, Google Cloud Platform (GCP), CloudSQL (PostgreSQL), and TypeScript to develop customer, energy usage, and billing microservices with secure OpenID Connect (OIDC) and OAuth 2.0-based single sign-on (SSO) authentication.",
      },
      {
        title: "University Hospital",
        description:
          "During a one-month tenure as a Data Engineer, developed a proof-of-concept system leveraging Cloudformation, AWS Lambda, Python, Amazon Comprehend Medical, AWS Step Functions, Amazon S3, API Gateway, and Amazon Bedrock to automate data extraction from patient reports and images, enabling automatic identification of key medical data and matching potential clinical trials for physician review and approval.",
      },
      {
        title: "Major European Retailer of Consumer Electronics and Household Appliances",
        description:
          "During an 8-month tenure as a Data Engineer, modernized IT infrastructure and developed a Customer Data Platform on GCP BigQuery, leveraging GCP, Cloud Composer, Apache Airflow, Python, R, Colab Enterprise, Vertex AI, Kubeflow, Jupyter Notebooks, Data Contracts, IAM roles, Google Identity Platform, Terraform, Polars, Dataplex, Medallion Architecture, Cloud Storage, and Looker to establish robust data governance, platform capabilities, and actionable data products.",
      },
      {
        title: "Major Laboratory Devices and Consumables Company",
        description:
          "Infrastructure consultant for 11 months, working with C#, Golang, Typescript, Terraform, Terratest, AWS (including VPC, Lambda, Lambda Edge, Fargate, ECR, API Gateway), MQTT, HiveMQ, IoT Core, Layer 4 Network Load Balancer, Layer 7 Application Load Balancer, mTLS with X509 Certificates, DynamoDB, XRay, GitHub Actions, and AWS OIDC Providers. Developed and contributed to the MQTT server and infrastructure for secure and scalable communication between laboratory devices and the cloud.",
      },
      {
        title: "Major Automobile Manufacturer Company",
        description:
          "Data engineer for 5 months, building an AI platform for connected cars using Kubernetes, Terraform, Terratest, Helm, AWS, ECR, Amazon Aurora, Kubeflow, KServe, KNative, Istio, Let's Encrypt, Seldon, PostgreSQL, Redis, Tensorflow Serving, Prometheus Stack, Keycloak, and GitHub Actions. Improved Kubeflow installation and integrated the customer's SSO system.",
      },
      {
        title: "Major European Multinational Chemicals Company",
        description:
          "Data engineer for 1 year and 3 months, working on a CD4ML machine learning pipeline and AI platform using Golang, Python, Asyncio, Aiohttp, Pydantic, FastAPI, SQLAlchemy, Typescript, Kubernetes, Helm, Azure Cloud, Azurite, ACR, PostgreSQL, Terraform, DVC, Mlflow, Dagster, Great Expectations, REST, gRPC, GraphQL, Memgraph, Dash, ONNX, Tensorflow, Scikit-Learn, React, Prometheus Stack, Backstage, Azure DevOps, and Azure Pipelines. Contributed to the development of the main framework and subsections of the portal.",
      },
      {
        title: "Major Energy Logistics and Chemicals Company",
        description:
          "Lead consultant developer for 1 month, conducting an architecture and technology review for in-house developed trading software. Examined various architectural classifications (monolithic and distributed) with the team and decided on approaches to solve problems.",
      },
      {
        title: "Major European e-Commerce Company",
        description:
          "Data engineer for 9 months, building a fast serving layer using Amazon Redshift, Apache Spark, PySpark, Parquet, Delta Lake, Scala, Python, Google BigQuery, Apache Airflow, Databricks, Deequ, Amazon S3, AWS CloudFormation, Flyway, PostgreSQL, Java, Spring Boot, Open API, Open Telemetry, Kubernetes, Scalyr, Lightstep, and Grafana. Helped ingest data from different systems and optimize the data pipeline.",
      },
      {
        title: "Major Automobile Manufacturer Company",
        description:
          "Developer for 6 months, working on a header component for an entire application ecosystem with micro frontend architecture using TypeScript, StencilJS, Terraform, AWS, CodePipeline, JFrog, Verizon, and BrowserStack.",
      },
      {
        title: "Major Cash and Carry Logistic Company",
        description:
          "During a 12-month tenure as a Developer, designed and implemented an automated secrets loading and management system using Golang, Groovy, React, Redux, Cassandra, PostgreSQL, Kubernetes, HashiCorp Vault, Consul, Ansible, and Jenkins (4 months), and engineered an SRE reliability monitoring tool to calculate and visualize service health metrics utilizing Golang, React, Redux, Cypress, Cassandra, ELK Stack, Kubernetes, API Blueprints, Docker Swarm, and Jenkins (8 months).",
      },
      {
        title: "Commercial Mortgage and Financial Services Firm",
        description:
          "Developer for 4 months, building a banking mobile app, microservices, and a build pipeline using Swift, DotNet Core, API Blueprints, Docker Stack, Jenkins, CentOS, Redis, ELK Stack, and Sonar.",
      },
      {
        title: "Major Insurance Company",
        description:
          "Developer for 4 months, building a loan application web page using React, Redux, Gradle, Spark Java, JWT, API Blueprints, PostgreSQL, Docker Stack, Terraform, GoCD Server, CoreOS, ELK Stack, Pinpoint, Traefik, Sonar, and Prometheus.",
      },
      {
        title: "Major Car Rental Company",
        description:
          "Developer for 1 week, building monitoring web pages with React and Redux for a rich interface for end users.",
      },
      {
        title: "Healthcare Community",
        description:
          "Developer for 3 months, building a community-driven terminology management system with Python, Flask, Django, Grunt, AngularJS, PhantomJS, Docker Compose, Apache Solr, and MongoDB. Developed a web page and REST API to facilitate monitoring, evaluation, and performance improvement across healthcare and public health systems.",
      },
    ],
  },
  {
    heading: "Other Experience",
    entries: [
      {
        title: "Major Finance and Insurance Company",
        description:
          "April 2015 – December 2016. Developed core banking customer portfolio web applications using GWT, HTML5, CSS, Twitter Bootstrap, JavaScript, JSON, and AJAX. Also developed core banking customer query and customer management SOAP web services using Java EE, Maven, Spring, SOA, IBM AIX, DB2, and Websphere Application Servers.",
      },
      {
        title: "Software & Consultancy Company",
        description:
          "July 2011 – April 2014. Developed core banking customer query and customer management SOAP web services using Java EE, Maven, Spring, SOA, IBM AIX, DB2, and Websphere Application Servers. Also, developed a data management pipeline using SAS language and SAS Data Management Servers.",
      },
    ],
  },
];
