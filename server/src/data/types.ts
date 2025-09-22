export interface Company {
    id: number;
    base_url: string;
    company_name: string;
    extensions?: Extension[] | null;
}

export interface Extension {
    id: number;
    company_id: number;
    ai_model_id: number;
    action_name: string;
    ai_generated: boolean;
    verified: boolean;
    tag: string;
    last_edited: Date;
    query_selectors: string[];
    input_type_id: number;
    return_type_id: number;

    // Optional hydrated fields
    input_type?: InputTypeModule;
    return_type?: ReturnTypeModule;
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
