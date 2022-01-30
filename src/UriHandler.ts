import * as vscode from "vscode";
import * as querystring from "querystring";
import CommandsProcessor from "./CommandsProcessor";

class CustomUriHandler implements vscode.UriHandler {
  private disposables: vscode.Disposable[] = [];

  constructor(
    private context: vscode.ExtensionContext,
    private commandsProcessor: CommandsProcessor
  ) {}

  register() {
    this.disposables.push(vscode.window.registerUriHandler(this));
  }

  handleUri(uri: vscode.Uri) {
    let command = uri.path.replace(/\//g, "");

    if (!command) {
      return;
    }

    let args: any = querystring.parse(uri.query);

    if ("data" in args) {
      try {
        args.data = JSON.parse(args.data);
      } catch (error: any) {
        vscode.window.showErrorMessage("Invalid data: " + error.toString());
        return;
      }
    }

    let commandData = {
      command: command,
      args: args,
    };

    if (args.newWindow) {
      this.context.globalState.update("postponedCommand", commandData);
      vscode.commands.executeCommand("workbench.action.newWindow");
    } else {
      this.commandsProcessor.parseCommand(commandData);
      this.commandsProcessor.executeCommands();
    }
  }
}

export default CustomUriHandler;
