"use client";

import * as React from "react";
import { Button } from "./button";

interface QuestConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function QuestConfirmationModal({ isOpen, onConfirm, onCancel }: QuestConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface)] border border-[var(--color-secondary)]/30 rounded-3xl shadow-2xl max-w-lg w-full animate-in zoom-in-90 slide-in-from-bottom-8 duration-500">
        {/* Mystical Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--color-primary)] opacity-90" />
          <div className="absolute inset-0 opacity-20 animate-pulse" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
          
          <div className="relative p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-text-inverse)]/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-8 h-8 border-3 border-[var(--color-text-inverse)] border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-inverse)] mb-2">Quest Awaits</h2>
            <p className="text-[var(--color-text-inverse)]/80 text-sm">Your adventure is about to begin</p>
          </div>
        </div>

        {/* Warning Content */}
        <div className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-[var(--color-warning)]/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[var(--color-warning)] rounded-full flex items-center justify-center">
                <div className="w-1 h-3 bg-[var(--color-warning)] rounded-full" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
              Warning: You Must Complete This Quest
            </h3>
            
            <p className="text-[var(--color-text-muted)] leading-relaxed max-w-sm mx-auto">
              Once you accept this quest, you are bound by the ancient code of adventurers. 
              Abandoning your quest brings dishonor to your name and curses upon your lineage.
            </p>
          </div>

          <div className="p-4 bg-[var(--color-surface-secondary)] rounded-xl border border-[var(--color-border)]">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              Are you prepared to embark on this journey?
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 p-8 pt-0">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-all duration-300 transform hover:scale-105"
          >
            I'm Not Ready
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-1 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
          >
            I Accept My Fate
          </Button>
        </div>
      </div>
    </div>
  );
}