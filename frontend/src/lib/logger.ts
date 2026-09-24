/**
 * Enterprise Frontend Structured Logger & W3C Distributed Trace Correlation.
 *
 * Implements structured JSON logging in the browser correlated with Google Cloud Trace
 * via W3C traceparent headers (00-{traceId}-{spanId}-01).
 */

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  trace_id: string;
  span_id: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

let activeTraceId = generateHex(32);
let activeSpanId = generateHex(16);

function generateHex(length: number): string {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function getCurrentTraceId(): string {
  return activeTraceId;
}

export function resetActiveTraceId(): string {
  activeTraceId = generateHex(32);
  activeSpanId = generateHex(16);
  return activeTraceId;
}

export function getW3CTraceparent(): string {
  activeSpanId = generateHex(16);
  return `00-${activeTraceId}-${activeSpanId}-01`;
}

class FrontendLogger {
  private inMemoryLogs: LogEntry[] = [];
  private maxLogs = 500;

  private emit(
    level: LogLevel,
    component: string,
    message: string,
    data?: Record<string, unknown>,
    errorObj?: Error | unknown
  ): LogEntry {
    let errorDetail: LogEntry["error"] | undefined;

    if (errorObj instanceof Error) {
      errorDetail = {
        name: errorObj.name,
        message: errorObj.message,
        stack: errorObj.stack,
      };
    } else if (errorObj && typeof errorObj === "object") {
      errorDetail = {
        name: "UnknownError",
        message: JSON.stringify(errorObj),
      };
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      trace_id: activeTraceId,
      span_id: activeSpanId,
      data,
      error: errorDetail,
    };

    this.inMemoryLogs.push(entry);
    if (this.inMemoryLogs.length > this.maxLogs) {
      this.inMemoryLogs.shift();
    }

    const formattedMessage = `[${entry.timestamp}] [${level}] [${component}] ${message} (trace_id=${entry.trace_id})`;

    switch (level) {
      case "DEBUG":
        console.debug(formattedMessage, data ?? "");
        break;
      case "INFO":
        console.info(formattedMessage, data ?? "");
        break;
      case "WARN":
        console.warn(formattedMessage, data ?? "");
        break;
      case "ERROR":
        console.error(formattedMessage, errorDetail ?? data ?? "");
        break;
    }

    return entry;
  }

  debug(component: string, message: string, data?: Record<string, unknown>): LogEntry {
    return this.emit("DEBUG", component, message, data);
  }

  info(component: string, message: string, data?: Record<string, unknown>): LogEntry {
    return this.emit("INFO", component, message, data);
  }

  warn(component: string, message: string, data?: Record<string, unknown>): LogEntry {
    return this.emit("WARN", component, message, data);
  }

  error(
    component: string,
    message: string,
    errorObj?: Error | unknown,
    data?: Record<string, unknown>
  ): LogEntry {
    return this.emit("ERROR", component, message, data, errorObj);
  }

  getLogs(): LogEntry[] {
    return [...this.inMemoryLogs];
  }

  clearLogs(): void {
    this.inMemoryLogs = [];
  }
}

export const logger = new FrontendLogger();
