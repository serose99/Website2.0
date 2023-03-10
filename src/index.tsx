import React, { SyntheticEvent, useState } from "react";
import ReactDOM from "react-dom/client";
import { Helmet } from "react-helmet";
import "./index.css";
import { AboutMe, Contact } from "./about";
import { Epic, TechBlue } from "./experience";
import { Pitt } from "./education";
import { MachineLearning, DraftGenie } from "./portfolio";
import Typing from "react-typing-animation";
import Draggable from "react-draggable";

var lines: JSX.Element[] = [];
var currentFolder: string = "";
//To add a "file":
//  1. Add the filename to the correct folder's list
//  2. Create a component function for the file
//  3. Add the filename as a case in fileToComp that will call the component
var folders: { [folder: string]: string[] } = {
    About: ["me.txt", "contact.txt"],
    Education: ["Pitt.txt"],
    Experience: ["Epic.py", "TechBlue.txt"],
    Portfolio: ["github.lnk", "machineLearning.txt", "DraftGenie.txt"],
    Socials: ["linkedin.lnk"],
};
var shortcuts: { [shortcut: string]: string } = {
    "Github.lnk": "https://github.com/serose99",
    "linkedin.lnk": "https://www.linkedin.com/in/serose99/",
};
//Use this as a key on ConsoleInput because it won't re-render on clear typically
var count = 0;

//#region Main App
const rootEl = document.getElementById("root");
if (!rootEl) {
    throw new Error("Something went wrong!");
}

const root = ReactDOM.createRoot(rootEl);
//TODO: add header text back
addOutput(<HeaderText />);
const firstInp = document.getElementById("consoleInput");
firstInp?.focus();
//#endregion

//#region Components

/**
 * Main Component to print out list of command lines
 *
 * @return {Console} {JSX.Element}
 */
function Console(): JSX.Element {
    return (
        <>
            <Helmet>
                <title>Sam's Website</title>
            </Helmet>
            <div>{lines}</div>
        </>
    );
}

/**
 * Component for single line of console
 *
 * @return {ConsoleLine}  {JSX.Element}
 */
function ConsoleLine(): JSX.Element {
    return (
        <p>
            samrosenberg:\{currentFolder}
            {">"} <ConsoleInput />
        </p>
    );
}

/**
 * Component for input element of console line
 *
 * @return {ConsoleInput}  {JSX.Element}
 */
function ConsoleInput(): JSX.Element {
    const onkeydown = (event: any) => {
        if (event.key === "Enter") {
            readLine(event);
        } else if (event.key === "Tab") {
            event.preventDefault();
            autoComplete(event);
        }
    };

    return (
        <input
            type="text"
            autoFocus
            onKeyDown={onkeydown}
            key={count++}
            id="consoleInput"
        ></input>
    );
}

/**
 * Component for cool header text that types itself
 *
 * @return {HeaderText}  {JSX.Element}
 */
function HeaderText(): JSX.Element {
    const WelcomeText = "Welcome!";
    const bodyText =
        "My name is Sam Rosenberg and I'm a software developer (can you tell).";
    const helpText =
        'Try typing "help" in the input below or try listing some directories!';

    return (
        <>
            <Typing>
                <Typing.Speed ms={30} />
                <h2>{WelcomeText}</h2>
                <br></br>
                <h3>{bodyText}</h3>
                <br></br>
                <p>{helpText}</p>
                <br></br>
            </Typing>
        </>
    );
}

/**
 * Component to print out list of "folders" when user enters "ls"
 *
 * @return {Folders} {JSX.Element}
 */
function Folders(): JSX.Element {
    return (
        <p>
            <strong>
                {Object.keys(folders).map((value) => {
                    return value + "\t";
                })}
            </strong>
        </p>
    );
}

/**
 * Component to print out list of files when user enters "ls" inside a folder
 *
 * @return {Files}  {JSX.Element}
 */
function Files(): JSX.Element {
    return (
        <p>
            {folders[currentFolder].map((value: string) => {
                return value + "\t";
            })}
        </p>
    );
}

