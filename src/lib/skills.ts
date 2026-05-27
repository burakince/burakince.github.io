export type SkillCategory = {
  label: string;
  items: readonly string[];
};

// Conceptual expertise used in JSON-LD knowsAbout but not shown as tool categories
export const CORE_CONCEPTS: readonly string[] = [
  "software development",
  "full-stack development",
  "system architecture",
  "distributed systems",
  "micro-services",
  "event-driven architecture",
];

export const SKILL_CATEGORIES: readonly SkillCategory[] = [
  {
    label: "Programming Languages",
    items: [
      "Java", "Golang", "Python", "TypeScript", "JavaScript",
      "Scala", "C#", "Swift", "Bash", "Groovy", "Ruby", "Lua", "PL/SQL",
    ],
  },
  {
    label: "Java Specific Competencies",
    items: [
      "Spring Boot", "Spring Cloud", "Spring Data", "Spring Security",
      "Spring MVC", "Spark Java", "Maven", "Gradle", "Groovy",
    ],
  },
  {
    label: ".NET Specific Competencies",
    items: [".NET Core", "Cake"],
  },
  {
    label: "JavaScript Specific Competencies",
    items: [
      "React", "Redux", "TypeScript", "StencilJS",
      "Angular (2+)", "AngularJS", "Jest", "Cypress", "PhantomJS",
    ],
  },
  {
    label: "Python Specific Competencies",
    items: [
      "PySpark", "Airflow", "Dagster", "DVC", "MLflow", "Pydantic",
      "Asyncio", "Aiohttp", "SQLAlchemy", "Polars", "Jupyter Notebooks",
      "Colab Enterprise", "Scikit-Learn", "TensorFlow", "PyTorch",
      "FastAPI", "Flask", "Django", "Pandas", "NumPy",
      "Great Expectations", "Deequ",
    ],
  },
  {
    label: "Databases",
    items: [
      "PostgreSQL", "Cassandra", "Redis", "MongoDB", "Amazon Aurora",
      "DynamoDB", "Google BigQuery", "Amazon Redshift", "Memgraph",
      "Apache Solr", "DB2", "MS SQL Server", "Oracle", "MemSQL", "VoltDB",
    ],
  },
  {
    label: "Cloud & Orchestration",
    items: [
      "AWS", "Google Cloud Platform (GCP)", "Azure", "Kubernetes", "Helm",
      "Terraform", "CloudFormation", "Istio", "KNative", "Docker", "Docker Swarm",
    ],
  },
  {
    label: "Data Engineering",
    items: [
      "Apache Spark", "PySpark", "Delta Lake", "Parquet", "Apache Airflow",
      "Dagster", "DVC", "Great Expectations", "Deequ", "Databricks",
      "Hadoop HDFS", "Apache Hive", "Apache Kafka", "Apache ZooKeeper",
    ],
  },
  {
    label: "ML Engineering",
    items: [
      "TensorFlow", "PyTorch", "Scikit-Learn", "ONNX", "Kubeflow",
      "KServe", "Seldon", "MLflow", "Amazon Bedrock", "Vertex AI",
      "Amazon Comprehend Medical",
    ],
  },
  {
    label: "Infrastructure as Code",
    items: ["Terraform", "AWS CloudFormation", "Ansible", "Terratest"],
  },
  {
    label: "Observability & Monitoring",
    items: [
      "Prometheus", "Grafana", "ELK Stack", "OpenTelemetry", "Jaeger",
      "Zipkin", "Pinpoint", "Lightstep", "Scalyr", "DataDog", "XRay",
    ],
  },
  {
    label: "Security & Authentication",
    items: [
      "OAuth 2.0", "OpenID Connect (OIDC)", "Keycloak",
      "HashiCorp Vault", "mTLS (X.509)", "ORY-Hydra",
    ],
  },
  {
    label: "Specifications & Protocols",
    items: [
      "REST", "gRPC", "GraphQL", "OpenAPI", "Swagger",
      "API Blueprints", "Protobuf", "Open Telemetry",
      "Open Tracing", "Open Census",
    ],
  },
  {
    label: "CI/CD & Testing",
    items: [
      "GitHub Actions", "Jenkins", "GoCD", "Terraform (Terratest)",
      "Cypress", "Jest", "Selenium", "SonarQube",
    ],
  },
];
