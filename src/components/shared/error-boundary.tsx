"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/styles/animations";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-foreground">
            Something went wrong
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {this.state.error?.message ?? "An unexpected error occurred. Please try again."}
          </p>
          <Button
            variant="outline"
            onClick={this.handleReset}
            className="mt-6 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
