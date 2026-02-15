import type { NotionPage, DatabaseQueryResponse } from '../types/notion'

// ✅ プロキシ経由なので '/api' で OK
const API_BASE_URL = '/api'

/**
 * データベースからページ一覧を取得
 */
export async function queryDatabase(databaseId: string): Promise<NotionPage[]> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/databases/${databaseId}/query`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json() as DatabaseQueryResponse
        return data.results
    } catch (error) {
        console.error('Error querying database:', error)
        throw error
    }
}

/**
 * データベース情報を取得
 */
export async function getDatabase(databaseId: string) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/databases/${databaseId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Error retrieving database:', error)
        throw error
    }
}

/**
 * 特定のページを取得
 */
export async function getPage(pageId: string) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/pages/${pageId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Error retrieving page:', error)
        throw error
    }
}

/**
 * ページを更新
 */
export async function updatePage(pageId: string, properties: any) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/pages/${pageId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ properties })
            }
        )

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Error updating page:', error)
        throw error
    }
}

/**
 * ページを作成
 */
export async function createPage(parent: any, properties: any) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/pages`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ parent, properties })
            }
        )

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Error creating page:', error)
        throw error
    }
}

/**
 * プロパティから値を抽出するヘルパー関数
 */
export function extractPropertyValue(property: any): string {
    if (!property) return ''

    switch (property.type) {
        case 'title':
            return property.title?.[0]?.plain_text || ''
        case 'rich_text':
            return property.rich_text?.[0]?.plain_text || ''
        case 'number':
            return property.number?.toString() || ''
        case 'select':
            return property.select?.name || ''
        case 'multi_select':
            return property.multi_select?.map((s: any) => s.name).join(', ') || ''
        case 'date':
            return property.date?.start || ''
        case 'checkbox':
            return property.checkbox ? '✓' : ''
        case 'url':
            return property.url || ''
        case 'email':
            return property.email || ''
        case 'phone_number':
            return property.phone_number || ''
        default:
            return ''
    }
}