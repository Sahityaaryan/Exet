# Exet 

Hello world from Exet!

This extension provide smooth coding experience to the coders and programmers by managing the executable files like .exe (in cpp || c)
or .class files (in java) or .js files (in Ts).

This will create a separate folder for all the executable files of a particualr language and executable files of any file in any folder inside the workspace will be stored in this folder and will execute smoothly

# How to run it?
Just hit ctrl+1

# Tutorials
 - [Complete setup (English)](https://www.youtube.com/watch?v=NzduTSxpZ6Y)
 - [Complete setup (Hindi)](https://www.youtube.com/watch?v=XpYY_aEnbJQ)



## Features

1. Handles the exe files for the cpp and c langauge in a single folder "exetFiles" so that your workspace will look clear and consistent
2. Handles the class files for the java langauge in a single folder "exetClasses" so that your workspace will look clear and consistent
3. Handles the emittedJs files for the typescript in a single folder "exetEmittedJsFiles" to make your workspace clear and consistent
4. Run code per filename
5. Support REPL by running code in Integrated Terminal (default)
6. Supports langauges such as cpp, c , java, javascript, typescript
7. Can manage the executables of any script at any level of folder inside the workspace 


## Requirements

- To use powershell for the running the scripts it must be of version 7 or newer.
- To run typescript you must have typescript compiler in your system `tsc`

## Extension Settings

This extension contributes the following settings:

* `exet.enable`: Enable/disable this extension.
* `exet.executorMap`: Executor map to map the extension name with the requrire execution command.
* `exet.extensionNameMapByLanaguageId`: This is to map the extension name with the corresponding languageId.

## Known Issues

- If your a windows user then prefer using command prompt or if want to use powershell then update your powershell to 7 or newer version 

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

The extension will manage the executables of all the files inside the folder

### 1.1.0

Added feature: The extension will manage the executables of all the file inside the root directory only

### 1.1.1

---

## What I have not included

- support for execute the command in the output terminal because the output channel can't take input and eventually the terminal can be used for both input and output.
- Run from file explorer 
- SheBang support
- Run by language

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
