const { addonBuilder } = require("stremio-addon-sdk");

const manifest = { 
    "id": "community.simpsonizando",
    "version": "1.0.1",

    "name": "Simpzonizando",
    "description": "Simpsons Latino",

    // set what type of resources we will return
    "resources": [
        "catalog",
        "stream"
    ],

    "types": ["movie", "series"], // your add-on will be preferred for those content types

    // set catalogs, we'll be making 2 catalogs in this case, 1 for movies and 1 for series
    "catalogs": [
        {
            type: 'series',
            id: 'simpsonserie'
        },
        {
            type: 'movie',
            id: 'simpsonsmovies'
        },

    ],

    // prefix of item IDs (ie: "tt0032138")
    "idPrefixes": [ "tt" ]

};

const dataset = {
    // fileIdx is the index of the file within the torrent ; if not passed, the largest file will be selected
    "tt0462538": { name: "The Simpsons Movie", type: "movie", infoHash: "24c8802e2624e17d46cd555f364debd949f2c81e", fileIdx: 0 },
    "tt0096697:1:1": { name: "S01E01", type: "series", url: "http://lestraigocast.ddns.net:3000/Simpsons/s01/Los%20Simpsons%20-%20S01E01%20-%20Especial%20de%20Navidad.mp4"},
    "tt0096697:1:2": { name: "S01E02", type: "series", url: "http://lestraigocast.ddns.net:3000/Simpsons/s01/Los%20Simpsons%20-%20S01E02%20-%20Bart%20Es%20un%20Genio.mp4"},
};

const builder = new addonBuilder(manifest);

// Streams handler
builder.defineStreamHandler(function(args) {
    if (dataset[args.id]) {
        return Promise.resolve({ streams: [dataset[args.id]] });
    } else {
        return Promise.resolve({ streams: [] });
    }
})

const METAHUB_URL = "https://images.metahub.space"

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

    return Promise.resolve({ metas: metas })
})

module.exports = builder.getInterface()
