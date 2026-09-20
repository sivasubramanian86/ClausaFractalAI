import { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="m-4 flex flex-col items-center justify-center p-6 rounded-2xl glass-panel border border-rose-500/40 bg-rose-950/20 text-center max-w-2xl mx-auto shadow-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 mb-3 border border-rose-500/30">
            <AlertOctagon className="h-6 w-6" aria-hidden="true" />
          </div>

          <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900">
            {this.props.fallbackTitle || "Component Render Disruption Caught"}
          </h2>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-md">
            ClausaFractalAI Error Boundary intercepted a runtime exception and prevented application crash. State can be safely re-initialized.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-legal-emerald to-legal-cyan text-obsidian-950 text-xs font-bold hover:brightness-110 shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Recover & Reload View</span>
            </button>

            <button
              type="button"
              onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-700 transition-colors"
            >
              <span>{this.state.showDetails ? "Hide Diagnostic" : "View Diagnostic"}</span>
              {this.state.showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {this.state.showDetails && (
            <div className="mt-4 w-full text-left p-3 rounded-xl bg-obsidian-950/90 border border-slate-800 text-[11px] font-mono text-rose-300 overflow-x-auto max-h-48">
              <div><strong>Error:</strong> {this.state.error?.toString()}</div>
              {this.state.errorInfo && (
                <div className="mt-2 text-slate-400 text-[10px] whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
