import { Context } from "netlify:edge";

export default async (request: Request, context: Context) => {

    const pat = Deno.env.get("AZURE_PAT");

    return new Response(`${pat}`);

    const joke = await fetch("https://icanhazdadjoke.com/", {
        "headers": {
            "Accept": "application/json"
        }
    });

    const jsonData = await joke.json();
    return context.json(jsonData);
};