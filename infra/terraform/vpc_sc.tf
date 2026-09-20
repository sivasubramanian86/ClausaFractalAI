# VPC Service Controls (VPC-SC) Perimeter Configuration for ClausaFractalAI
# Protects sensitive legal contracts and AI inference from unauthorized exfiltration

variable "access_policy_id" {
  type        = string
  description = "Access Context Manager Policy ID"
  default     = "123456789012"
}

resource "google_access_context_manager_service_perimeter" "clausa_perimeter" {
  parent = "accessPolicies/${var.access_policy_id}"
  name   = "accessPolicies/${var.access_policy_id}/servicePerimeters/clausa_fractal_legal_perimeter"
  title  = "ClausaFractalAI Zero-Trust Legal Data Perimeter"

  status {
    restricted_services = [
      "aiplatform.googleapis.com",
      "bigquery.googleapis.com",
      "firestore.googleapis.com",
      "storage.googleapis.com"
    ]

    resources = [
      "projects/${var.project_id}"
    ]

    access_levels = []

    vpc_accessible_services {
      enable_restriction = true
      allowed_services = [
        "aiplatform.googleapis.com",
        "bigquery.googleapis.com",
        "firestore.googleapis.com",
        "logging.googleapis.com"
      ]
    }
  }
}
