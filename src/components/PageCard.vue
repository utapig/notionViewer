<template>
    <div class="page-card">
        <div class="page-card-header">
            <h3>{{ title }}</h3>
            <span class="page-id">ID: {{ pageId }}</span>
        </div>
        <div class="page-card-content">
            <div v-for="(value, key) in displayProperties" :key="key" class="property-row">
                <span class="property-name">{{ key }}:</span>
                <span class="property-value">{{ value }}</span>
            </div>
        </div>
        <div class="page-card-footer">
            <small>作成: {{ formatDate(createdTime) }}</small>
            <small>更新: {{ formatDate(lastEditedTime) }}</small>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NotionPage } from '../types/notion'
import { extractPropertyValue } from '../services/notionService'

const props = defineProps<{
    page: NotionPage
}>()

const title = computed(() => {
    // Titleプロパティを探す
    const titleProp = Object.values(props.page.properties).find(
        (prop) => prop.type === 'title'
    )
    return extractPropertyValue(titleProp) || '(タイトルなし)'
})

const pageId = computed(() => props.page.id.slice(0, 8))

const createdTime = computed(() => props.page.created_time)
const lastEditedTime = computed(() => props.page.last_edited_time)

const displayProperties = computed(() => {
    const properties: Record<string, string> = {}

    Object.entries(props.page.properties).forEach(([key, value]) => {
        // Titleは既に表示しているのでスキップ
        if (value.type === 'title') return

        const extracted = extractPropertyValue(value)
        if (extracted) {
            properties[key] = extracted
        }
    })

    return properties
})

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP')
}
</script>

<style scoped>
.page-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    background-color: white;
    transition: box-shadow 0.3s ease;
}

.page-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.page-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f0f0f0;
}

.page-card-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.25rem;
}

.page-id {
    font-size: 0.75rem;
    color: #999;
    font-family: monospace;
}

.page-card-content {
    margin-bottom: 1rem;
}

.property-row {
    display: flex;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f5f5f5;
}

.property-row:last-child {
    border-bottom: none;
}

.property-name {
    font-weight: 600;
    color: #666;
    min-width: 120px;
    margin-right: 1rem;
}

.property-value {
    color: #333;
    flex: 1;
}

.page-card-footer {
    display: flex;
    justify-content: space-between;
    padding-top: 0.5rem;
    border-top: 1px solid #f0f0f0;
}

.page-card-footer small {
    color: #999;
    font-size: 0.75rem;
}
</style>