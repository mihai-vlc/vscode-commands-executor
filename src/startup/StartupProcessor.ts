import * as vscode from "vscode";
import { RuleConfiguration } from "./RuleConfiguration";
import StartupRule from "./StartupRule";

export default class StartupProcessor {
  private rules: StartupRule[] = [];

  readConfigurations() {
    const config = vscode.workspace.getConfiguration(
      "vscode-commands-executor"
    );
    const rulesList = config.get("startupRules") as RuleConfiguration[];

    this.rules = rulesList.map((ruleConfig) => {
      return new StartupRule(ruleConfig);
    });
  }

  async runCommands() {
    try {
      for (const rule of this.rules) {
        if (await rule.isApplicable()) {
          await rule.executeCommands();
        }
      }
    } catch (e) {
      console.error(e);
      vscode.window.showErrorMessage(
        "Failed to executed the startup commands: " + e
      );
    }
  }
}
