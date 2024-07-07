<script setup>
const user = ref(null)
const newPlatform = ref({ name: '', logoUrl: '', number: '', email: '' })

const createPlatform = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/platforms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPlatform.value)
    })

    if (response.ok) {
        alert('Platform created successfully')
        await fetchUser()
    } else {
        console.error('Failed to create platform')
    }
}

const updatePlatform = async (platform) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/platforms`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(platform)
    })

    if (response.ok) {
        alert('Platform updated successfully')
        await fetchUser()
    } else {
        console.error('Failed to update platform')
    }
}

const deletePlatform = async (id) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/platforms`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
    })

    if (response.ok) {
        alert('Platform deleted successfully')
        await fetchUser()
    } else {
        console.error('Failed to delete platform')
    }
}

const fetchUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    const response = await fetch('/api/user/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (response.ok) {
        const userData = await response.json()
        user.value = userData
        email.value = userData.email
        name.value = userData.name
    }
}

onMounted(fetchUser)

</script>


<template>
    <section v-if="user">
        <h2>Platforms</h2>
        <ul>
            <li v-for="platform in user.platforms" :key="platform.id">
                <div>
                    <p>Name: <input type="text" v-model="platform.name" /></p>
                    <p>Logo URL: <input type="text" v-model="platform.logoUrl" /></p>
                    <p>Number: <input type="text" v-model="platform.number" /></p>
                    <p>Email: <input type="email" v-model="platform.email" /></p>
                    <button @click="updatePlatform(platform)">Update Platform</button>
                    <button @click="deletePlatform(platform.id)">Delete Platform</button>
                </div>
            </li>
        </ul>
        <form @submit.prevent="createPlatform">
            <h3>Create Platform</h3>
            <div>
                <label for="platformName">Name:</label>
                <input type="text" v-model="newPlatform.name" />
            </div>
            <div>
                <label for="platformLogoUrl">Logo URL:</label>
                <input type="text" v-model="newPlatform.logoUrl" />
            </div>
            <div>
                <label for="platformNumber">Number:</label>
                <input type="text" v-model="newPlatform.number" />
            </div>
            <div>
                <label for="platformEmail">Email:</label>
                <input type="email" v-model="newPlatform.email" />
            </div>
            <button type="submit">Create Platform</button>
        </form>
    </section>
    <section v-else>
        <p>You must be logged in to view this page</p>
    </section>

</template>

<style scoped>
/*  */
</style>