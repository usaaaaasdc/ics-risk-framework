
/**
 * ICS-Risk Framework - Markov Chain Engine
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Implements Discrete Time Markov Chain (DTMC) to predict attack progression.
 * 
 * Transition probabilities are externalized to lib/constants/markov-parameters.ts
 * for maintainability and academic rigor (see NIST SP 800-82 citations).
 */

import {
    BASE_PROB_SECURE_TO_RECON,
    SCALE_PROB_SECURE_TO_RECON,
    BASE_PROB_RECON_TO_EXPLOIT,
    SCALE_PROB_RECON_TO_EXPLOIT,
    PROB_RECON_TO_SECURE,
    BASE_PROB_EXPLOIT_TO_COMPROMISED,
    SCALE_PROB_EXPLOIT_TO_COMPROMISED,
    PROB_EXPLOIT_TO_RECON,
    PROBABILITY_TOLERANCE,
} from '../constants/markov-parameters';

export type ManualSecurityState = 'Secure' | 'Reconnaissance' | 'Exploitation' | 'Compromised';
export const MARKOV_STATES: ManualSecurityState[] = ['Secure', 'Reconnaissance', 'Exploitation', 'Compromised'];

export interface MarkovStep {
    step: number; // Hour 0-24
    probabilities: Record<ManualSecurityState, number>;
}

export type MarkovTransitionMatrix = Record<ManualSecurityState, Record<ManualSecurityState, number>>;

export interface MarkovSummaryMetrics {
    probabilityOfCompromiseAt24h: number;
    timeTo50PercentCompromise: number | null;
    peakReconnaissanceTime: number;
    peakExploitationTime: number;
    dominantFinalState: ManualSecurityState;
}

export class MarkovEngine {
    /**
     * Creates a transition matrix based on the current Risk Score (0-10).
     * Higher risk score increases the probability of moving to worse states.
     * 
     * All probability constants are defined in lib/constants/markov-parameters.ts
     * with citations to NIST SP 800-82 and industry baselines.
     * 
     * @param riskScore - Current system risk score (0-10)
     * @returns Transition probability matrix for all states
     */
    static createTransitionMatrix(riskScore: number): MarkovTransitionMatrix {
        // Normalize risk score to 0-1 factor
        const riskFactor = Math.min(Math.max(riskScore / 10, 0), 1);

        // =====================================================================
        // SECURE STATE TRANSITIONS
        // =====================================================================
        // Base probability: 5% attack initiation (low risk)
        // Max probability: 30% attack initiation (high risk)
        const pSecureToRecon = BASE_PROB_SECURE_TO_RECON + (riskFactor * SCALE_PROB_SECURE_TO_RECON);
        const pSecureToSecure = 1 - pSecureToRecon;

        // =====================================================================
        // RECONNAISSANCE STATE TRANSITIONS
        // =====================================================================
        // Base probability: 10% escalation to exploitation (low risk)
        // Max probability: 50% escalation (high risk)
        const pReconToExploit = BASE_PROB_RECON_TO_EXPLOIT + (riskFactor * SCALE_PROB_RECON_TO_EXPLOIT);

        // Defender regression: 10% chance of returning to Secure state
        const pReconToSecure = PROB_RECON_TO_SECURE;

        // Remaining probability: stay in Reconnaissance state
        const pReconToRecon = 1 - pReconToExploit - pReconToSecure;

        // =====================================================================
        // EXPLOITATION STATE TRANSITIONS
        // =====================================================================
        // Base probability: 15% successful compromise (low risk)
        // Max probability: 70% successful compromise (high risk)
        const pExploitToCompromised = BASE_PROB_EXPLOIT_TO_COMPROMISED + (riskFactor * SCALE_PROB_EXPLOIT_TO_COMPROMISED);

        // Defender regression: 10% chance of dropping back to Reconnaissance
        const pExploitToRecon = PROB_EXPLOIT_TO_RECON;

        // Remaining probability: stay in Exploitation state
        const pExploitToExploit = 1 - pExploitToCompromised - pExploitToRecon;

        // =====================================================================
        // COMPROMISED STATE TRANSITIONS (Absorbing State)
        // =====================================================================
        // Equation policy for this build:
        // Compromised is modeled as an absorbing state: [0, 0, 0, 1].
        // This is a deliberate, documented change requested for publication-grade
        // Markov validation. It means this 24-hour attack progression forecast
        // models attack absorption, not post-incident remediation.
        const pCompromisedToSecure = 0;
        const pCompromisedToCompromised = 1;

        // =====================================================================
        // CONSTRUCT TRANSITION MATRIX
        // =====================================================================
        return {
            'Secure': {
                'Secure': pSecureToSecure,
                'Reconnaissance': pSecureToRecon,
                'Exploitation': 0,
                'Compromised': 0
            },
            'Reconnaissance': {
                'Secure': pReconToSecure,
                'Reconnaissance': Math.max(0, pReconToRecon),
                'Exploitation': pReconToExploit,
                'Compromised': 0
            },
            'Exploitation': {
                'Secure': 0,
                'Reconnaissance': pExploitToRecon,
                'Exploitation': Math.max(0, pExploitToExploit),
                'Compromised': pExploitToCompromised
            },
            'Compromised': {
                'Secure': pCompromisedToSecure,
                'Reconnaissance': 0,
                'Exploitation': 0,
                'Compromised': pCompromisedToCompromised
            }
        };
    }

