# Terraform IAM Least-Privilege Configurations for ClausaFractalAI
# Enforces APAC 2026 Zero-Trust Architecture for Google Cloud Platform

terraform {
  required_version = ">= 1.8.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.30"
    }
  }
}

variable "project_id" {
  type        = string
  description = "Google Cloud Project ID for ClausaFractalAI"
  default     = "genai-apac-2026-491004"
}

# 1. Orchestrator Service Account (Vertex AI, Secret Manager, Cloud Run)
resource "google_service_account" "orchestrator_sa" {
  account_id   = "clausa-orchestrator-sa"
  display_name = "ClausaFractalAI Multi-Agent Orchestrator Service Account"
  description  = "Executes Vertex AI Gemini 3.8 inference, Context Caching, and Multi-Agent State Graph"
  project      = var.project_id
}

resource "google_project_iam_member" "orchestrator_aiplatform" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.orchestrator_sa.email}"
}

resource "google_project_iam_member" "orchestrator_firestore" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.orchestrator_sa.email}"
}

resource "google_project_iam_member" "orchestrator_secrets" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.orchestrator_sa.email}"
}

# 2. Compliance Auditor & BigQuery Telemetry Service Account
resource "google_service_account" "auditor_sa" {
  account_id   = "clausa-auditor-sa"
  display_name = "ClausaFractalAI Compliance & Analytics Auditor SA"
  description  = "Streams query telemetry and hallucination benchmark audit events into BigQuery"
  project      = var.project_id
}

resource "google_project_iam_member" "auditor_bigquery_data_editor" {
  project = var.project_id
  role    = "roles/bigquery.dataEditor"
  member  = "serviceAccount:${google_service_account.auditor_sa.email}"
}

resource "google_project_iam_member" "auditor_bigquery_job_user" {
  project = var.project_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.auditor_sa.email}"
}

resource "google_project_iam_member" "auditor_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.auditor_sa.email}"
}
