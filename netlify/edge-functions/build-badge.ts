import { Context } from "netlify:edge";

export default async (request: Request, context: Context) => {

    // Convert PAT for Basic Auth
    const pat = Deno.env.get("AZURE_PAT");
    if(!pat){
        console.log("No PAT found. Please add an environment variable called AZURE_PAT");
        return;
    }

    const base64PAT = btoa(":" + pat);
    
    // Extract query params from request url
    const requestUri = new URL(request.url);
    const pathRegex = /\/fetch-azure-badge\/(.+?)\/(.+?)\/(\d+)/;
    const match = requestUri.pathname.match(pathRegex);
    if (!match) {
        console.log('no match');
        return;
    }
    const org = match[1];
    const project = match[2];
    const buildDefinitionId = match[3];

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

    const respBuildInfo = await fetch(urlBuildInfo, {
        "headers": {
            "Authorization": "Basic " + base64PAT,
            "Accept": "application/json"
        }
    });
    
    const buildInfoJson = await respBuildInfo.json();
    const semVer = buildInfoJson.value[0].buildNumber;
    const sourceBranch = buildInfoJson.value[0].sourceBranch;

    // Fetch the badge
    const urlBuildBadge = `https://dev.azure.com/${org}/${project}/_apis/build/status/${buildDefinitionId}?branchName=${sourceBranch}&label=${name} ${semVer}`;
    console.log("urlBuildBadge: " + urlBuildBadge);
    const respBuildBadge = await fetch(urlBuildBadge, {
        "headers": {
            "Authorization": "Basic " + base64PAT
        }
    });
    return respBuildBadge;
};