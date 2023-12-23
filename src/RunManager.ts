
'use strict';
import * as fs from 'fs';
import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";



export class RunManager implements vscode.Disposable {
  private terminal: vscode.Terminal | null;
  private isRunning: boolean = false;
  private workspaceFolder: string | undefined;
  private cwd: string | undefined;
  private showOutputOnOutputChannel:boolean = false;
  private executorMap:object | undefined;
  private config: vscode.WorkspaceConfiguration | undefined;
  private extensionNameMapByLanaguageId:object | undefined;
  private document: vscode.TextDocument | undefined;
  // private setAlias:boolean = true;


  constructor(){
    this.terminal= null;
    this.config = undefined; 
  }

  public async run() {
    //the async function for running the document
    //  1.It checks if this file is already running; if so, it displays a message and returns.

    if (this.isRunning) {
      vscode.window.showInformationMessage("This File is already running!!!");
      return;
    }

    //# here by this i ma assuming that the code is running from the vs code edotor itself and not from the file explorer
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      //getting the document loaded at the editor
      this.document = editor.document;

    } else {
      vscode.window.showErrorMessage("No Code Found for execution ☹️");
      return;
    }

    // if it truly running from the editor and not any other case so now is the best time to iniatialize some more properties

    this.initialize();

    // this is to check the extension of the file and run the appropriate command according to the extension
    const fileExtension = path.extname(this.document.fileName);

    //this function is to provide the executor for the required extension
    const executor = this.getExecutor(fileExtension);

    if (executor === null) {
      vscode.window.showErrorMessage("This language is not supported 😞 !!!");
      return;
    }

