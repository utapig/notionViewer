// Notionのレスポンス型定義（簡略版）
export interface NotionPage {
    id: string
    created_time: string
    last_edited_time: string
    properties: {
        [key: string]: NotionProperty
    }
}

export interface NotionProperty {
    id: string
    type: string
    // Title型
    title?: Array<{
        plain_text: string
    }>
    // Rich Text型
    rich_text?: Array<{
        plain_text: string
    }>
    // Number型
    number?: number
    // Select型
    select?: {
        name: string
        color?: string
    }
    // Multi-select型
    multi_select?: Array<{
        name: string
        color?: string
    }>
    // Date型
    date?: {
        start: string
        end?: string
    }
    // Checkbox型
    checkbox?: boolean
    // URL型
    url?: string
    // Email型
    email?: string
    // Phone型
    phone_number?: string
}

export interface NotionDatabase {
    id: string
    title: Array<{
        plain_text: string
    }>
    properties: {
        [key: string]: {
            id: string
            name: string
            type: string
        }
    }
}

export interface DatabaseQueryResponse {
    results: NotionPage[]
    has_more: boolean
    next_cursor: string | null
}