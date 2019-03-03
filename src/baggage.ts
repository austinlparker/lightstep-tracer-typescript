export class Baggage {
    private readonly _items: Map<string, string> = new Map<string, string>();

    /**
     * Assigns a value to the provided key in the Baggage.
     *
     * @param {string} key
     * @param {string} value
     * @memberof Baggage
     */
    public Set(key: string, value: string): void {
        this._items.set(key, value);
    }
    
    /**
     * Looks up the value of a key in the Baggage. 
     *
     * @param {string} key
     * @returns {string} If the key is not found, this is an empty string.
     * @memberof Baggage
     */
    public Get(key: string): string {
        return this._items.get(key) || ""
    }

    /**
     * Gets all of the current Baggage.
     *
     * @returns {Map<string, string>}
     * @memberof Baggage
     */
    public GetAll(): Map<string, string> {
        return this._items;
    }

    /**
     * Merge two baggages together.
     *
     * @param {Baggage} other
     * @memberof Baggage
     */
    public Merge(other: Baggage): void {
        this.merge(other.GetAll())
    }

    private merge(other: Map<string, string>): void {
        if (other == null) {
            return;
        }
        other.forEach((key, value) => this.Set(key, value))
    }
}

export default Baggage;