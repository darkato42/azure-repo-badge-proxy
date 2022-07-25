import { Context } from "netlify:edge";



export default async (request: Request, context: Context) => {

    const pat = Deno.env.get("AZURE_PAT");
    const base64PAT = btoa(":" +pat);
    

    var uri = "https://dev.azure.com/inv-willistowerswatson/SIMS/_apis/build/status/74?api-version=6.0-preview.1&label=EsgEngine v1.0.0-beta.0";

    const response = await fetch(uri, {
        "headers": {
            "Authorization": "Basic " + base64PAT
        }
    });

    return response;
};