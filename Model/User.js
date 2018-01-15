
module.exports = class User {

    /**   CONSTRUCTORS   */

	constructor(first_name, last_name, pseudo, email, phone, pwd) {
		this._first_name = first_name;
		this._last_name = last_name;
		this._pseudo = pseudo;
		this._email = email;
		this._phone = phone;
		this._pwd = pwd;
    }
    

    /**   GETTERS   **/

	get first_name() { return this._first_name; }

	get last_name() { return this._last_name; }

	get pwd() { return this._pwd; }

	get pseudo() { return this._pseudo; }

	get email() { return this._email; }

    get phone() { return this._phone; }
    

    /**   SETTERS   */

	set isAdmin(value) { this._isAdmin = value; }
}