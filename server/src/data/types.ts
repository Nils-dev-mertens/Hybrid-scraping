export interface Company {
    id: number;
    base_url: string;
    company_name: string;
    // extensions are linked via the company_extensions join table
    extensions?: Extension[] | null;
}

export interface User {
    id: number;
    username: string;
    apikey: string;
    extensions?: Extension[] | null;
}

export interface Extension {
    id: number;
    // matches DB column `file_name`
    file_name: string;
    // owner of the extension (users.id)
    user_id: number;
    // ai_model_id can be null in the DB
    ai_model_id?: number | null;
    action_name: string;
    ai_generated: boolean;
    verified: boolean;
    last_edited: Date;
    // foreign keys
    input_type_id: number;
    return_type_id: number;

    // Not stored directly on the extensions table, but useful when joined
    // company relations exist in `company_extensions`
    company_ids: number;

    // optional runtime-only fields
    query_selectors?: string[];

    // Optional hydrated fields
    input_type?: InputTypeModule;
    return_type?: ReturnTypeModule;
    ai_model?: AiModel | null;
    user?: User;
}

export interface InputTypeModule {
    id: number;
    value: string;
}

export interface ReturnTypeModule {
    id: number;
    value: string;
}

export interface AiModel {
    id: number;
    model_name: string;
    thought: boolean;
    fast_generation: boolean;
    ai_provider_id: number;
    provider?: AiProvider;
}

export interface AiProvider {
    id: number;
    name: string;
}
