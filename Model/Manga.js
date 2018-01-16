
module.exports = class Manga {

    /**   CONSTRUCTORS   */

	constructor(id, reference, title, volumeNumber, description, categorie, publishDate, price, publisher, mangaka, genres, images) {
        this._id = id;
        this._reference = reference;
		this._title = title;
		this._volumeNumber = volumeNumber;
		this._description = description;
		this._categorie = categorie;
		this._publishDate = publishDate;
		this._price = price;
		this._publisher = publisher;
		this._mangaka = mangaka;
		this._genres = genres;
		this._images = images;
    }
    

    /**   GETTERS   **/

	get id() { return this._id; }

	get reference() { return this._reference; }

	get title() { return this._title; }

	get volumeNumber() { return this._volumeNumber; }

	get description() { return this._description; }

    get categorie() { return this._categorie; }

	get publishDate() { return this._publishDate; }

	get price() { return this._price; }

	get publisher() { return this._publisher; }

	get mangaka() { return this._mangaka; }

    get genres() { return this._genres; }

    get images() { return this._images; }
}