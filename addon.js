const { addonBuilder } = require("stremio-addon-sdk")

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
	"id": "community.simpsonizando",
	"version": "0.0.1",
	"catalogs": [
		{
			"type": "series",
			"id": "top"
		}
	],
	"idPrefixes": [ "tt" ],
	"resources": [
		"catalog",
		"stream"
	],
	"types": [
		"series"
	],
	"name": "simpsonizando",
	"description": "Simpsons Latino"
}

const builder = new addonBuilder(manifest)

const METAHUB_URL = "https://images.metahub.space"

const dataset = {
    "tt0096697:1:1": { name: "Los Simpsons", type: "series", url: "http://lestraigocast.ddns.net:3000/Simpsons/s01/Los%20Simpsons%20-%20S01E01%20-%20Especial%20de%20Navidad.mp4"}, 
}


const generateMetaPreview = function(value, key) {
    // To provide basic meta for our movies for the catalog
    // we'll fetch the poster from Stremio's MetaHub
    // see https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/meta.md#meta-preview-object
    const imdbId = key.split(":")[0]
    return {
        id: imdbId,
        type: value.type,
        name: value.name,
        poster: METAHUB_URL+"/poster/medium/"+imdbId+"/img",
    }
}

builder.defineCatalogHandler(function(args, cb) {
    // filter the dataset object and only take the requested type
    const metas = Object.entries(dataset)
        .filter(([_, value]) => value.type === args.type)
        .map(([key, value]) => generateMetaPreview(value, key))

	console.log(metas)

    return Promise.resolve({ metas: metas })
})

builder.defineStreamHandler(({type, id}) => {
    if (dataset[args.id]) {
        return Promise.resolve({ streams: [dataset[args.id]] });
    } else {
        return Promise.resolve({ streams: [] });
    }
})

module.exports = builder.getInterface()
