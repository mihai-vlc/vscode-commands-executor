import { Command } from "../Interfaces";
import * as vscode from "vscode";

export default class VSCodeCommand implements Command {
  constructor(private id: string, private args?: Object) {}

  async execute() {
    if (this.args) {
      await vscode.commands.executeCommand(this.id, this.args);
    }

    await vscode.commands.executeCommand(this.id);
  }
}
