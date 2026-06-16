---
title: "MLOps: A Practical Guide for Software and DevOps Engineers"
excerpt: "MLOps brings software engineering discipline to machine learning. Learn what it is, why it matters, and how to apply CI/CD, model versioning, monitoring, and more to ship reliable ML systems."
date: "2026-05-27T09:00:00.000Z"
lastModified: "2026-06-16T16:02:05.000Z"
tags:
  - mlops
  - machine-learning
  - devops
  - cicd
---

If you have spent time shipping production software, you already know that writing code is only a fraction of the job. Testing, deploying, monitoring, rolling back: these are the unglamorous practices that turn a promising prototype into a reliable product. Machine learning is no different, yet for years the field treated those concerns as afterthoughts. MLOps exists to fix that.

This post is aimed at software developers and DevOps engineers who are either joining an ML-adjacent team, building infrastructure for data scientists, or beginning to integrate ML models into their existing systems. It assumes you are comfortable with CI/CD and containerization but may be new to the specific challenges machine learning introduces.

## What is MLOps?

MLOps (Machine Learning Operations) is the set of practices, tools, and cultural norms that bring software engineering discipline to the full lifecycle of a machine learning system, from data ingestion through model training, evaluation, deployment, and ongoing monitoring.

The term is intentionally analogous to DevOps. Just as DevOps bridged the gap between development and operations teams, MLOps bridges the gap between data science and engineering. The goal is the same: faster, safer, more repeatable delivery of software. The difference is that "software" now includes statistical models whose behaviour is shaped by data rather than explicit logic.

A useful mental model: treat a trained model as an artifact, the same way you would treat a compiled binary or a Docker image. It was produced by a process (training), it has inputs and outputs, it needs to be versioned, tested, deployed, and observed in production. MLOps provides the scaffolding to manage that artifact responsibly.

## Why it matters more than you might expect

It is tempting to assume that once a model is trained and wrapped in a Flask endpoint, the hard part is done. In practice, several failure modes turn up that are unique to ML systems.

Data drift is the one that tends to surprise people the most. The statistical properties of incoming data change over time, silently degrading model accuracy without triggering any exception. A fraud detection model trained on 2023 transaction patterns may quietly become less effective by 2025 as attacker behaviour evolves. No alert fires. The model just gets worse.

Training-serving skew is subtler and often harder to diagnose. The features fed to the model during training are computed differently from those computed at inference time, introducing bugs that are extremely hard to trace without explicit tooling.

Reproducibility gaps are frustrating in a different way. A data scientist re-runs an experiment six months later and gets different results because the dataset was mutated in place, the random seed was not fixed, or a library version silently changed. Debugging becomes archaeology.

Hidden feedback loops are the most insidious of all. Model predictions influence user behaviour, which changes future training data, which changes the model. Without careful monitoring you may not notice the loop until the model has drifted far from its original intent.

None of these are exotic edge cases. They show up in production regularly and they are expensive when left unaddressed. MLOps is the discipline that makes them detectable and recoverable.

## The core practices

### 1. Version everything

In classical software, `git` handles versioning. In ML you have three additional artifacts that need versioning alongside code: data, model weights, and experiment configuration.

