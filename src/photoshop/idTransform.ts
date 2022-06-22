import { invokePsService } from './utils';

export async function charIDToTypeID(charIDList: string[]) {
    return invokePsService<number[]>('charIDToTypeID', {
        placeholders: {
            charIDList: JSON.stringify(charIDList),
        },
    });
}

export async function charIDToStringID(charIDList: string[]) {
    return invokePsService<string[]>('charIDToStringID', {
        placeholders: {
            charIDList: JSON.stringify(charIDList),
        },
    });
}

export async function stringIDToTypeID(stringIDList: string[]) {
    return invokePsService<number[]>('stringIDToTypeID', {
        placeholders: {
            stringIDList: JSON.stringify(stringIDList),
        },
    });
}

export async function stringIDToCharID(stringIDList: string[]) {
    return invokePsService<string[]>('stringIDToCharID', {
        placeholders: {
            stringIDList: JSON.stringify(stringIDList),
        },
    });
}

export async function typeIDToCharID(typeIDList: number[]) {
    return invokePsService<string[]>('typeIDToCharID', {
        placeholders: {
            typeIDList: JSON.stringify(typeIDList),
        },
    });
}

export async function typeIDToStringID(typeIDList: number[]) {
    return invokePsService<string[]>('typeIDToStringID', {
        placeholders: {
            typeIDList: JSON.stringify(typeIDList),
        },
    });
}
