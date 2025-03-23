const REQUIRED_METHODS = [
    'findAll', 'findById', 'create', 'update', 'delete', 'bulkCreate', 'bulkDelete'
];

export function validateRepository(repo) {
    const missing = REQUIRED_METHODS.filter(m => typeof repo[m] !== 'function');
    if (missing.length > 0) {
        throw new Error(`Invalid repository: missing ${missing.join(', ')}`);
    }
    return repo;
}
