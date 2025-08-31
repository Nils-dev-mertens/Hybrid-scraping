export interface Company {
    Id: number;
    Baseurl: string;
    Companyname: string;
    extensions?: Extension[] | null;
}

export interface Extension {
    Id?: number;
    Extensionstring: string;
    AiModel: Aimodel | "Human_made"; // 👈 Embedded model object, not just a reference
    Ai_generated: boolean;
    Verified: boolean;
    Tag: string;
    Last_edited: Date;
    ElementSelectors: string[];
    InputType: "Nothing" | "pdf" | "link" | "html"
    Returntype : "Nothing" |"string" | "file"
}

export interface ExtensionInput {
    Extensionstring: string;
    CompanyName: string;
    AiModel: Aimodel | "Human_made"; // 👈 Embedded model object, not just a reference
    Ai_generated: boolean;
    ElementSelectors: string[];
    InputType: "Nothing" | "pdf" | "link" | "html"
    ReturnType : "Nothing" |"string" | "file"
}

export interface Aimodel {
    name: string;
    thought: boolean;
    fast: boolean;
    Provider: Aiprovider; // 👈 Embedded provider object
}

export interface Aiprovider {
    Id: number;
    Name: string;
}
