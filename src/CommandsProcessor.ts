import * as vscode from "vscode";
import { Command, CommandData } from "./Interfaces";
import OpenFilesCommand from "./commands/OpenFilesCommand";
import VSCodeCommand from "./commands/VSCodeCommand";

export default class CommandsProcessor {
  private commands: Array<Command> = [];

  registerCommand(command: Command) {
    this.commands.push(command);
  }

  parseCommand(commandData: CommandData) {
    try {
      switch (commandData.command) {
        case "openFiles":
          this.registerCommand(
            new OpenFilesCommand(commandData.args.data, commandData.args.layout)
          );
          break;

        case "runCommands":
          commandData.args.data.forEach((action: any) => {
            this.registerCommand(new VSCodeCommand(action.id, action.args));
          });
          break;

        default:
          vscode.window.showErrorMessage("Invalid command !");
          break;
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(error.toString());
    }
  }

  async executeCommands() {
    try {
      for (let command of this.commands) {
        await command.execute();
      }
      vscode.window.showInformationMessage(
        "The commands have been executed successfully !"
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(error.toString());
    } finally {
      this.clearCommands();
    }
  }

  clearCommands() {
    this.commands = [];
  }
}
