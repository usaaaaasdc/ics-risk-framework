
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
    PROB_COMPROMISED_TO_SECURE,
} from '../constants/markov-parameters';

export type ManualSecurityState = 'Secure' | 'Reconnaissance' | 'Exploitation' | 'Compromised';

export interface MarkovStep {
    step: number; // Hour 0-24
    probabilities: Record<ManualSecurityState, number>;
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
    private static createTransitionMatrix(riskScore: number): Record<ManualSecurityState, Record<ManualSecurityState, number>> {
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
        // Remediation: 1% chance per time step of full recovery
        // (Reflects typical ICS incident response timelines: weeks to months)
        const pCompromisedToSecure = PROB_COMPROMISED_TO_SECURE;
        const pCompromisedToCompromised = 1 - pCompromisedToSecure;

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
}
