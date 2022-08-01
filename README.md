# azure-repo-badge-proxy

Example badges:

![example](./images/example.png)

This service is implemented as a serverless edge function using [Netlify Edge Functions](https://docs.netlify.com/netlify-labs/experimental-features/edge-functions/). It fetchs the last build info (sourceBranch and version) given `buildNumber=*alpha*` or `tagFilters=stable` from Azure DevOps REST API. A second call was made to get the build badge. Azure API Endpoints used are below:

- [Fetch the latest build with filters](https://docs.microsoft.com/en-us/rest/api/azure/devops/build/builds/list?view=azure-devops-rest-7.1)
- [Fetch the build badge with labels](https://docs.microsoft.com/en-us/rest/api/azure/devops/build/status/get?view=azure-devops-rest-7.1)

## Deployment to Netlify

1. Import your project from a GitHub repository
1. Create an Azure PAT with the **Build (Read)** permission.
1. Add an environment variable in Netlify site settings named `AZURE_PAT` with the PAT value above.
1. The CI/CD should work by default.

## Azure Pipeline Build Tasks

1.  `GitVersion.Tool` is installed as a dotnet tool
1.  Run the gitversion dotnet CLI command in pipelines.

    ```
    dotnet gitversion /updateassemblyinfo /output buildserver
    ```
    This task will update the build number so `alpha` and `beta` can be searched with wildcards.
1.  Stable builds doesn't have a searchable keyword. An alternative is to [add a stable tag to the build](https://github.com/colindembovsky/cols-agent-tasks/tree/main/Tasks/TagBuild).
    ![add-tag-to-build](./images/add-tag-to-build.png)


## Embed build badges in markdown

-   Alpha
    ```
    ![Project.Lib](https://azure-badge-proxy.netlify.app/fetch-azure-badge/org/project/1?name=Project.Lib&buildNumber=*alpha*)
    ```
-   Beta
    ```
    ![Project.Lib](https://azure-badge-proxy.netlify.app/fetch-azure-badge/org/project/1?name=Project.Lib&buildNumber=*beta*)
    ```
-   Stable
    ```
    ![Project.Lib](https://azure-badge-proxy.netlify.app/fetch-azure-badge/org/project/1?name=Project.Lib&tagFilters=stable)
    ```

