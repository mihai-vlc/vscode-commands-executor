export interface Command {
  id: string;
  args: any[];
}

export interface RuleConfiguration {
  commands?: Command[];
  conditions?: string[];
  message?: string;
}
