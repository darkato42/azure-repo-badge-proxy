# azure-repo-badge-proxy

Example badges:

![example](./images/example.png)

## Prerequisites

1.  `GitVersion.Tool` is installed as a dotnet tool
1.  Run the gitversion dotnet CLI command in pipelines.

    ```
    dotnet gitversion /updateassemblyinfo /output buildserver
    ```
    This task will update the build number so `alpha` and `beta` can be searched with wildcards.
1.  Stable builds doesn't have a searchable keyword. An alternative is to [add a stable tag to the build](https://github.com/colindembovsky/cols-agent-tasks/tree/main/Tasks/TagBuild).
    ![add-tag-to-build](./images/add-tag-to-build.png)


## Alpha build badge

```
![Project.Lib](https://azure-badge-proxy.netlify.app/fetch-azure-badge/org/project/1?name=Project.Lib&buildNumber=*alpha*)
```

## Beta build badge

```
![Project.Lib](https://azure-badge-proxy.netlify.app/fetch-azure-badge/org/project/1?name=Project.Lib&buildNumber=*beta*)
```

## Stable build badge

```
![Project.Lib](https://azure-badge-proxy.netlify.app/fetch-azure-badge/org/project/1?name=Project.Lib&tagFilters=stable)
```