    //no after all further we process our file
    this.getCodeFileAndExecute(true, fileExtension, executor);
  }

  //A private method because I not want it to be accessible to any of the instances and some initialization are rest for the future
  private initialize() {

    //!why a config ? what is it's significance?
    //* to get access of configurations of the extension which i have setted
    this.config = vscode.workspace.getConfiguration("exet", this.document.uri); 

    //* here I don't allow the user to set the cwd on there own may be the feature appear in the future

    // we need to have the workspace folder path

    //for that we have to get the workspace folders

    //if we had some file to execute then we will search for the workspace folder
    this.workspaceFolder = this.document
      ? this.getWorkSpaceFolder()
      : undefined;


        // console.log("workspaceFolder: ",this.workspaceFolder);
        // vscode.window.showInformationMessage(this.workspaceFolder);
    if (!this.workspaceFolder && this.document && !this.document.isUntitled) {
      // if we have the file only in the workspace we will assign its path as the cwd
      this.cwd = path.dirname(this.document.fileName);

    } else {
      //if we have the workspacefolder then this would be relevant to be the cwd
      this.cwd = this.workspaceFolder;
    }
  }

  private getWorkSpaceFolder() {
    const foldersArray = vscode.workspace.workspaceFolders;

    //here if ther are many folders then we have to choose either the relevant one or the first one
    if (foldersArray) {
      const workspaceFolder: vscode.WorkspaceFolder | undefined =
        vscode.workspace.getWorkspaceFolder(this.document.uri);

      //if our code is within some folder then we would provide the folder path

      if (workspaceFolder) {
        return workspaceFolder.uri.fsPath; // returns string
      }

      return foldersArray[0].uri.fsPath;
    }
    //if we didn't event found the folders Array then we will return undefined may be because there is no other folder in the workspace may be a file only

    return undefined;
  }

  private getExecutor(fileExtension: string) {
    //letting the user know the file is srunning
    this.isRunning = true;

    //* the identification is solely depended over the fileExtension


    let executor = null;

    if (!fileExtension) {
      vscode.window.showInformationMessage("Can't execute an unknown file 😐");
      return executor;
    }

    //here we will leverage the executor mapping from the file's extension

    //! this is the map of executor to the extension name

    const workspaceConfig = vscode.workspace.getConfiguration("exet");
      this.executorMap = workspaceConfig.get("executorMap");

    const executorMap = this.executorMap;

    // console.log("this is the executor map : ",executorMap);

    if (!executorMap || executorMap === undefined) {
      vscode.window.showErrorMessage("Something went wrong (Executor Map)");
      return;
    }

    for (let platform of Object.keys(executorMap)) {

      if(platform === this.osPlatform())
      {
        const osPlatform = executorMap[platform];
        for (let ext of Object.keys(osPlatform)) {
          if (ext === fileExtension) {
            executor = osPlatform[ext];
            break;
          }
        }
    
      }
  }

    if(executor === undefined || !executor)
    {
      vscode.window.showErrorMessage("Can't find the appropriate executor may be the language is not supported 🥲");
      return;

    }
    return executor;

    //~ Function to add the unknow language support
  }

  private getCodeFileAndExecute(
    appendFile: boolean = true,
    fileExtension: string,
    executor: string
  ) {
    //Executing the command in the integrated terminal

    const activeTextEditor = vscode.window.activeTextEditor;

    //if all the extensions is configured to save all files before run then do so

    if (this.config.get("saveAllFilesBeforeRun")) {
      return vscode.workspace.saveAll().then(() => {
        this.executeCommand(executor, appendFile);
      });
    }

    //I am explicitely assuming that the code file is runned from the editor

    return this.document.save().then(() => {
      this.executeCommand(executor, appendFile);
    });
  }

  private executeCommand(executor: string, appendFile: boolean) {

    //again asking my configuration to run form terminal or from the output terminal

    this.executeCommandInTerminal(executor, appendFile);
  }

  //executing command from terminal

  private executeCommandInTerminal(
    executor: string,
    appendFile: boolean = true
  ) {
    if (!this.terminal) {
     
      const _doc:vscode.TextDocument= this.document;

      const fileProps = {
        fileName: path.basename(_doc?.fileName),
        fileNameWithoutExt: path
          .basename(_doc.fileName)
          .replace(/(\.)[a-zA-Z]+$/, ""),
        dir: path.dirname(_doc.fileName),
        workSpace:this.workspaceFolder,
        fileNameWithDir:_doc.fileName,
      };

  

    executor = this.setExecutorVariables(fileProps,executor,this.osPlatform());

      //I will set the terminal (to open the terminal default)
      const terminals = vscode.window.terminals;
      this.terminal = terminals
        ? terminals[0]
        : vscode.window.createTerminal("NewTerm"); // the first terminal will execute our output or new terminal will be created

      }
      
      //! the file below is important i have commented them for a while
      
      if(this.terminal === undefined 
        || this.terminal === null) {
          // vscode.window.showInformationMessage("Please set the terminal!!");
          this.terminal = vscode.window.createTerminal("Code");
        }
      
        // console.log("os of the platform is: ",this.osPlatform());
        // console.log("terminal: ",this.terminal)
      //   if(this.terminal == undefined || this.terminal==null)
      //  {
      //   vscode.window.createTerminal("NewTerm");
      //   console.log("terminal: ",this.terminal);
      //  }
    // this.terminal = null;

        
       (this.terminal || this.terminal !== undefined)? this.terminal.show(true):vscode.window.showErrorMessage("Something went wrong will generating output at terminal");


       const ext = path.extname(path.basename(this.document.fileName));


       

       
    //finally the command will be written on the terminal


    
    this.terminal.sendText(executor, appendFile);

    // if(!this.showOutputOnOutputChannel)
    // {this.terminal.sendText(executor, appendFile);}

    // else {
    //   this.runFromTheOutputChannel(executor,ext);
    // }

    

    this.isRunning = false;


       //now cretaing the progress bar like thing

     
    //   const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    //   statusBarItem.text = 'Progress 0%';
      
    //   function updateProgress(progress: number) {
    //     statusBarItem.text = `Progress: ${progress}%`;
    //     statusBarItem.show();
    // }



  }

  private setExecutorVariables(fileProps: {
    fileName: string;
    fileNameWithoutExt: string;
    dir: string;
    workSpace: string;
    fileNameWithDir:string;
  },executor:string,platform:string)
   {
      //* here I am checking that whether this patterns match in the overall executor string

      const varCheckerAndReplace=[
        {variable:/\@dir/g ,replaceStatement:fileProps.dir},
        {variable:/\@fileNameWithDir/g ,replaceStatement:fileProps.fileNameWithDir},
        {variable:/\@fileNameWithoutExt/g ,replaceStatement:fileProps.fileNameWithoutExt},
        {variable:/\@workSpace/g ,replaceStatement:fileProps.workSpace},
        {variable:/\@fileName/g ,replaceStatement:fileProps.fileName},
      ];

      
      for(const keys of varCheckerAndReplace)
      {
        executor = executor.replace(keys.variable, keys.replaceStatement); 
      }
    

      return executor;
  }

  private osPlatform()
  {
    return os.platform();
  }

  // private runFromTheOutputChannel(executor:string,ext:string)
  // {

  //   const workspaceConfig = vscode.workspace.getConfiguration("exet");

  //     this.extensionNameMapByLanaguageId = workspaceConfig.get("extensionNameMapByLanaguageId");

  //     if(this.extensionNameMapByLanaguageId == undefined || !this.extensionNameMapByLanaguageId)
  //     {
  //       console.log(
  //         "not able to find the languageId object"
  //       );
  //       return;
  //     }

  //     let languageId;

  //     for(let keys of Object.keys(this.extensionNameMapByLanaguageId))
  //     {
  //         if(keys===ext)
  //         {
  //           languageId = this.extensionNameMapByLanaguageId[ext];
  //         }
  //     }


    


  //   const output_ = vscode.window.createOutputChannel(`Output.${languageId}`,languageId);

  //   output_.show();

  //   output_.append(executor);
  // }

  // this is of no use kindly ignore it
  public dispose():void
  {
    console.log("RunManager disposed");
  }

}


//! problems

//1. the name is not comming with the string literals ("") [done]
//2. regex match problem [done]




//! why micromatch over minimatch and the vscode.languages.match?

// * micromatch (advance and can able to handle complex search) > minimatch

// vscoded's api  provides the number of matched files


//darwin - for macOs  


