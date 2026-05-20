import React, { Component } from "react";
import { Warning } from "@phosphor-icons/react";

/**
 * SafeRenderBoundary
 * ==================
 * React Error Boundary that wraps every individual AI block renderer.
 * If ANY block renderer throws during rendering, it will:
 * - Catch the error silently (no console spam in production)
 * - Render a graceful fallback UI in place of the broken block
 * - Never crash the parent chat interface
 *
 * Each block gets its OWN boundary — failures are fully isolated.
 */
export class SafeRenderBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || "Unknown error" };
  }

  componentDidCatch(error, info) {
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.warn("[AIBlock] Renderer failed gracefully:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            borderColor: "rgba(239, 68, 68, 0.2)",
            color: "rgba(239, 68, 68, 0.7)",
          }}
        >
          <Warning size={14} weight="bold" />
          <span>
            {this.props.fallbackMessage ||
              "This analytics block could not be rendered."}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * withSafeBoundary
 * =================
 * HOC that wraps any component with a SafeRenderBoundary.
 * Useful for registering components in the AI block registry.
 */
export function withSafeBoundary(Component, fallbackMessage) {
  return function SafeWrapped(props) {
    return (
      <SafeRenderBoundary fallbackMessage={fallbackMessage}>
        <Component {...props} />
      </SafeRenderBoundary>
    );
  };
}

export default SafeRenderBoundary;
