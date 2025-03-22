export function validate(schema, data, path = '') {
    return validateValue(schema, data, path || 'root');
}

export function validateMany(schema, dataArray) {
    return dataArray.map((data, i) => ({
        index: i,
        errors: validate(schema, data, `[${i}]`)
    })).filter(result => result.errors.length > 0);
}

function validateValue(schema, data, path) {
    const errors = [];
    const addError = (msg) => errors.push(`${path}: ${msg}`);

    if (schema.required && (data === undefined || data === null)) {
        addError('Field is required.');
        return errors;
    }

    if (data === undefined || data === null) return errors;

    const type = inferType(schema);

    switch (type) {
        case 'object':
            return validateObject(schema, data, path);
        case 'array':
            return validateArray(schema, data, path);
        case 'string':
        case 'number':
        case 'boolean':
            return validatePrimitive(schema, data, path);
        default:
            addError(`Unknown type: ${type}`);
            return errors;
    }
}

function inferType(schema) {
    if (schema.fields) return 'object';
    if (schema.items) return 'array';
    return schema.type;
}

function validateObject(schema, data, path) {
    const errors = [];
    if (typeof data !== 'object' || Array.isArray(data)) {
        errors.push(`${path}: Expected object`);
        return errors;
    }
    for (const key in schema.fields || {}) {
        const nested = validateValue(schema.fields[key], data[key], `${path}.${key}`);
        errors.push(...nested);
    }
    return errors;
}

function validateArray(schema, data, path) {
    const errors = [];
    if (!Array.isArray(data)) {
        errors.push(`${path}: Expected array`);
        return errors;
    }
    data.forEach((item, index) => {
        const nested = validateValue(schema.items, item, `${path}[${index}]`);
        errors.push(...nested);
    });
    return errors;
}

function validatePrimitive(schema, data, path) {
    if (typeof data !== schema.type) {
        return [`${path}: Expected type ${schema.type}, got ${typeof data}`];
    }
    return [];
}
