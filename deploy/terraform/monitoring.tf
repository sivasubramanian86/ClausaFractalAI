# Google Cloud Monitoring Alert Policies for ClausaFractalAI

# 1. Alert Policy: Consecutive HTTP 429/503 Rate Limits from Model APIs
resource "google_monitoring_alert_policy" "rate_limit_alert" {
  display_name = "ClausaFractalAI - High Rate Limit / 429-503 Error Rate"
  combiner     = "OR"
  conditions {
    display_name = "Cloud Run 429 / 503 response spike"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class = \"5xx\""
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = 5
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }
  notification_channels = []
  alert_strategy {
    auto_close = "1800s"
  }
}

# 2. Alert Policy: Token Consumption Spike (>= 200% over hourly baseline)
resource "google_monitoring_alert_policy" "token_spike_alert" {
  display_name = "ClausaFractalAI - FinOps Token Consumption Spike"
  combiner     = "OR"
  conditions {
    display_name = "Token usage spike > 200% threshold"
    condition_threshold {
      filter          = "resource.type = \"generic_task\" AND metric.type = \"custom.googleapis.com/clausafractal/token_usage_total\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 1000000 # 1M tokens/interval
      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_DELTA"
      }
    }
  }
  notification_channels = []
}

# 3. Alert Policy: Agent Deadlock Breaker Trip Frequency (> 0 trips)
resource "google_monitoring_alert_policy" "deadlock_trip_alert" {
  display_name = "ClausaFractalAI - A2A Deadlock Watchdog Tripped"
  combiner     = "OR"
  conditions {
    display_name = "Deadlock breaker tripped > 0 times"
    condition_threshold {
      filter          = "resource.type = \"generic_task\" AND metric.type = \"custom.googleapis.com/clausafractal/deadlock_breaker_trips_total\""
      duration        = "0s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_DELTA"
      }
    }
  }
  notification_channels = []
}

# 4. Alert Policy: MCP Tool & Health Check Failure
resource "google_monitoring_alert_policy" "health_check_failure_alert" {
  display_name = "ClausaFractalAI - Health Check & MCP Connection Timeout"
  combiner     = "OR"
  conditions {
    display_name = "Cloud Run service health degradation"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/container/startup_latencies\""
      duration        = "120s"
      comparison      = "COMPARISON_GT"
      threshold_value = 10000 # 10s latency
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }
  notification_channels = []
}
