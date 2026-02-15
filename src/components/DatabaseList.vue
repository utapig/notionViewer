<template>
    <div class="database-list">
        <div class="database-header">
            <h2>Notionデータベース</h2>
            <button @click="fetchData" :disabled="loading" class="refresh-button">
                {{ loading ? '読み込み中...' : '更新' }}

            </button>
        </div>

        
        <!-- エラー表示 -->
        <div v-if="error" class="error-message">
            <p>❌ エラーが発生しました</p>
            <p class="error-detail">{{ error }}</p>
        </div>

        <!-- ローディング表示 -->
        <LoadingSpinner v-if="loading" message="データを読み込んでいます..." />

        <!-- データ表示 -->
        <div v-else-if="pages.length > 0" class="pages-container">
            <p class="pages-count">{{ pages.length }} 件のページが見つかりました</p>
            <PageCard v-for="page in pages" :key="page.id" :page="page" />
        </div>

        <!-- データがない場合 -->
        <div v-else-if="!loading && !error" class="no-data">
            <p>データがありません</p>
            <p class="hint">環境変数を確認してください</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { queryDatabase } from '../services/notionService'
import type { NotionPage } from '../types/notion'
import LoadingSpinner from './LoadingSpinner.vue'
import PageCard from './PageCard.vue'

const pages = ref<NotionPage[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const databaseId = import.meta.env.VITE_NOTION_DATABASE_ID

const fetchData = async () => {
    if (!databaseId) {
        error.value = 'データベースIDが設定されていません。.envファイルを確認してください。'
        return
    }

    loading.value = true
    error.value = null

    try {
        pages.value = await queryDatabase(databaseId)
    } catch (err) {
        error.value = err instanceof Error ? err.message : '不明なエラーが発生しました'
        console.error('Failed to fetch data:', err)
    } finally {
        loading.value = false
    }
}

// コンポーネントマウント時にデータ取得
onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.database-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.database-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.database-header h2 {
    margin: 0;
    color: #333;
}

.refresh-button {
    padding: 0.5rem 1rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
}

.refresh-button:hover:not(:disabled) {
    background-color: #2980b9;
}

.refresh-button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.error-message {
    background-color: #ffe6e6;
    border: 1px solid #ff4444;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.error-message p {
    margin: 0.5rem 0;
    color: #cc0000;
}

.error-detail {
    font-size: 0.9rem;
    color: #666;
}

.pages-container {
    margin-top: 1rem;
}

.pages-count {
    margin-bottom: 1rem;
    color: #666;
    font-size: 0.9rem;
}

.no-data {
    text-align: center;
    padding: 3rem;
    color: #999;
}

.no-data p {
    margin: 0.5rem 0;
}

.hint {
    font-size: 0.85rem;
    color: #bbb;
}
</style>