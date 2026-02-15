import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { id } = req.query
        
        console.log('Querying database:', id)

        const response = await fetch(
            `https://api.notion.com/v1/databases/${id}/query`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            }
        )

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Notion API Error:', response.status, errorBody)
            throw new Error(`Notion API error: ${response.status}`)
        }

        const data = await response.json()
        console.log('Query successful! Found', data.results?.length || 0, 'results')
        
        res.status(200).json(data)
    } catch (error: any) {
        console.error('Error querying database:', error.message)
        res.status(500).json({ 
            error: 'Failed to query database',
            message: error.message
        })
    }
}