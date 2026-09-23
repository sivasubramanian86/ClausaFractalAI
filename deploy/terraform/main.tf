terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.30.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. IAM Least Privilege Service Account for Agent Mesh
resource "google_service_account" "mesh_sa" {
  account_id   = "clausafractal-mesh-sa"
  display_name = "ClausaFractalAI Neuro-Symbolic Runtime SA"
}

# Grant Vertex AI user role for Gemini Flash/Pro invocation
resource "google_project_iam_member" "vertex_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.mesh_sa.email}"
}

# Grant Cloud Trace Agent for W3C distributed tracing
resource "google_project_iam_member" "trace_agent" {
  project = var.project_id
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.mesh_sa.email}"
}

# 2. Google Cloud Memorystore for Redis (FinOps L1/L2 Cache)
resource "google_redis_instance" "finops_cache" {
  name           = "clausafractal-finops-redis"
  tier           = "BASIC"
  memory_size_gb = 1
  region         = var.region

  redis_version     = "REDIS_7_0"
  display_name      = "ClausaFractalAI FinOps Cache"
  connect_mode      = "DIRECT_PEERING"
  authorized_network = "projects/${var.project_id}/global/networks/default"
}

# 3. Google Cloud Run v2 Service (gVisor Non-Root Container)
resource "google_cloud_run_v2_service" "mesh_service" {
  name     = var.service_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.mesh_sa.email

    scaling {
      min_instance_count = 1
      max_instance_count = 10
    }

    containers {
      image = var.container_image

      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
      }

      env {
        name  = "ENVIRONMENT"
        value = "production"
      }
      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "ENABLE_CLOUD_TRACE"
        value = "true"
      }
      env {
        name  = "REDIS_URL"
        value = "redis://${google_redis_instance.finops_cache.host}:${google_redis_instance.finops_cache.port}/0"
      }

      ports {
        container_port = 8000
      }

      startup_probe {
        http_get {
          path = "/health"
          port = 8000
        }
        initial_delay_seconds = 5
        period_seconds        = 10
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/health"
          port = 8000
        }
        period_seconds = 30
      }
    }
  }

  depends_on = [
    google_project_iam_member.vertex_user,
    google_project_iam_member.trace_agent,
    google_redis_instance.finops_cache,
  ]
}

# Allow unauthenticated invocation for hackathon API demonstration
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.mesh_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