/**
 * Component to list out specified text on new line
 *
 * @param {textProps} props - pass text to print
 * @return {TextLine}  {JSX.Element}
 */
function TextLine(props: textProps): JSX.Element {
    return (
        <>
            <p>{props.text}</p>
        </>
    );
}

/**
 * Component to print out help text whn user enters "help"
 *
 * @return {HelpText}  {JSX.Element}
 */
function HelpText(): JSX.Element {
    return (
        <div>
            <h2>Welcome to my website!</h2>
            <p>
                This is meant to be a fun side project to display more about
                myself and my work.
            </p>
            <p>
                It will be an eternal WIP so if something isn't working, feel
                free to add an issue on the github page.
            </p>
            <br></br>
            <p>
                This probably isn't like most websites so I'll fill you in on
                how to navigate around here.
            </p>
            <br></br>
            <p>Try out this list of commands and see what you can find:</p>
            <p>
                <strong>ls</strong>: lists out "subdirectories" and "files"
            </p>
            <p>
                <strong>
                    cd {"<"}directory name{">"}
                </strong>
                : change working directory to new specified directory
            </p>
            <p>
                <strong>
                    cat {"<"}filename{">"}
                </strong>
                : writes out the contents of the specified file
            </p>
            <p>
                <strong>
                    start {"<"}filename{">"}
                </strong>
                : starts a program (Hint: use with ".lnk" files)
            </p>
            <p>
                <strong>clear</strong>: clear the terminals output
            </p>
            <br></br>
            <p>
                Type <strong>help</strong> at any point to bring this screen
                back up if you need a refresher!
            </p>
            <br></br>
        </div>
    );
}

