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
    let addParagraph = function(text)
    {
        let paragraph = document.createElement("p");
        let textNode = document.createTextNode(text);

        paragraph.appendChild(textNode);
        commandsDiv.appendChild(paragraph);
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

            addParagraph("git clone " + repoUrl);
            addParagraph("cd " + repoName);
            addParagraph("git fetch --all");

            if (branches.length > 0)
            {
                addParagraph(" # ------------------------------------------------------------------------- #");
                addParagraph(" # Inizio del fetch dei branch...");
                addParagraph(" #");

                for (let branch of branches)
                {
                    addParagraph("git checkout " + branch.name);
                }
                
                addParagraph(" #");
                addParagraph(" # Fine del fetch dei branch...");
                addParagraph(" # ---------------------------------------------------------------- #");
            }

            if (pulls.length > 0)
            {
                addParagraph(" # ------------------------------------------------------------------------- #");
                addParagraph(" # Inizio del fetch delle pull request...");
                addParagraph(" #");

                for (let pull of pulls)
                {
                    addParagraph("git fetch origin pull/" + pull.number + "/head:pulls/" + pull.number);
                }
                
                addParagraph(" #");
                addParagraph(" # Fine del fetch delle pull request...");
                addParagraph(" # ---------------------------------------------------------------- #");
            }

            addParagraph("git pull --all");
            addParagraph("git pull --tags");

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

            alert("Si è verificato un errore sconosciuto.\n" +
                  "Si consiglia di leggere i dettagli presenti nella console per ricevere ulteriori informazioni.");
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

            alert("Si è verificato un errore sconosciuto.\n" +
                  "Si consiglia di leggere i dettagli presenti nella console per ricevere ulteriori informazioni.");
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

        let regex = new RegExp("^https:\/\/github.com/(.*?)/(.*?)/?$", "gi");
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
            alert("Inserisci un URL di un repository di GitHub valido.");
        }
    };

    // Listeners...
    //
    goButton.addEventListener("click", goButtonClicked);

})(window);
