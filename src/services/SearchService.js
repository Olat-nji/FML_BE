class SearchService {
    async fuzzySearch(Model, query) {
        const result = await Model.fuzzySearch(query);
        return result;
    }
}

module.exports = new SearchService();
