output "cloud_run_service_uri" {
  description = "Public URL of the deployed ClausaFractalAI Neuro-Symbolic microservice"
  value       = google_cloud_run_v2_service.mesh_service.uri
}

output "redis_host" {
  description = "Private IP of Memorystore Redis instance"
  value       = google_redis_instance.finops_cache.host
}

output "service_account_email" {
  description = "Service account email executing the agent mesh"
  value       = google_service_account.mesh_sa.email
}
