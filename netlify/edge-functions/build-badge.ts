import { Context } from "netlify:edge";

function getAuthHeader(): (string) {
    // Convert PAT for Basic Auth
    const pat = Deno.env.get("AZURE_PAT");
    if(!pat){
        console.log("No PAT found. Please add an environment variable called AZURE_PAT");
        return "";
    }

    const base64PAT = btoa(":" + pat);
    return "Basic " + base64PAT;
}

export default async (request: Request, context: Context) => {
    // Extract query params from request url
    // e.g. host/fetch-azure-badge/org/project/42?name=MyProject&buildNumber=*alpha*&tagFilters=alpha
    const requestUri = new URL(request.url);
    const pathRegex = /\/fetch-azure-badge\/(.+?)\/(.+?)\/(\d+)/;
    const match = requestUri.pathname.match(pathRegex);
    if (!match) {
        console.log("no match of build id in request url");
        return;
    }
    const [, org, project, buildDefinitionId] = match;
    const params = new URLSearchParams(requestUri.search);
    const name = params.get('name');
    const buildNumberFilter = params.get('buildNumber');
    const tagFilters = params.get("tagFilters");
    
    // Get the latest build info
    var urlBuildInfo = `https://dev.azure.com/${org}/${project}/_apis/build/builds?definitions=${buildDefinitionId}&$top=1`

    if(buildNumberFilter)
        urlBuildInfo += `&buildNumber=${buildNumberFilter}`;

    if (tagFilters)
        urlBuildInfo += `&tagFilters=${tagFilters}`;

    console.log("urlBuildInfo: " + urlBuildInfo);

    const authHeader = getAuthHeader();
    const responseBuildInfo = await fetch(urlBuildInfo, {
        "headers": {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    });
    
    const buildInfoJson = await responseBuildInfo.json();
    const semVer = buildInfoJson.value[0].buildNumber;
    const sourceBranch = buildInfoJson.value[0].sourceBranch;

    // Fetch the badge given branch and label
    const urlBuildBadge = `https://dev.azure.com/${org}/${project}/_apis/build/status/${buildDefinitionId}?branchName=${sourceBranch}&label=${name} ${semVer}`;
    console.log("urlBuildBadge: " + urlBuildBadge);
    const respBuildBadge = await fetch(urlBuildBadge, {
        "headers": {
            "Authorization": authHeader
        }
    });
    return respBuildBadge;
};