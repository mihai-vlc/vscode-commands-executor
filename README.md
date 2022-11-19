# VSCode Commands Executor

Enables the execution of vscode commands on open startup vscode via the vscode:// URI,
keyboard shortcuts and based on workspace conditions

## Features

### Executing commands via the vscode:// URI

```sh
code --open-url 'vscode://ionutvmi.vscode-commands-executor/runCommands?data=[{"id": "workbench.action.editorLayoutThreeRows"}, {"id": "workbench.action.files.newUntitledFile"}, { "id": "default:type", "args": { "text": "Very nice !" } }]'

code --open-url 'vscode://ionutvmi.vscode-commands-executor/openFiles?data=[{"path": "C:/tmp/test.txt" }]&layout=TwoColumns'

code --open-url 'vscode://ionutvmi.vscode-commands-executor/openFiles?data=[{"path": "C:/tmp/test.txt", "column": "Two" }]&layout=TwoColumns&newWindow=true'

```

Depending on what terminal you are using you might need to url encode the data:

```powershell
# To work correctly in powershell
code --open-url 'vscode://ionutvmi.vscode-commands-executor/runCommands?data=%5B%7B%22id%22%3A%20%22workbench.action.editorLayoutThreeRows%22%7D%2C%20%7B%22id%22%3A%20%22workbench.action.files.newUntitledFile%22%7D%2C%20%7B%20%22id%22%3A%20%22default%3Atype%22%2C%20%22args%22%3A%20%7B%20%22text%22%3A%20%22Very%20nice%20%21%22%20%7D%20%7D%5D'

code --open-url """vscode://ionutvmi.vscode-commands-executor/openFiles?data=%5B%7B%22path%22%3A%20%22C%3A%2Ftmp%2Ftest.txt%22%20%7D%5D&layout=TwoColumns"""

```

### Executing commands via custom keyboard bindings

To register custom keyboard shortcuts for a groups of commands follow the examples below.

```jsonc
[
  // keybindings.json
  {
    "key": "ctrl+alt+/",
    "command": "vscode-commands-executor.run",
    "args": {
      "command": "openFiles",
      "args": {
        "layout": "TwoColumns",
        "data": [
          {
            "path": "C:/tmp/test.txt",
            "column": "Two"
          }
        ]
      }
    }
  },
  {
    "key": "ctrl+alt+\\",
    "command": "vscode-commands-executor.run",
    "args": {
      "command": "runCommands",
      "args": {
        "data": [
          {
            "id": "workbench.action.editorLayoutThreeRows"
          },
          {
            "id": "workbench.action.files.newUntitledFile"
          },
          {
            "id": "default:type",
            "args": {
              "text": "Very nice !"
            }
          }
        ]
      }
    }
  }
]
```

## Supported commands

### openFiles

Opens a list of files and optionally configures an editor layout.

Parameters:

| Parameter | Required | Description                                                                                                                                                                                                                                                                                        |
| :-------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data      | Yes      | Array of objects - contains the list of files that will be opened. <br/><br/>A file consists of the following:<br/> - `path` - full path to the document on the disk<br/>- `column` - The location of the files in the configured layout. Possible values are described in the `vscode.ViewColumn` |
| layout    | No       | String - Triggers the following command before opening the files: `workbench.action.editorLayout<layout>`                                                                                                                                                                                          |
| newWindow | No       | Boolean - If false the files are opened in the topmost vscode window. <br/> If true it will first open a new window then open the files.                                                                                                                                                           |

### runCommands

Executes a sequence of pre-defined commands.

Parameters:

| Parameter | Required | Description                                                                                                                                                                                                                                   |
| :-------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data      | Yes      | Array of objects - contains the list of commands to be executed. <br/><br/>A commands consists of the following:<br/> - `id` - Required - the id of the command that will be executed<br/>- `args` - Optional - The arguments of the command. |
| newWindow | No       | Boolean - If `false` the commands are executed in the topmost vscode window. <br/> If `true` it will first open a new window then open the files.                                                                                             |

## Executing commands on vscode startup (initial open of vscode)

```jsonc
// settings.json
// run a command on every startup
  "vscode-commands-executor.startupRules": [
        {
            "commands": [
                { "id": "workbench.action.files.newUntitledFile" }
            ],
            "message": "Opening untitled file",
            "conditions": ["always"]
        }
  ]
```

```jsonc
// settings.json
// run a sequence of commands on startup if the workspace contains test.json
  "vscode-commands-executor.startupRules": [
        {
            "commands": [
                { "id": "workbench.action.files.newUntitledFile" },
                {
                    "id": "default:type",
                    "args": [{
                        "text": "Much wow!\nWhat a time to be alive!"
                    }]
                }
            ],
            "message": "Found test.json processing...",
            "conditions": ["hasFile: **/test.json"]
        }
  ]
```

```jsonc
// settings.json
// run a sequence of commands on startup if the one of the workspace folders is test
  "vscode-commands-executor.startupRules": [
      {
          "commands": [
              { "id": "workbench.action.files.newUntitledFile" },
              {
                  "id": "default:type",
                  "args": [{
                      "text": "Initialization complete !"
                  }]
              }
          ],
          "message": "Found workspace folder processing...",
          // both conditions need to be true for the commands to run
          "conditions": [
              "hasWorkspaceFolder: test",
              "hasFile: **/test.reg"
          ]
      }
  ]
```

```jsonc
// settings.json
// run a command with complex arguments, no notification is displayed if the message is empty/not specified
  "vscode-commands-executor.startupRules": [
      {
          "conditions": ["always"],
          "commands": [
              {
                  "id": "script-plus.commands.scriptControl.execute",
                  "args": [
                      {
                          "name": "show-info-message",
                          "description": "",
                          "lang": "ts",
                          "argumentConfig": {}
                      }
                  ]
              }
          ]
      }
  ]
```

## Startup rules structure

| Property   | Description                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| conditions | Array of strings, supported values:<br/> - always<br/> - never<br/> - hasFile: \*\*/test.reg<br/>- hasWorkspaceFolder: test |
| commands   | Array of objects (commands). Specifies the sequence of commands that will be executed if the condition is true.             |
| args       | Array of any. Represents the arguments to the command                                                                       |
| message    | String. Represents the notification message displayed if the commands will execute.                                         |

## Release Notes

[CHANGELOG.md](./CHANGELOG.md)

#### 1.1.0 - 19-Nov-2022

Implemented support for startup commands executions.

#### 1.0.0 - 30-Jan-2022

Initial Release

## Author

Mihai Ionut Vilcu

- [github/ionutvmi](https://github.com/ionutvmi)
- [twitter/mihai_vlc](http://twitter.com/mihai_vlc)
