<template>
    <div id="app">
        <header class="app-header">
            <h1>📓 Notion Viewer</h1>
            <p class="subtitle">Notionデータベースビューワー</p>
        </header>

        <main class="app-main">
            <DatabaseList />
        </main>

        <footer class="app-footer">
            <p>学習用プロジェクト - Vue 3 + Vite + Notion API</p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import DatabaseList from './components/DatabaseList.vue'
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f5f5;
}

#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 1rem;
    opacity: 0.9;
}

.app-main {
    flex: 1;
    padding: 2rem 1rem;
}

.app-footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}

.app-footer p {
    font-size: 0.875rem;
    opacity: 0.8;
}

@media (max-width: 768px) {
    .app-header h1 {
        font-size: 1.75rem;
    }

    .app-main {
        padding: 1rem 0.5rem;
    }
}
</style>