class FileExplorer extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            curFolder: "",
            displayedFiles: Object.keys(folders),
            displayType: "folder", //TODO: figure out how to use types?interfaces?
        };

        this.openFolder = this.openFolder.bind(this);
        this.returnHome = this.returnHome.bind(this);
    }

    openFolder(event: any) {
        if (Object.keys(folders).includes(event.target.id)) {
            this.setState({
                curFolder: event.target.id,
                displayedFiles: folders[event.target.id],
            });
        }
    }

    returnHome(event: any) {
        this.setState({ curFolder: "", displayedFiles: Object.keys(folders) });
    }

    render() {
        return (
            <Draggable handle=".handle">
                <div className="fileExplorer">
                    <div className="handle">
                        <div className="backArrow">{"<"}</div>
                        <div className="forwardArrow">{">"}</div>
                        <div className="homeFolder" onClick={this.returnHome}>
                            Home
                        </div>
                        <div className="openFolder">{this.state.curFolder}</div>
                        <div
                            className="closeButton"
                            onClick={closeFileExplorer}
                        ></div>
                    </div>
                    <div className="folderList"></div>
                    <div className="display">
                        {this.state.displayedFiles.map((value) => {
                            return (
                                <div
                                    className={value.split(".")[1] ?? "folder"}
                                    id={value}
                                    key={value}
                                    onDoubleClick={this.openFolder}
                                >
                                    {value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Draggable>
        );
    }
}

function openGUI() {
    root.render(<FileExplorer />);
}

function closeFileExplorer() {
    clearConsole();
}

//#endregion

//#region Helper Functions
/**
 * Adds a line(component) to the console
 *
 * @param {JSX.Element} [line] - component to add
 */
function addOutput(line?: JSX.Element) {
    if (line) {
        lines.push(line);
    }
    //TODO: Remove this when its working
    //lines.push(<button onClick={openGUI}>Click to open GUI</button>);

    lines.push(<ConsoleLine />);
    root.render(<Console />);
}

/**
 * Interpret commands inputted
 *
 * @param {*} event - contains properties of html event
 */
function readLine(event: any): void {
    const command = event.target.value.split(" ")[0];
    const args = event.target.value.split(" ")[1];
    switch (command) {
        case "help":
            printHelpText();
            break;
        case "ls":
            printList();
            break;
        case "clear":
            clearConsole();
            break;
        case "cd":
            changeFolder(args);
            break;
        case "cat":
            info(args);
            break;
        case "start":
            start(args);
            break;
        case "python":
            python(args);
            break;
        case "":
            return;
        default:
            commandNotUnderstood(command);
            break;
    }
    event.target.disabled = true;
}

function autoComplete(event: any): void {
    const command = event.target.value.split(" ")[0];
    const args = event.target.value.split(" ")[1];
    var autocomplete;
    if (currentFolder === "") {
        autocomplete = Object.keys(folders).filter((folder) =>
            folder.toLowerCase().startsWith(args)
        );
    } else {
        autocomplete = folders[currentFolder].filter((file) =>
            file.toLowerCase().startsWith(args)
        );
    }
    if (autocomplete.length > 0) {
        event.target.value = command + " " + autocomplete;
    }
}

/**
 * Prints out the help text when user enters "help"
 *
 */
function printHelpText() {
    addOutput(<HelpText />);
    root.render(<Console />);
}

/**
 * Prints out list of files or folders depending on current user directory
 *
 */
function printList() {
    if (currentFolder === "") {
        addOutput(<Folders />);
    } else {
        addOutput(<Files />);
    }
}

/**
 * Clear the console
 *
 */
function clearConsole() {
    lines = [];
    addOutput(<HeaderText />);
}

/**
 * Change directory to new folder
 *
 * @param {string} folder - folder to change in to
 */
function changeFolder(folder: string) {
    if (Object.keys(folders).includes(folder)) {
        currentFolder = folder;
        addOutput();
    } else if (folder === "..") {
        currentFolder = "";
        addOutput();
    } else {
        const whatFolder = "cd: " + folder + ": No such file or directory";
        addOutput(<TextLine text={whatFolder} />);
    }
}

/**
 * Print the contents of a "file"
 *
 * @param {string} file - file to print out
 */
function info(file: string) {
    if (folders[currentFolder].includes(file)) {
        fileToComp(file);
    } else {
        const whatFile = "cat: " + file + ": No such file or directory";
        addOutput(<TextLine text={whatFile} />);
    }
}

/**
 * Converts filename to it's respective component function
 * I wanted to use eval for this but there are security risks :(
 * @param {string} file - file to print out
 */
function fileToComp(file: string) {
    switch (file) {
        case "Me.txt":
            addOutput(<AboutMe />);
            break;
        case "Epic.py":
            addOutput(<Epic />);
            break;
        case "Pitt.txt":
            addOutput(<Pitt />);
            break;
        case "MachineLearning.txt":
            addOutput(<MachineLearning />);
            break;
        case "Contact.txt":
            addOutput(<Contact />);
            break;
        case "TechBlue.txt":
            addOutput(<TechBlue />);
            break;
        case "DraftGenie.txt":
            addOutput(<DraftGenie />);
            break;
        default:
            addOutput();
            break;
    }
}

/**
 * Launches shortcut links in new windows
 *
 * @param {string} shortcut - shortcut file to
 */
function start(shortcut: string) {
    if (
        folders[currentFolder]?.includes(shortcut) &&
        Object.keys(shortcuts)?.includes(shortcut)
    ) {
        window.open(shortcuts[shortcut], "_blank", "noreferrer");
        addOutput();
    } else {
        const whatFile = "cat: " + shortcut + ": No such file or directory";
        addOutput(<TextLine text={whatFile} />);
    }
}

function python(file: string) {
    const ext = file.split(".")[1];
    if (ext === "py") {
        const prize =
            "Congrats! You found secret cookie #2! Find all 3 for a special prize!";
        addOutput(<TextLine text={prize} />);
    } else {
        const suggest = "Hmm, this command typically works for .py files...";
        addOutput(<TextLine text={suggest} />);
    }
}

/**
 * Prints out line for missing commands
 *
 * @param {string} command - uninterpretable command
 */
function commandNotUnderstood(command: string) {
    const whatCommand = '"' + command + '"  not recognized';
    addOutput(<TextLine text={whatCommand} />);
}

/**
 * Interface to pass properties to TextLine
 *
 * @interface textProps
 */
interface textProps {
    text: string;
}

interface IState {
    curFolder: string;
    displayedFiles: string[];
    displayType: string;
}

interface IProps {}