[DVC](https://dvc.org/) and [LakeFS](https://lakefs.io/) work like git for large files and datasets. DVC stores lightweight pointer files in git while pushing the actual data to object storage (S3, GCS, Azure Blob). This means you can check out any historical commit and reproduce the exact dataset that produced a given model.

```bash
# Track a dataset with DVC
dvc add data/training_set.parquet
git add data/training_set.parquet.dvc .gitignore
git commit -m "Add training dataset v1"
dvc push
```

[MLflow](https://mlflow.org/) and [Weights & Biases](https://wandb.ai/) log hyperparameters, metrics, and artefacts for every training run, giving you a searchable audit trail. When someone asks "which run produced the model currently in production?", you want to answer that immediately rather than digging through Slack history.

```python
import mlflow

mlflow.set_experiment("fraud-detection")

with mlflow.start_run():
    mlflow.log_param("learning_rate", 0.001)
    mlflow.log_param("max_depth", 6)
    # ... training code ...
    mlflow.log_metric("auc_roc", 0.94)
    mlflow.sklearn.log_model(model, "model")
```

A model registry (MLflow Model Registry, [Hugging Face Hub](https://huggingface.co/), Vertex AI Model Registry) records the lineage from training run to deployed model and manages lifecycle stages: Staging, Production, Archived.

### 2. MLflow model lineage and state management

This is the thing most teams skip until they get burned by it. You have a model in production. Accuracy has been dropping for two weeks. Someone asks: "What data did this model train on, and which git commit?" Nobody knows. The MLflow UI has seventeen runs with no indication of which one is live. This is entirely avoidable.

The MLflow Model Registry is not just a deployment mechanism. Used properly, it is an audit trail that links every production model back to the exact code, data, and hyperparameters that produced it.

#### Registry states and what they actually mean

The registry has three lifecycle stages: Staging, Production, and Archived.

Staging is not just "pre-production". It is where a model version has passed automated evaluation and is waiting for human review or shadow testing. Your CI pipeline should move a model to Staging automatically when it meets the quality gate. A human (or a canary deploy process) then decides whether to promote it further.

Production is the authoritative marker of what is live. Only one version of a given model name should be in Production at a time. When you promote a new version, move the old one to Archived rather than leaving multiple versions in Production simultaneously. Teams that skip that discipline lose track of which version is actually serving traffic, and that confusion shows up at the worst possible moment.

Archived means retired, not deleted. You can still load an Archived model, inspect its run, and compare its metrics. Six months from now, when you need to understand why the model that served traffic in March 2025 behaved the way it did, Archived gives you that history. The transitions also create a timestamped paper trail: every promotion records when it happened, and if you use the client API, which pipeline or person triggered it. That is the kind of record that makes incident retrospectives survivable.

#### Logging lineage at training time

The traceability chain only works if you populate it during training. Two tags give you everything: the git commit hash of the training code and the DVC content hash of the dataset. Both are available without manual input.

```python
import subprocess
import yaml
import mlflow

def get_git_commit() -> str:
    return subprocess.check_output(
        ["git", "rev-parse", "HEAD"], text=True
    ).strip()

def get_dvc_data_hash(dvc_file: str) -> str:
    with open(dvc_file) as f:
        meta = yaml.safe_load(f)
    return meta["outs"][0]["md5"]

mlflow.set_experiment("fraud-detection")

with mlflow.start_run() as run:
    mlflow.set_tag("git_commit", get_git_commit())
    mlflow.set_tag("dvc_data_hash", get_dvc_data_hash("data/training_set.parquet.dvc"))
    mlflow.set_tag("dvc_file", "data/training_set.parquet.dvc")

    mlflow.log_param("learning_rate", 0.001)
    mlflow.log_param("max_depth", 6)

    # ... training code ...

    mlflow.log_metric("auc_roc", 0.94)
    mlflow.log_metric("precision", 0.91)
    mlflow.log_metric("recall", 0.88)

    mlflow.sklearn.log_model(
        model,
        artifact_path="model",
        registered_model_name="fraud-detector",
    )
```

Every run now carries a pointer back to the exact state of the repository and dataset that produced it. The `git_commit` tag gives you the code; `dvc_data_hash` gives you the data. Together they are enough to reproduce the training job from scratch on any machine.

#### Promoting to production and retrieving lineage

Once a model clears evaluation in Staging, promote it via the MLflow client and pull the lineage in the same pipeline step.

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()
model_name = "fraud-detector"

# Promote the latest Staging version to Production
staging_versions = client.get_latest_versions(model_name, stages=["Staging"])
if not staging_versions:
    raise RuntimeError("No model version in Staging to promote")

latest = staging_versions[0]
client.transition_model_version_stage(
    name=model_name,
    version=latest.version,
    stage="Production",
    archive_existing_versions=True,  # moves the previous Production version to Archived
)
print(f"Promoted version {latest.version} to Production")

# Retrieve lineage for the current Production model
prod_versions = client.get_latest_versions(model_name, stages=["Production"])
prod = prod_versions[0]

run = client.get_run(prod.run_id)
git_commit = run.data.tags.get("git_commit", "not logged")
dvc_hash   = run.data.tags.get("dvc_data_hash", "not logged")
dvc_file   = run.data.tags.get("dvc_file", "not logged")

print(f"Production model : version {prod.version}")
print(f"  MLflow run ID  : {prod.run_id}")
print(f"  git commit     : {git_commit}")
print(f"  DVC file       : {dvc_file}")
print(f"  DVC data hash  : {dvc_hash}")
print(f"  Training AUC   : {run.data.metrics.get('auc_roc')}")
```

Running this against your MLflow server answers the most common incident question without opening a browser. To restore the exact environment that produced the live model:

```bash
# Restore the exact training code
git checkout <git_commit>

# Restore the exact training dataset
dvc checkout data/training_set.parquet.dvc
```

Given a model version in Production, those two commands return you to the precise state the world was in when that model was built.

#### Backtracking performance drift

When production accuracy drops, the first question is whether you are looking at a data distribution problem or a code regression. The lineage trail helps you answer that quickly rather than spending days on the wrong hypothesis.

Pull the training metrics from the originating run and compare them against what your monitoring system is reporting today.

```python
prod_versions = client.get_latest_versions("fraud-detector", stages=["Production"])
run = client.get_run(prod_versions[0].run_id)
training_metrics = run.data.metrics

print("Metrics at training time:")
for k, v in training_metrics.items():
    print(f"  {k}: {v:.4f}")

# Compare against live monitoring data
live_auc = fetch_live_auc_from_monitoring()  # your implementation here

gap = training_metrics["auc_roc"] - live_auc
print(f"\nTraining AUC  : {training_metrics['auc_roc']:.4f}")
print(f"Production AUC: {live_auc:.4f}")
print(f"Gap           : {gap:.4f}")

if gap > 0.05:
    print("Significant degradation. Check drift report and input feature distributions.")
```

A large gap between training AUC and production AUC means the model is underperforming its own evaluation. If your drift report shows that input feature distributions have shifted, data drift is the likely cause. If the distributions look stable, something changed in the code path between training and serving: a preprocessing step, a feature computation, a library version. That is when you check the git commit and start diffing.

This diagnosis is only possible because you kept the training metrics and lineage together. Without them, you are guessing.

#### The full traceability picture

Every production model should resolve to a triplet: MLflow run ID, git commit hash, DVC data hash.

The run ID gives you the hyperparameters, evaluation metrics, and the registered model version. The git commit gives you the exact training code, library lock file, and Dockerfile. The DVC hash gives you the exact training dataset. From those three you can rebuild the model from scratch, verify its evaluation numbers, or audit what a model was doing at any point in its production lifetime.

Teams that skip this find out why it matters when a regulator asks for documentation, a model behaves unexpectedly, or a key engineer leaves and takes the context with them. Setting up the tags takes about ten lines of code. It is one of the best returns on investment in the entire MLOps stack.

### 3. Build reproducible training pipelines

A training pipeline should be a first-class piece of software: version-controlled, tested, and runnable by anyone on the team with a single command. Two properties are non-negotiable.

Fix all random seeds, pin all library versions in a lock file, and document any non-deterministic steps. If the same inputs always produce the same outputs, debugging becomes dramatically easier.

Wrap your training environment in a Docker image. This eliminates "works on my laptop" problems and makes it straightforward to run training on a cloud GPU without manual environment setup.

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.lock .
RUN pip install --no-cache-dir -r requirements.lock

COPY src/ ./src/
ENTRYPOINT ["python", "-m", "src.train"]
```

Pipeline orchestration tools like [Apache Airflow](https://airflow.apache.org/), [Prefect](https://www.prefect.io/), [Kubeflow Pipelines](https://www.kubeflow.org/docs/components/pipelines/), and [ZenML](https://www.zenml.io/) let you define training as a DAG of steps with explicit inputs, outputs, caching, and retry logic, the same way you would define a CI pipeline.

### 4. CI/CD for machine learning

Classic CI/CD runs lint, tests, and builds an artifact on every commit. ML CI/CD does all of that plus validates data, tests model quality, and gates promotion based on evaluation metrics.

A minimal ML CI pipeline might look like this:

```yaml
# .github/workflows/ml-ci.yml
name: ML CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  validate-and-train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Pull data
        run: dvc pull

      - name: Run data validation
        run: python -m src.validate_data

      - name: Train model
        run: python -m src.train

      - name: Evaluate model
        run: python -m src.evaluate --threshold 0.90

      - name: Register model if threshold met
        if: github.ref == 'refs/heads/main'
        run: python -m src.register_model
```

The main difference from a standard CI pipeline is the quality gate: training succeeds as a process, but the model is only promoted if it meets a defined evaluation threshold. This prevents accidentally deploying a degraded model after a data or code change.

CD for ML typically involves deploying to a shadow or canary environment first, routing a small fraction of real traffic to the new model while comparing its predictions to the incumbent. Only after the canary metrics look healthy does the rollout proceed.

### 5. Feature stores

One of the most insidious sources of training-serving skew is independently computing features in the training pipeline and in the inference service. A feature store solves this by providing a single source of truth for feature computation, with a low-latency online store for serving and a high-throughput offline store for training.

Popular options include [Feast](https://feast.dev/), [Tecton](https://www.tecton.ai/), [Hopsworks](https://www.hopsworks.ai/), and the feature stores built into Vertex AI and SageMaker.

Feature stores are genuinely useful but also genuinely heavy. If you are not yet at the scale where training-serving skew is causing real production incidents, start smaller: define feature transformations once, in a shared library, and import that library from both your training code and your serving code. You get most of the benefit with a fraction of the operational overhead.

### 6. Model serving patterns

How you deploy a model depends on your latency and throughput requirements.

Synchronous REST/gRPC endpoints are the most familiar pattern. Tools like [BentoML](https://www.bentoml.com/), [Ray Serve](https://docs.ray.io/en/latest/serve/), and [Triton Inference Server](https://developer.nvidia.com/triton-inference-server) handle the packaging, batching, and scaling concerns. For simpler models, wrapping with FastAPI works fine.

Batch inference is appropriate when predictions do not need to be real-time, like recommendation pre-computation or overnight risk scoring. A scheduled pipeline reads records, runs inference, and writes results to a database or object store.

Streaming inference uses a message queue (Kafka, Pub/Sub) as the trigger. Events arrive, are enriched with features, run through the model, and predictions are published to a downstream topic.

#### KServe: Kubernetes-native model serving

If your organisation already runs workloads on Kubernetes, [KServe](https://kserve.github.io/website/) (formerly KFServing) is worth a look. It is a CNCF project that extends Kubernetes with a purpose-built model-serving layer. The appeal is straightforward: you get canary rollouts, autoscaling, and explainability without wiring them up yourself.

The central idea is that serving a model should feel as natural as deploying any other workload. Instead of writing Deployment manifests, Service definitions, HPA configs, and canary Ingress rules by hand, you declare an `InferenceService` resource and KServe handles the rest.

```yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: fraud-detector
  namespace: ml-serving
spec:
  predictor:
    sklearn:
      storageUri: s3://ml-models/fraud-detector/v3
      resources:
        requests:
          cpu: "500m"
          memory: "512Mi"
        limits:
          cpu: "1"
          memory: "1Gi"
  transformer:
    containers:
      - name: feature-transformer
        image: myregistry/fraud-feature-transformer:1.2.0
        resources:
          requests:
            cpu: "200m"
            memory: "256Mi"
```

KServe fetches the model artefact from object storage at startup, spins up a pre-built serving container for the framework you specified (`sklearn`, `tensorflow`, `pytorch`, `xgboost`, `huggingface`, and others), and exposes a predict endpoint, with no custom Dockerfile required.

Canary rollouts are a first-class primitive. Set `canaryTrafficPercent` on a new revision and KServe splits traffic between the current and candidate model automatically. You inspect metrics, then promote or roll back by updating a single field rather than juggling multiple Deployments and Ingress weights.

```yaml
spec:
  predictor:
    canaryTrafficPercent: 10
    sklearn:
      storageUri: s3://ml-models/fraud-detector/v4
```

Autoscaling integrates with Knative Serving (scale-to-zero on inactivity) and KEDA (event-driven scaling based on queue depth or custom metrics). For GPU-backed models this matters a lot: the pod scales down when traffic drops and back up when requests arrive, so you are not paying for idle accelerator time.

Explainability is available via built-in Alibi explainers. Attach an `explainer` block to your `InferenceService` and KServe spins up an Alibi sidecar that returns SHAP values or counterfactual explanations on a separate `/explain` endpoint, alongside the standard `/predict` endpoint, with no extra service to deploy or maintain.

The default wire format is the Open Inference Protocol (data plane v2), also supported by Triton, MLflow, and BentoML. Your client code, load-testing scripts, and monitoring probes work against any v2-compliant server, not just KServe. That matters if you ever want to swap serving backends without rewriting your tooling.

One caveat worth naming: KServe is powerful but adds real operational complexity. If you are not already running Kubernetes in production, it is probably not where you start. Get comfortable with a simpler serving pattern first.

Whatever serving pattern you choose, make sure your infrastructure emits structured logs for every prediction with the input features, the prediction, a confidence score, and a request ID. You will need these logs for monitoring.

### 7. Model monitoring

Deploying a model is not the finish line. Production models need ongoing observation across at least three dimensions.

Operational metrics (latency, error rate, throughput) are the same metrics you monitor for any service. Your existing APM tooling (Datadog, Grafana, etc.) handles them out of the box.

Data drift is where ML-specific monitoring starts. Compare the statistical distribution of incoming features against the training distribution. A sudden shift in the mean or variance of an input feature is a leading indicator of degraded model performance. Libraries like [Evidently AI](https://www.evidentlyai.com/) and [WhyLogs](https://whylogs.ai/) make this straightforward to set up.

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=training_df, current_data=production_df)
report.save_html("drift_report.html")
```

If you can collect ground truth labels (even with delay), track your business metrics over time. For a fraud model, this means comparing flagged transactions against confirmed fraud outcomes. Set up alerts when performance drops below the threshold your evaluation pipeline uses to gate deployment.

Define a retraining policy upfront: retraining on a schedule (weekly, monthly), on drift detection, or when performance metrics cross a threshold. Treat retraining as a normal operational event, not an emergency.

### 8. Testing for ML systems

Testing ML systems requires a broader definition of "correctness" than unit tests alone provide.

Unit tests still apply to data transformation functions, feature engineering logic, and pre/post-processing code. These are deterministic and fast.

Data validation tests check that incoming data conforms to expected schemas, value ranges, and statistical properties. [Great Expectations](https://greatexpectations.io/) and [Pandera](https://pandera.readthedocs.io/) are popular choices.

```python
import pandera as pa
from pandera import Column, DataFrameSchema

schema = DataFrameSchema({
    "age": Column(int, pa.Check.between(0, 120)),
    "income": Column(float, pa.Check.greater_than(0)),
    "label": Column(int, pa.Check.isin([0, 1])),
})

validated_df = schema.validate(training_df)
```

Model behavioural tests (sometimes called "slice tests") check that the model performs acceptably across important subgroups of the data. For example, that a credit scoring model does not exhibit significantly different accuracy across demographic groups. Failing these tests before deployment is far cheaper than addressing bias complaints after launch.

Integration tests spin up the full serving stack against a fixture dataset and verify that predictions are returned within SLA, that the API schema is correct, and that the model produces expected outputs on known inputs.

## Practical starting points

You do not need to adopt every practice above at once. A sensible progression:

1. Add MLflow or W&B to your training scripts this week. Experiment tracking costs almost nothing to set up and immediately gives you an audit trail and reproducibility.

2. Write a `Dockerfile` for your training environment and add a `make train` target that runs it. This alone eliminates a huge class of environment bugs.

3. Add a quality gate to CI. Before merging any change that touches training code or data, run a fast evaluation and fail the build if metrics regress.

4. Instrument your serving endpoint. Log inputs, outputs, and latency for every prediction request. Without this data, monitoring is impossible.

5. Set a drift alert. Once you have production prediction logs, compute a weekly drift report and alert if it crosses a threshold.

6. Introduce a model registry. Use it to record exactly which training run produced each deployed model. Link it to your CI pipeline so promotion requires a passing evaluation.

## Tooling landscape

The MLOps ecosystem is large and evolving quickly. Here is a quick orientation:

| Category | Open-source options | Managed options |
|---|---|---|
| Experiment tracking | MLflow, DVC | W&B, Comet ML |
| Pipeline orchestration | Airflow, Prefect, ZenML | Vertex AI Pipelines, SageMaker Pipelines |
| Model registry | MLflow | Hugging Face Hub, Vertex AI |
| Feature store | Feast | Tecton, Hopsworks, Vertex AI |
| Model serving | BentoML, Ray Serve, Triton, KServe | SageMaker, Vertex AI, Azure ML |
| Monitoring | Evidently AI, WhyLogs | Arize, Fiddler |
| Data versioning | DVC, LakeFS | -- |

For a team just starting out, the simplest viable stack is: **DVC + MLflow + GitHub Actions + FastAPI + Evidently AI**. Everything is open-source, runs locally, and integrates without vendor lock-in.

## Closing thoughts

MLOps is the application of engineering fundamentals to a domain where those fundamentals were historically undervalued. If you already think carefully about reproducibility, observability, and deployment safety in your regular software work, you have most of the instincts you need.

I would not reach for the full stack all at once. Start with experiment tracking and a quality gate in CI. Get those habits established, then add monitoring. Add a feature store when skew is actually causing problems, not before.

The most common mistake I see is teams shipping a model to production with no observability, discovering months later that it has quietly degraded, and having no data to diagnose why. A few hours of instrumentation before launch saves a lot of painful archaeology later.
