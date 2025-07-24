"use client";

import * as React from "react";
import { Button } from "./button";

interface SafetyDisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function SafetyDisclaimerModal({ isOpen, onAccept, onDecline }: SafetyDisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onDecline}
      />
      
      {/* Modal */}
      <div className="relative bg-[var(--color-surface-elevated)] border-2 border-[var(--color-error)]/50 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Warning Header */}
        <div className="bg-[var(--color-primary)] p-6 rounded-t-2xl">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-[var(--color-text-inverse)]/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[var(--color-text-inverse)] rounded-full animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text-inverse)]">Safety Disclaimer</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Before embarking on your quest, please read and acknowledge the following safety guidelines:
          </p>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-[var(--color-surface-secondary)] rounded-lg border border-[var(--color-border)]">
              <div className="w-2 h-2 bg-[var(--color-error)] rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-[var(--color-text-primary)]">
                <strong>Do not engage in illegal activities.</strong> All quest activities must comply with local laws and regulations.
              </p>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-[var(--color-surface-secondary)] rounded-lg border border-[var(--color-border)]">
              <div className="w-2 h-2 bg-[var(--color-warning)] rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-[var(--color-text-primary)]">
                <strong>Be aware of your surroundings.</strong> Stay alert and prioritize your personal safety at all times.
              </p>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-[var(--color-surface-secondary)] rounded-lg border border-[var(--color-border)]">
              <div className="w-2 h-2 bg-[var(--color-warning)] rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-[var(--color-text-primary)]">
                <strong>Use common sense.</strong> If something feels unsafe or inappropriate, trust your instincts and avoid it.
              </p>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-[var(--color-surface-secondary)] rounded-lg border border-[var(--color-border)]">
              <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-[var(--color-text-primary)]">
                <strong>Don't be stupid.</strong> Think before you act and consider the consequences of your actions.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-medium">
              By proceeding, you acknowledge that you have read and understood these safety guidelines. 
              You participate in quest activities at your own risk and agree to exercise reasonable judgment 
              and caution during your adventure.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 pt-0">
          <Button
            variant="outline"
            onClick={onDecline}
            className="flex-1 border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-all duration-200"
          >
            I Decline
          </Button>
          <Button
            variant="primary"
            onClick={onAccept}
            className="flex-1 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            I Accept & Understand
          </Button>
        </div>
      </div>
    </div>
  );
}