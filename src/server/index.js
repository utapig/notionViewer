// dotenvを最初にロード
require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

console.log('=== Environment Check ===')
console.log('NOTION_TOKEN exists:', !!process.env.NOTION_TOKEN)
console.log('NOTION_TOKEN length:', process.env.NOTION_TOKEN?.length)
console.log('========================')

// ミドルウェア
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

// データベースをクエリ（新しいAPI: data_sources）
app.post('/api/databases/:databaseId/query', async (req, res) => {
    try {
        const { databaseId } = req.params
        console.log('Querying database:', databaseId)

        // Notion APIに直接リクエスト
        const response = await fetch(
            `https://api.notion.com/v1/data_sources/${databaseId}/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2025-09-03',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({

                })
            }
        )

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Notion API Error:', response.status, errorBody)
            throw new Error(`Notion API error: ${response.status} - ${errorBody}`)
        }

        const data = await response.json()
        console.log('Query successful! Found', data.results?.length || 0, 'results')
        res.json(data)
    } catch (error) {
        console.error('Error querying database:', error.message)
        res.status(500).json({ 
            error: 'Failed to query database',
            message: error.message
        })
    }
})

// データベース情報を取得
app.get('/api/databases/:databaseId', async (req, res) => {
    try {
        const { databaseId } = req.params
        console.log('Retrieving database:', databaseId)

        const response = await fetch(
            `https://api.notion.com/v1/databases/${databaseId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28'
                }
            }
        )

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Notion API Error:', response.status, errorBody)
            throw new Error(`Notion API error: ${response.status}`)
        }

        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error('Error retrieving database:', error.message)
        res.status(500).json({ 
            error: 'Failed to retrieve database',
            message: error.message
        })
    }
})

// ページを取得
app.get('/api/pages/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params
        console.log('Retrieving page:', pageId)

        const response = await fetch(
            `https://api.notion.com/v1/pages/${pageId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28'
                }
            }
        )

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status}`)
        }

        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error('Error retrieving page:', error.message)
        res.status(500).json({ error: error.message })
    }
})

// ページを更新
app.put('/api/pages/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params
        const { properties } = req.body
        console.log('Updating page:', pageId)

        const response = await fetch(
            `https://api.notion.com/v1/pages/${pageId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ properties })
            }
        )

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Notion API Error:', response.status, errorBody)
            throw new Error(`Notion API error: ${response.status}`)
        }

        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error('Error updating page:', error.message)
        res.status(500).json({ error: error.message })
    }
})

// ページを作成
app.post('/api/pages', async (req, res) => {
    try {
        const { parent, properties } = req.body
        console.log('Creating page')

        const response = await fetch(
            `https://api.notion.com/v1/pages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ parent, properties })
            }
        )

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Notion API Error:', response.status, errorBody)
            throw new Error(`Notion API error: ${response.status}`)
        }

        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error('Error creating page:', error.message)
        res.status(500).json({ error: error.message })
    }
})

// ヘルスチェック
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        notionConfigured: !!process.env.NOTION_TOKEN
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`)
    console.log(`📝 Notion Token: ${process.env.NOTION_TOKEN ? '✅ Set' : '❌ Not set'}`)
})