/**
 * Agent Welcome Email Data interface
 * Used for sending welcome emails to newly created agent accounts
 */
export interface AgentWelcomeEmailData {
  agentName: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}
