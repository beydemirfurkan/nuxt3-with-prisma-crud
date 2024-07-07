<template>
    <div>
        <h1>Welcome</h1>
        <div v-if="user">
            <p>Welcome, {{ user.name }}!</p>
            <button @click="logout">Logout</button>
        </div>
        <div v-else>
            <nuxt-link to="/login">Login</nuxt-link> |
            <nuxt-link to="/register">Register</nuxt-link>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)

const fetchUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch('/api/user/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (response.ok) {
        user.value = await response.json()
    }
}

const logout = () => {
    localStorage.removeItem('token')
    user.value = null
}

onMounted(fetchUser)
</script>