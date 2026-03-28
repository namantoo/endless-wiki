// ErrorBoundary — wraps ReelFeed and catches unhandled React errors.
// Must be a class component — React error boundaries require lifecycle methods.

import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message ?? String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In V2 you might log to Sentry or your observability platform here
    console.error("[Weels] Uncaught error:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="h-screen w-full flex flex-col items-center justify-center gap-6 px-8"
          style={{ background: "var(--surface-0)" }}
        >
          <div
            className="text-center space-y-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <p
              className="font-heading font-semibold"
              style={{ fontSize: "18px", color: "var(--text-primary)" }}
            >
              Something went wrong
            </p>
            <p style={{ fontSize: "14px" }}>
              Weels hit an unexpected error. Tap below to try again.
            </p>
            {this.state.errorMessage && (
              <p style={{ fontSize: "11px", fontFamily: "monospace", opacity: 0.5, marginTop: "8px", wordBreak: "break-all" }}>
                {this.state.errorMessage}
              </p>
            )}
          </div>
          <button
            onClick={this.handleRetry}
            className="font-heading font-semibold transition-opacity hover:opacity-80"
            style={{
              fontSize: "14px",
              padding: "10px 28px",
              borderRadius: "9999px",
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