    static validateTransitionMatrix(matrix: MarkovTransitionMatrix): boolean {
        return MARKOV_STATES.every((state) => {
            const row = matrix[state];
            const rowSum = MARKOV_STATES.reduce((sum, target) => sum + row[target], 0);
            const probabilitiesValid = MARKOV_STATES.every((target) => row[target] >= 0 && row[target] <= 1);
            return probabilitiesValid && Math.abs(rowSum - 1) <= PROBABILITY_TOLERANCE;
        });
    }

    /**
     * Simulates the system state over N time steps (hours).
     * 
     * Uses matrix multiplication to compute probability distributions:
     * P(t+1) = P(t) × TransitionMatrix
     * 
     * @param riskScore - Current risk score (0-10)
     * @param hours - Duration to simulate (default: 24 hours)
     * @returns Array of probability distributions for each time step
     */
    static simulateAttackProgression(riskScore: number, hours: number = 24): MarkovStep[] {
        const matrix = this.createTransitionMatrix(riskScore);
        const history: MarkovStep[] = [];

        // Initial State: 100% Secure
        let currentState: Record<ManualSecurityState, number> = {
            'Secure': 1.0,
            'Reconnaissance': 0,
            'Exploitation': 0,
            'Compromised': 0
        };

        history.push({ step: 0, probabilities: { ...currentState } });

        for (let t = 1; t <= hours; t++) {
            const nextState: Record<ManualSecurityState, number> = {
                'Secure': 0,
                'Reconnaissance': 0,
                'Exploitation': 0,
                'Compromised': 0
            };

            // Matrix Multiplication: Next = Current * Transition
            for (const fromState of Object.keys(currentState) as ManualSecurityState[]) {
                const probFrom = currentState[fromState];
                if (probFrom === 0) continue;

                for (const toState of Object.keys(nextState) as ManualSecurityState[]) {
                    const probTrans = matrix[fromState][toState];
                    nextState[toState] += probFrom * probTrans;
                }
            }

            // Normalize to prevent floating-point drift
            const sum = Object.values(nextState).reduce((a, b) => a + b, 0);
            for (const k of Object.keys(nextState) as ManualSecurityState[]) {
                nextState[k] /= sum;
            }

            currentState = nextState;
            history.push({ step: t, probabilities: { ...currentState } });
        }

        return history;
    }

    static summarize(history: MarkovStep[]): MarkovSummaryMetrics {
        const finalStep = history[history.length - 1];
        const finalProbabilities = finalStep?.probabilities ?? {
            Secure: 1,
            Reconnaissance: 0,
            Exploitation: 0,
            Compromised: 0,
        };

        const timeTo50PercentCompromise = history.find((step) => step.probabilities.Compromised >= 0.5)?.step ?? null;
        const peakReconnaissance = history.reduce((best, step) =>
            step.probabilities.Reconnaissance > best.probabilities.Reconnaissance ? step : best, history[0]);
        const peakExploitation = history.reduce((best, step) =>
            step.probabilities.Exploitation > best.probabilities.Exploitation ? step : best, history[0]);
        const dominantFinalState = MARKOV_STATES.reduce((best, state) =>
            finalProbabilities[state] > finalProbabilities[best] ? state : best, 'Secure' as ManualSecurityState);

        return {
            probabilityOfCompromiseAt24h: finalProbabilities.Compromised,
            timeTo50PercentCompromise,
            peakReconnaissanceTime: peakReconnaissance.step,
            peakExploitationTime: peakExploitation.step,
            dominantFinalState,
        };
    }

    static historyToCsv(history: MarkovStep[]): string {
        const rows = [
            ['hour', ...MARKOV_STATES],
            ...history.map((step) => [
                step.step,
                ...MARKOV_STATES.map((state) => step.probabilities[state]),
            ]),
        ];
        return rows.map((row) => row.join(',')).join('\n');
    }

    static transitionMatrixToCsv(matrix: MarkovTransitionMatrix): string {
        const rows = [
            ['from_state', ...MARKOV_STATES],
            ...MARKOV_STATES.map((state) => [
                state,
                ...MARKOV_STATES.map((target) => matrix[state][target]),
            ]),
        ];
        return rows.map((row) => row.join(',')).join('\n');
    }
}
