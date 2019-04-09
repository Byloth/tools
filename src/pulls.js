(function(context)
{
    "use strict";

    // Variables...
    //
    let document = context.document;

    let branches = undefined;
    let pulls = undefined;

    let repoUrl = undefined;
    let repoUser = undefined;
    let repoName = undefined;

    let pageNumber = undefined;
    let resultsNumber = undefined;

    let user = undefined;
    let pass = undefined;

    let repoInput = document.getElementById("repo");

    let pageInput = document.getElementById("page");
    let resultsInput = document.getElementById("results");

    let userInput = document.getElementById("user");
    let passInput = document.getElementById("pass");

    let goButton = document.getElementById("go");

    let commandsDiv = document.getElementById("commands");

    // Functions...
    //
    let isEmpty = function(param)
    {
        return ((param === undefined) || (param === null) || (param === ""));
    };

    let createParagraph = function()
    {
        let _paragraph = document.createElement("p");

        let _addText = function(text)
        {
            let _textNode = document.createTextNode(text);
            let _space = document.createElement("br")

            _paragraph.appendChild(_textNode);
            _paragraph.appendChild(_space);
        };

        commandsDiv.appendChild(_paragraph);

        return {
            addText: _addText
        }
    };

    let addParagraph = function(text)
    {
        createParagraph().addText(text);
    };

    let resetVariables = function()
    {
        branches = undefined;
        pulls = undefined;

        repoUrl = undefined;
        repoUser = undefined;
        repoName = undefined;

        pageNumber = undefined;
        resultsNumber = undefined;

        user = undefined;
        pass = undefined;
    };

    let printCommands = function()
    {
        if (!isEmpty(branches) && !isEmpty(pulls))
        {
            commandsDiv.innerHTML = "";

            addParagraph("git clone https://github.com/" + repoUser + "/" + repoName + ".git");

            let start = createParagraph();

            start.addText("cd " + repoName);
            start.addText("git fetch --all");

            if (branches.length > 0)
            {
                let branching = createParagraph();

                branching.addText(" # ------------------------------------------------------------------------- #");
                branching.addText(" # Start fetching branches...");
                branching.addText(" #");

                for (let branch of branches)
                {
                    branching.addText("git checkout " + branch.name);
                }
                
                branching.addText(" #");
                branching.addText(" # Stop fetching branches...");
                branching.addText(" # ---------------------------------------------------------------- #");
            }

            if (pulls.length > 0)
            {
                let fetching = createParagraph();

                fetching.addText(" # ------------------------------------------------------------------------- #");
                fetching.addText(" # Start fetching PRs...");
                fetching.addText(" #");

                for (let pull of pulls)
                {
                    fetching.addText("git fetch origin pull/" + pull.number + "/head:pulls/" + pull.number);
                }
                
                fetching.addText(" #");
                fetching.addText(" # Stop fetching PRs...");
                fetching.addText(" # ---------------------------------------------------------------- #");
            }

            let end = createParagraph();

            end.addText("git pull --all");
            end.addText("git pull --tags");

            resetVariables();
        }
    };

    let branchesFetched = function()
    {
        try
        {
            let responseJson = JSON.parse(this.responseText);

            if ((this.readyState === 4) && (this.status === 200))
            {
                branches = responseJson;

                printCommands();
            }
            else
            {
                console.error(this);

                alert("Ready State -> " + this.readyState + "\n" +
                      "Status Code -> " + this.status + "\n" +
                      "Response Message -> \"" + responseJson.message + "\"");
            }
        }
        catch (err)
        {
            console.error(err);

            alert("An unknown error occurred.\n" +
                  "Please, read the JavaScript console of your browser for more details about this.");
        }
    };
    let pullsFetched = function()
    {
        try
        {
            let responseJson = JSON.parse(this.responseText);

            if ((this.readyState === 4) && (this.status === 200))
            {
                pulls = responseJson;
                
                printCommands();
            }
            else
            {
                console.error(this);

                alert("Ready State -> " + this.readyState + "\n" +
                      "Status Code -> " + this.status + "\n" +
                      "Response Message -> \"" + responseJson.message + "\"");
            }
        }
        catch (err)
        {
            console.error(err);

            alert("An unknown error occurred.\n" +
                  "Please, read the JavaScript console of your browser for more details about this.");
        }
    };

    let startFetching = function()
    {
        let branchesRequest = new XMLHttpRequest();
        let pullsRequest = new XMLHttpRequest();

        branchesRequest.open("GET", "https://api.github.com/repos/" + repoUser + "/" + repoName + "/branches?page=" + pageNumber + "&per_page=" + resultsNumber, true);
        pullsRequest.open("GET", "https://api.github.com/repos/" + repoUser + "/" + repoName + "/pulls?page=" + pageNumber + "&per_page=" + resultsNumber, true);

        if (!isEmpty(user) && !isEmpty(pass))
        {
            branchesRequest.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
            pullsRequest.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pass));
        }
    
        branchesRequest.onloadend = branchesFetched;
        pullsRequest.onloadend = pullsFetched;
    
        try
        {
            branchesRequest.send();
            pullsRequest.send();
        }
        catch (err) { }
    };

    let goButtonClicked = function()
    {
        repoUrl = repoInput.value;

        let regex = new RegExp("^(?:https:\/\/|git@)github.com[\/:](.*?)\/(.*?)(?:\/|\.git)?$", "gi");
        let matches =  regex.exec(repoUrl);

        if (!isEmpty(matches))
        {
            repoUser = matches[1];
            repoName = matches[2];

            pageNumber = pageInput.value;
            resultsNumber = resultsInput.value;

            user = userInput.value;
            pass = passInput.value;

            startFetching();
        }
        else
        {
            alert("Please, insert a valid GitHub repository URL.");
        }
    };

    // Listeners...
    //
    goButton.addEventListener("click", goButtonClicked);

})(window);
