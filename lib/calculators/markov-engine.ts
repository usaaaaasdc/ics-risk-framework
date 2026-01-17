
/**
 * ICS-Risk Framework - Markov Chain Engine
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Implements Discrete Time Markov Chain (DTMC) to predict attack progression.
 */

export type ManualSecurityState = 'Secure' | 'Reconnaissance' | 'Exploitation' | 'Compromised';

export interface MarkovStep {
    step: number; // Hour 0-24
    probabilities: Record<ManualSecurityState, number>;
}

export class MarkovEngine {
    /**
     * Creates a transition matrix based on the current Risk Score (0-10).
     * Higher risk score increases the probability of moving to worse states.
     */
    private static createTransitionMatrix(riskScore: number): Record<ManualSecurityState, Record<ManualSecurityState, number>> {
        // Normalize risk score to 0-1 factor
        const riskFactor = Math.min(Math.max(riskScore / 10, 0), 1);

        // Base Transition Probabilities (Low Risk)
        // Secure -> Secure: High, Secure -> Recon: Low
        // With High Risk: Secure -> Recon increases significantly.

        const pSecureToRecon = 0.05 + (riskFactor * 0.25); // 0.05 to 0.30
        const pSecureToSecure = 1 - pSecureToRecon;

        const pReconToExploit = 0.10 + (riskFactor * 0.40); // 0.10 to 0.50
        const pReconToRecon = 1 - pReconToExploit - 0.1; // Remaining probability (some chance to go back to Secure?) - Simplified: Stay or Advance
        // Let's allow regression to Secure (Defender action)
        const pReconToSecure = 0.1;
        const _pReconToRecon = 1 - pReconToExploit - pReconToSecure;

        const pExploitToCompromised = 0.15 + (riskFactor * 0.55); // 0.15 to 0.70
        const pExploitToRecon = 0.1; // Regression
        const _pExploitToExploit = 1 - pExploitToCompromised - pExploitToRecon;

        // Compromised is an "Absorbing State" in this simple model, 
        // or highly sticky until remediation (which we can simulate as low prob exit)
        const pCompromisedToSecure = 0.01; // Remediation chance
        const _pCompromisedToCompromised = 1 - pCompromisedToSecure;

        return {
            'Secure': {
                'Secure': pSecureToSecure,
                'Reconnaissance': pSecureToRecon,
                'Exploitation': 0,
                'Compromised': 0
            },
            'Reconnaissance': {
                'Secure': pReconToSecure,
                'Reconnaissance': Math.max(0, _pReconToRecon),
                'Exploitation': pReconToExploit,
                'Compromised': 0
            },
            'Exploitation': {
                'Secure': 0,
                'Reconnaissance': pExploitToRecon,
                'Exploitation': Math.max(0, _pExploitToExploit),
                'Compromised': pExploitToCompromised
            },
            'Compromised': {
                'Secure': pCompromisedToSecure,
                'Reconnaissance': 0,
                'Exploitation': 0,
                'Compromised': _pCompromisedToCompromised
            }
        };
    }

    /**
     * Simulates the system state over N time steps (hours).
     * @param riskScore Current risk score (0-10)
     * @param hours Duration to simulate (e.g., 24)
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

            // Normalize slightly to prevent floating point drift
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
