
/**
 * 		[Linux]: ".cpp":"cd @workSpace && ([[ ! -d exetFiles ]] & mkdir -p exetFiles) && cd @dir && g++ @fileName -o @workSpace/exetFiles/@fileNameWithoutExt && @workSpace/exetFiles/@fileNameWithoutExt",
 * 
 */


// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {RunManager} from "./RunManager";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "exet" is now active!');


	//* The command has been defined in the package.json file
	//* Now provide the implementation of the command with registerCommand
	//* The commandId parameter must match the command field in package.json

	let disposable = vscode.commands.registerCommand("exet.helloWorld", () => {
      vscode.window.showInformationMessage("Jai mata di!");
    });

	
    // Corrected indentation for the 'run' command registration
    let run = vscode.commands.registerCommand("exet.run",async () => {
      
		try {
			const runCode = new RunManager();
      // start the execution
      runCode.run();
		} catch (e) {
			console.log("Error while execution: ",e);	
		}
		
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(run);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log("deactivating 😎!!!");
}



// Question

// 1. what is the work of selection [done]

// 2. how to setup the config for my extension [done]

// 3. how to setup my executor map [done]

//4. how to update my executor with the cwd in the executor map [done]


//5. Updating the cli config for linux

// 6. How to create only one exetFile for the entire workspace

// - ".cpp":"cd @dir && (if not exist exetFiles mkdir exetFiles) & g++ @fileName -o exetFiles/@fileNameWithoutExt && @dir\/exetFiles\/@fileNameWithoutExt", [windows]
// - ".cpp":" cd @dir && mkdir -p @dir/exetFiles & g++ @fileName -o @dir/exetFiles/@fileNameWithoutExt &&  @dir/exetFiles/@fileNameWithoutExt", [Ubuntu]



// cd /home/sahitya/Desktop/test && mkdir -p exetFiles & g++ try.cpp -o testexetFiles/try &&  /home/sahitya/Desktop/test/exetFiles/try


// space in g++try.cpp

// extra "//" after -o : /home/sahitya/Desktop/testexetFiles//try &&  /home/sahitya/Desktop/testexetFiles//try

// cd /home/sahitya/Desktop/test/Cpp && mkdir -p exetFiles & g++ try.cpp -o /home/sahitya/Desktop/test/Cpp/exetFiles/try &&  /home/sahitya/Desktop/test/Cpp/exetFiles/try

//  cd /home/sahitya/Desktop/test/Cpp && mkdir -p exetFiles & g++ try.cpp -o /home/sahitya/Desktop/test/Cpp/exetFiles/try &&  /home/sahitya/Desktop/test/Cpp/exetFiles/try >/dev/null 2>&1


