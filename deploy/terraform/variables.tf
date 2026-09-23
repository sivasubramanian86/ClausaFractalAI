variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
  default     = "genai-apac-2026-491004"
}

variable "region" {
  description = "Google Cloud Region for deployment (defaults to asia-south1 Mumbai for DPDP data residency)"
  type        = string
  default     = "asia-south1"
}

variable "service_name" {
  description = "Cloud Run service identifier"
  type        = string
  default     = "clausafractalai-mesh"
}

variable "container_image" {
  description = "Container image URI for Cloud Run deployment"
  type        = string
  default     = "gcr.io/genai-apac-2026-491004/clausafractalai:latest"
}
